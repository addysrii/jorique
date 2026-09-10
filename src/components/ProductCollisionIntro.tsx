/**
 * ProductCollisionIntro
 *
 * Updated to use the new luxury horizontal product lineup and merge animation:
 * Products appear in an elegant horizontal line, converge inwards towards the center,
 * and fuse to reveal the prestigious JORIQUE logo.
 */
import ProductMergeLoader from './ProductMergeLoader';

export default function ProductCollisionIntro({ onComplete }: { onComplete?: () => void }) {
  return <ProductMergeLoader onComplete={onComplete} />;
}
