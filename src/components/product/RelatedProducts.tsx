import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

interface RelatedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  rating?: number;
  dynamic_score?: number;
  match_reasons?: string[];
}

interface RelatedProductsProps {
  recommendations: RelatedProduct[];
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  recommendations, 
  title = "You Might Also Like" 
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    addToCart(productId);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gradient-primary">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <Card 
            key={product.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 bg-gradient-card border-primary/10 overflow-hidden"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* AI Score Badge */}
              {product.dynamic_score && product.dynamic_score > 80 && (
                <Badge className="absolute top-2 left-2 bg-gradient-primary text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {product.dynamic_score}% Match
                </Badge>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h4>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              )}

              {/* Match Reasons */}
              {product.match_reasons && product.match_reasons.length > 0 && (
                <div className="space-y-1">
                  {product.match_reasons.slice(0, 2).map((reason, index) => (
                    <p key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                      {reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <Button
                  size="sm"
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;