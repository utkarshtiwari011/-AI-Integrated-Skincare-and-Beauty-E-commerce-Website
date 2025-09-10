import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Eye, Zap, Crown, Award } from "lucide-react";
import premiumSerum from "@/assets/premium-serum-1.jpg";
import premiumMoisturizer from "@/assets/premium-moisturizer-1.jpg";
import premiumCleanser from "@/assets/premium-cleanser-1.jpg";
import premiumEssence from "@/assets/premium-essence-1.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  description: string;
  aiMatch: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Diamond Radiance Essence",
    brand: "LuxeGlow",
    price: 15999,
    originalPrice: 24999,
    rating: 4.9,
    reviews: 1567,
    image: premiumEssence,
    tags: ["Ultra Premium", "99% AI Match", "Diamond Technology"],
    description: "Ultra-premium essence infused with diamond powder and rare botanical extracts for instant luminosity",
    aiMatch: 99
  },
  {
    id: "2",
    name: "Platinum Cell Renewal Serum",
    brand: "EliteCell",
    price: 18499,
    originalPrice: 27999,
    rating: 4.8,
    reviews: 945,
    image: premiumSerum,
    tags: ["Platinum Infused", "Stem Cell Tech", "Age Reversal"],
    description: "Revolutionary platinum-infused serum with stem cell technology for cellular age reversal",
    aiMatch: 97
  },
  {
    id: "3",
    name: "24K Gold Moisturizer",
    brand: "EliteCell",
    price: 12499,
    originalPrice: 18999,
    rating: 4.8,
    reviews: 1834,
    image: premiumMoisturizer,
    tags: ["24K Gold", "Anti-Aging", "Luxury"],
    description: "Luxury anti-aging moisturizer with 24k gold nanoparticles and peptide complex",
    aiMatch: 96
  },
  {
    id: "4",
    name: "Premium Vitamin C Serum",
    brand: "LuxeGlow",
    price: 8499,
    originalPrice: 12999,
    rating: 4.9,
    reviews: 2847,
    image: premiumSerum,
    tags: ["25% Vitamin C", "Clinical Grade", "Nano Tech"],
    description: "Revolutionary 25% Vitamin C serum with nanotechnology for maximum absorption",
    aiMatch: 98
  },
  {
    id: "5",
    name: "Royal Honey Repair Mask",
    brand: "PureLux",
    price: 9999,
    originalPrice: 14999,
    rating: 4.7,
    reviews: 2134,
    image: premiumMoisturizer,
    tags: ["Manuka Honey", "Overnight Repair", "Gold Leaf"],
    description: "Luxurious overnight mask with rare Manuka honey and gold leaf for intensive repair",
    aiMatch: 95
  },
  {
    id: "6",
    name: "Enzymatic Probiotic Cleanser",
    brand: "PureLux",
    price: 6799,
    originalPrice: 9499,
    rating: 4.7,
    reviews: 3421,
    image: premiumCleanser,
    tags: ["Probiotics", "pH Balanced", "Enzyme Tech"],
    description: "Premium enzymatic cleanser with probiotics and advanced pH-balancing technology",
    aiMatch: 94
  }
];

const ProductGrid = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const addToCart = (productId: string) => {
    setCart(prev => new Set(prev).add(productId));
    // Show success feedback
    setTimeout(() => {
      setCart(prev => {
        const newCart = new Set(prev);
        newCart.delete(productId);
        return newCart;
      });
    }, 2000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI-Curated
            </span>{" "}
            Products for You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI has analyzed thousands of products to find the perfect matches for your skin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-elevated transition-spring overflow-hidden bg-gradient-card border-0 shadow-lg hover:shadow-2xl">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* AI Match Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`font-semibold text-xs ${
                    product.aiMatch >= 98 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                    product.aiMatch >= 95 ? 'bg-gradient-primary text-white' :
                    'bg-background/90 text-foreground'
                  }`}>
                    {product.aiMatch >= 98 && <Crown className="w-3 h-3 mr-1" />}
                    {product.aiMatch >= 95 && product.aiMatch < 98 && <Award className="w-3 h-3 mr-1" />}
                    {product.aiMatch < 95 && <Zap className="w-3 h-3 mr-1" />}
                    {product.aiMatch}% AI Match
                  </Badge>
                </div>
                
                {/* Favorite & Quick View */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                
                {/* Premium Tags */}
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap max-w-[calc(100%-2rem)]">
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-white/90 text-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product.id)}
                    variant={cart.has(product.id) ? "secondary" : "default"}
                    className={`gap-2 transition-all ${
                      cart.has(product.id) 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gradient-primary hover:opacity-90 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cart.has(product.id) ? 'Added ✓' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-8 border-2 border-primary/30 hover:bg-primary/5">
              View All Premium Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;