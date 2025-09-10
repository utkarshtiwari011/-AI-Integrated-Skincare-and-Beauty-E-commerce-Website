
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Star, Share2, Sparkles, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

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

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative group">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {product.ai_match_score > 90 && (
              <Badge className="absolute top-4 left-4 bg-gradient-primary text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Recommended
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-medium mb-1">{product.brand}</p>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.review_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Save {Math.round((1 - product.price / product.original_price) * 100)}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h3 className="font-semibold">Key Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skin Types */}
            <div className="space-y-2">
              <h3 className="font-semibold">Suitable for</h3>
              <div className="flex flex-wrap gap-2">
                {product.skin_types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustQuantity(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity h-12"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className="h-12 px-4"
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" className="h-12 px-4">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="howto">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Active Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="howto" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">How to Use</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Cleanse your face with a gentle cleanser</li>
                      <li>Apply the product evenly to your face and neck</li>
                      <li>Gently massage until fully absorbed</li>
                      <li>Follow with sunscreen during the day</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
