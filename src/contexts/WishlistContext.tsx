
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    brand: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlistItems = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        product:products(id, name, price, image_url, brand)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Item already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } else {
      toast.success('Added to wishlist!');
      fetchWishlistItems();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast.error('Failed to remove from wishlist');
    } else {
      toast.success('Removed from wishlist');
      fetchWishlistItems();
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
