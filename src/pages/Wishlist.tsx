
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { items, loading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-6">
              Save your favorite products for later
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save products you love for easy access later
            </p>
            <Link to="/products">
              <Button className="bg-gradient-primary hover:opacity-90">
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item.product,
                  rating: 0,
                  review_count: 0,
                  benefits: [],
                  ai_match_score: 0,
                  skin_types: [],
                  ingredients: [],
                  category_id: '',
                }}
                onProductClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
