import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star, Share2, Sparkles, Plus, Minus, ArrowLeft, Shield, Truck, RotateCcw, Award, Users, Clock, Zap, Beaker, Medal } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { aiAlgorithm } from '@/lib/ai-algorithm';
import { toast } from 'sonner';
import ProductReviews from '@/components/product/ProductReviews';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductFAQ from '@/components/product/ProductFAQ';
import TrustSignals from '@/components/product/TrustSignals';
import InteractiveProductViewer from '@/components/product/InteractiveProductViewer';
import APlusContent from '@/components/product/APlusContent';
import StickyCTA from '@/components/product/StickyCTA';

interface ExtendedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[];
  description: string;
  short_description?: string;
  rating: number;
  review_count: number;
  benefits: string[];
  skin_types: string[];
  ingredients: string[];
  ai_match_score: number;
  is_featured?: boolean;
  stock_quantity: number;
  category_id: string;
  clinical_evidence_score?: number;
  user_satisfaction_score?: number;
  price_performance_ratio?: number;
  usage_frequency?: string;
  skin_concern_match?: any; // Changed to any to handle JSON type
  age_group_target?: string[];
  climate_suitability?: string[];
  ingredient_compatibility?: any; // Changed to any to handle JSON type
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  seo_slug?: string;
  ai_generated_images?: any;
}

const EnhancedProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [personalizedScore, setPersonalizedScore] = useState<number | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (product && user) {
      calculatePersonalizedScore();
    }
  }, [product, user]);

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
      // Set up image gallery
      if (data.images && data.images.length > 0) {
        setSelectedImage(0);
      }
    }
    setLoading(false);
  };

  const calculatePersonalizedScore = async () => {
    if (!product || !user) return;

    try {
      // Get user profile from localStorage or database
      const userProfile = JSON.parse(localStorage.getItem('userSkinProfile') || '{}');
      if (userProfile.skinType) {
        const score = await aiAlgorithm.calculateDynamicScore(product.id, userProfile);
        setPersonalizedScore(score);

        // Get related recommendations
        const recommendations = await aiAlgorithm.getPersonalizedRecommendations(userProfile, 4);
        setAiRecommendations(recommendations.filter(rec => rec.id !== product.id));
      }
    } catch (error) {
      console.error('Error calculating personalized score:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      toast.success('Added to cart!');
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product?.brand} - ${product?.name}`,
          text: `Check out this amazing skincare product: ${product?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(1, Math.min(product?.stock_quantity || 1, quantity + delta)));
  };

  const getAvailabilityStatus = () => {
    if (!product) return { text: 'Checking...', color: 'text-muted-foreground' };
    if (product.stock_quantity === 0) return { text: 'Out of Stock', color: 'text-destructive' };
    if (product.stock_quantity < 5) return { text: `Only ${product.stock_quantity} left!`, color: 'text-orange-500' };
    return { text: 'In Stock', color: 'text-green-600' };
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
  const availability = getAvailabilityStatus();
  const aiImages: string[] = product.ai_generated_images
    ? Object.values(product.ai_generated_images).filter((v): v is string => typeof v === 'string' && v.length > 0)
    : [];

  const primaryImages: string[] = (product.images ?? []).filter((v): v is string => typeof v === 'string' && v.length > 0);
  const fallbackImages: string[] = aiImages.length > 0 ? aiImages : [product.image_url];
  const images: string[] = [...primaryImages, ...fallbackImages];

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${product.brand} ${product.name} - Premium Skincare | GlowUp`}</title>
        <meta name="description" content={product.short_description || product.description} />
        <meta name="keywords" content={`${product.brand}, ${product.name}, skincare, ${product.benefits.join(', ')}, ${product.skin_types.join(', ')}`} />
        <meta property="og:title" content={`${product.brand} ${product.name}`} />
        <meta property="og:description" content={product.short_description || product.description} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={(product.price / 100).toString()} />
        <meta property="product:price:currency" content="INR" />
        <meta property="product:availability" content={product.stock_quantity > 0 ? "in stock" : "out of stock"} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured Data for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": `${product.brand} ${product.name}`,
            "image": images,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": (product.price / 100).toString(),
              "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.review_count
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Button variant="ghost" onClick={() => navigate('/')} className="p-0 h-auto text-muted-foreground hover:text-primary">
            Home
          </Button>
          <span>/</span>
          <Button variant="ghost" onClick={() => navigate('/products')} className="p-0 h-auto text-muted-foreground hover:text-primary">
            Products
          </Button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            <InteractiveProductViewer
              product={product}
              images={images}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-medium mb-2 uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-4">{product.name}</h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
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
                  <span className="text-lg font-medium">{product.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-muted-foreground">
                  {product.review_count} reviews
                </span>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(product.review_count * 1.5)} users love this
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl lg:text-5xl font-bold text-gradient-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.original_price)}
                      </span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                        Save {Math.round((1 - product.price / product.original_price) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>
                
                {/* Availability */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`font-medium ${availability.color}`}>
                    {availability.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <TrustSignals />

            {/* Key Benefits */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Key Benefits
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {product.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-2 px-3 justify-start">
                    <Award className="h-3 w-3 mr-2 text-primary" />
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skin Types */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Perfect for</h3>
              <div className="flex flex-wrap gap-2">
                {product.skin_types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
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
                  className="h-10 w-10 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-12 text-center bg-muted rounded-lg py-2">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustQuantity(1)}
                  disabled={quantity >= (product.stock_quantity || 1)}
                  className="h-10 w-10 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Max: {product.stock_quantity}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity h-14 text-lg shadow-glow"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="h-14 px-6 border-primary/30 hover:bg-primary/10"
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="h-14 px-6 border-primary/30 hover:bg-primary/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Free Delivery</div>
                  <div className="text-xs text-muted-foreground">Orders over ₹999</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day policy</div>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Authentic</div>
                  <div className="text-xs text-muted-foreground">100% genuine</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Product Details Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-12">
              <TabsTrigger value="description" className="text-sm font-medium">Description</TabsTrigger>
              <TabsTrigger value="ingredients" className="text-sm font-medium">Ingredients</TabsTrigger>
              <TabsTrigger value="howto" className="text-sm font-medium">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm font-medium">Reviews</TabsTrigger>
              <TabsTrigger value="faq" className="text-sm font-medium">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <Card className="border-primary/10 shadow-elevated">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {product.description}
                      </p>
                    </div>

                    {/* Clinical Evidence */}
                    {product.clinical_evidence_score && (
                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl">
                        <h4 className="font-semibold text-xl mb-4 flex items-center gap-2">
                          <Beaker className="h-5 w-5 text-primary" />
                          Clinical Evidence
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Clinical Effectiveness</span>
                            <span className="font-medium">{product.clinical_evidence_score}%</span>
                          </div>
                          <Progress value={product.clinical_evidence_score} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Based on clinical studies and dermatological testing
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients">
              <Card className="border-primary/10 shadow-elevated">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-xl">Active Ingredients</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="font-medium">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Ingredient Compatibility */}
                    {product.ingredient_compatibility && Object.keys(product.ingredient_compatibility).length > 0 && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          Ingredient Compatibility
                        </h5>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          This formula is carefully balanced for optimal ingredient synergy and skin compatibility.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="howto">
              <Card className="border-primary/10 shadow-elevated">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-xl">How to Use</h4>
                    <div className="space-y-4">
                      {[
                        "Cleanse your face with a gentle cleanser and pat dry",
                        "Apply a small amount of product evenly to your face and neck",
                        "Gently massage until fully absorbed",
                        "Follow with moisturizer and sunscreen during the day",
                        `Use as directed, typically ${product.usage_frequency || 'daily'}`
                      ].map((step, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          <div className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-muted-foreground pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-primary/5 p-6 rounded-xl mt-6">
                      <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pro Tips
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Start with a patch test before first use</li>
                        <li>• If using active ingredients, introduce gradually</li>
                        <li>• Use consistently for best results</li>
                        <li>• Store in a cool, dry place away from direct sunlight</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <ProductReviews productId={product.id} />
            </TabsContent>

            <TabsContent value="faq">
              <ProductFAQ product={product} />
            </TabsContent>
          </Tabs>
        </div>

        {/* A+ Content */}
        <div className="mt-20">
          <APlusContent product={product} />
        </div>

        {/* Related Products */}
        {aiRecommendations.length > 0 && (
          <div className="mt-20">
            <RelatedProducts 
              recommendations={aiRecommendations}
              title="Recommended for You"
            />
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <StickyCTA 
        product={product}
        onAddToCart={handleAddToCart}
        inWishlist={inWishlist}
        onToggleWishlist={handleWishlistToggle}
      />
    </div>
  );
};

export default EnhancedProductDetail;