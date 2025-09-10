import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

interface StickyCTAProps {
  product: { id: string; name: string; price: number; stock_quantity: number };
  inWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

const StickyCTA: React.FC<StickyCTAProps> = ({ product, inWishlist, onAddToCart, onToggleWishlist }) => {
  const formatPrice = (price: number) => `₹${(price / 100).toFixed(2)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-t hidden md:block">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{product.name}</p>
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onToggleWishlist}
            className="h-11 w-11 p-0"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            onClick={onAddToCart}
            disabled={product.stock_quantity === 0}
            className="h-11 px-6 bg-gradient-primary"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
