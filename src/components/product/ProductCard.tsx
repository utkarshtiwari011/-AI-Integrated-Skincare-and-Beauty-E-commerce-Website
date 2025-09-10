
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Share2, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  review_count: number;
  benefits: string[];
  skin_types: string[];
  ingredients: string[];
  ai_match_score: number;
  is_featured?: boolean;
  category_id: string;
  description?: string;
  created_at?: string;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.brand} product!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 bg-gradient-card border-primary/10 overflow-hidden"
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* AI Score Badge */}
        {product.ai_match_score > 90 && (
          <Badge className="absolute top-2 left-2 bg-gradient-primary text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Pick
          </Badge>
        )}
        
        {/* Featured Badge */}
        {product.is_featured && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            Featured
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleWishlistToggle}
            className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.review_count})
          </span>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1">
          {product.benefits.slice(0, 2).map((benefit, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {benefit}
            </Badge>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.original_price && (
              <span className="text-xs text-green-600 font-medium">
                Save {Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
