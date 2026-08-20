-- Safe migration from product cost tracking to serial-backed quantity.
ALTER TABLE public.products DROP COLUMN IF EXISTS cost;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_quantity_nonnegative'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_quantity_nonnegative CHECK (quantity >= 0);
  END IF;
END $$;

UPDATE public.products AS products
SET quantity = serial_counts.quantity
FROM (
  SELECT product_id, COUNT(*)::integer AS quantity
  FROM public.product_serials
  GROUP BY product_id
) AS serial_counts
WHERE products.id = serial_counts.product_id;

CREATE OR REPLACE FUNCTION public.sync_product_quantity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET quantity = (
    SELECT COUNT(*)::integer
    FROM public.product_serials
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS product_serials_quantity_sync ON public.product_serials;
CREATE TRIGGER product_serials_quantity_sync
AFTER INSERT OR DELETE ON public.product_serials
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_quantity();
