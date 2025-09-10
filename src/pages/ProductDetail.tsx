
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Star, Share2, Sparkles, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  image_url: string;
  description: string;
  rating: number;
  review_count: number;
  benefits: string[];
  skin_types: string[];
  ingredients: string[];
  ai_match_score: number;
  is_featured?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product.id);
      }
    }
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
            <Button onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
              {product.ai_match_score > 90 && (
                <Badge className="absolute top-4 left-4 bg-gradient-primary text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Recommended
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-medium mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.review_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
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
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Key Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {product.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skin Types */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Suitable for</h3>
              <div className="flex flex-wrap gap-2">
                {product.skin_types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
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
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity h-14 text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className="h-14 px-6"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" className="h-14 px-6">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description" className="text-lg py-3">Description</TabsTrigger>
              <TabsTrigger value="ingredients" className="text-lg py-3">Ingredients</TabsTrigger>
              <TabsTrigger value="howto" className="text-lg py-3">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients">
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-xl">Active Ingredients</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {product.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-sm py-2 px-3">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="howto">
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-xl">How to Use</h4>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-lg">
                      <li>Cleanse your face with a gentle cleanser and pat dry</li>
                      <li>Apply a small amount of product evenly to your face and neck</li>
                      <li>Gently massage until fully absorbed</li>
                      <li>Follow with moisturizer and sunscreen during the day</li>
                      <li>Use as directed, typically once or twice daily</li>
                    </ol>
                    <div className="bg-primary/5 p-4 rounded-lg mt-6">
                      <p className="text-sm text-muted-foreground">
                        <strong>Pro Tip:</strong> Start with a patch test before first use. 
                        If using active ingredients like retinol or acids, introduce gradually into your routine.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
