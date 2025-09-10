import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowRight,
  Sparkles,
  Zap,
  Droplets,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
// import ProductViewer3D from '@/components/3d/ProductViewer3D';

const showcaseProducts = [
  {
    id: 1,
    name: 'Radiance Vitamin C Serum',
    category: 'Serums',
    price: 89999,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 2847,
    image: '/api/placeholder/400/400',
    productType: 'serum' as const,
    color: '#ff6b35',
    badge: 'Best Seller',
    badgeColor: 'bg-orange-500',
    features: ['20% Vitamin C', 'Hyaluronic Acid', 'Anti-aging', 'Brightening'],
    description: 'Powerful vitamin C serum that brightens skin and reduces dark spots.',
    benefits: 'Reduces hyperpigmentation by 85% in 4 weeks'
  },
  {
    id: 2,
    name: 'Hydra-Renewal Night Cream',
    category: 'Moisturizers',
    price: 134999,
    originalPrice: null,
    rating: 4.8,
    reviews: 1923,
    image: '/api/placeholder/400/400',
    productType: 'cream' as const,
    color: '#6c5ce7',
    badge: 'New Launch',
    badgeColor: 'bg-purple-500',
    features: ['Retinol Complex', 'Peptides', 'Ceramides', 'Night Repair'],
    description: 'Intensive overnight treatment for skin renewal and hydration.',
    benefits: 'Improves skin texture by 92% in 6 weeks'
  },
  {
    id: 3,
    name: 'Pure Glow Cleansing Oil',
    category: 'Cleansers',
    price: 74999,
    originalPrice: 4299,
    rating: 4.7,
    reviews: 3456,
    image: '/api/placeholder/400/400',
    productType: 'serum' as const,
    color: '#00b894',
    badge: 'AI Pick',
    badgeColor: 'bg-green-500',
    features: ['Natural Oils', 'Deep Cleansing', 'Makeup Removal', 'Gentle'],
    description: 'Luxurious cleansing oil that melts away makeup and impurities.',
    benefits: 'Removes 99% of makeup and sunscreen'
  }
];

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(0);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gradient-secondary text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Featured Products
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Best-Selling <span className="text-gradient-primary">Skincare</span> Essentials
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover our most loved products, carefully formulated with premium ingredients 
            and backed by thousands of glowing reviews.
          </p>
        </motion.div>

        {/* Product Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex bg-muted/50 rounded-xl p-1">
            {showcaseProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeProduct === index
                    ? 'bg-white shadow-md text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {product.category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Product Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-card rounded-3xl p-8 border border-border/50 mb-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Product Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${showcaseProducts[activeProduct].badgeColor} text-white border-0`}>
                    {showcaseProducts[activeProduct].badge}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{showcaseProducts[activeProduct].rating}</span>
                    <span className="text-muted-foreground">
                      ({showcaseProducts[activeProduct].reviews} reviews)
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-3">
                  {showcaseProducts[activeProduct].name}
                </h3>

                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {showcaseProducts[activeProduct].description}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {showcaseProducts[activeProduct].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="bg-primary/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Proven Results</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {showcaseProducts[activeProduct].benefits}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(showcaseProducts[activeProduct].price)}
                    </span>
                    {showcaseProducts[activeProduct].originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(showcaseProducts[activeProduct].originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="p-3">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Showcase */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Droplets className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{showcaseProducts[activeProduct].name}</h3>
                    <p className="text-white/80">Premium Product</p>
                  </div>
                </div>
                
                {/* Interactive Elements */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Premium Display
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl">
                  <div className="text-sm font-medium">
                    <div className="text-white font-bold">Premium Quality</div>
                    <div className="text-xs text-white/70">Clinical grade</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Product Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {showcaseProducts.map((product, index) => (
            <Card 
              key={product.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-elevated ${
                activeProduct === index ? 'ring-2 ring-primary shadow-elevated' : ''
              }`}
              onClick={() => setActiveProduct(index)}
            >
              <CardContent className="p-6">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-24 h-32 bg-gradient-to-b from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/products">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 group px-8">
              Explore All Products
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;