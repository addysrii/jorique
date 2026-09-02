import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface Barcode128Props {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  className?: string;
}

export default function Barcode128({
  value,
  width = 1.5,
  height = 40,
  displayValue = true,
  fontSize = 12,
  className = '',
}: Barcode128Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width,
          height,
          displayValue,
          fontSize,
          margin: 4,
          background: 'transparent',
          lineColor: '#181615',
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    }
  }, [value, width, height, displayValue, fontSize]);

  return <svg ref={svgRef} className={`inline-block ${className}`} />;
}
