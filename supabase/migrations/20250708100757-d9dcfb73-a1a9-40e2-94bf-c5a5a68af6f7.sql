
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  category_id UUID REFERENCES public.categories(id),
  brand TEXT,
  image_url TEXT,
  images TEXT[],
  ingredients TEXT[],
  skin_types TEXT[],
  benefits TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  ai_match_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist table
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for wishlist_items
CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Users can manage own reviews" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Cleansers', 'Deep cleansing products for all skin types', '/api/placeholder/300/200'),
('Serums', 'Concentrated treatments for targeted skin concerns', '/api/placeholder/300/200'),
('Moisturizers', 'Hydrating products for daily skincare routine', '/api/placeholder/300/200'),
('Sunscreens', 'Protection against UV damage and aging', '/api/placeholder/300/200'),
('Treatments', 'Specialized products for specific skin issues', '/api/placeholder/300/200'),
('Masks', 'Weekly treatments for intensive skin care', '/api/placeholder/300/200'),
('Toners', 'Balancing and preparing products', '/api/placeholder/300/200'),
('Eye Care', 'Specialized products for delicate eye area', '/api/placeholder/300/200');

-- Insert sample products (expanded collection)
INSERT INTO public.products (name, description, short_description, price, original_price, category_id, brand, image_url, ingredients, skin_types, benefits, rating, review_count, stock_quantity, is_featured, ai_match_score) 
SELECT 
  product_data.name,
  product_data.description,
  product_data.short_description,
  product_data.price,
  product_data.original_price,
  categories.id,
  product_data.brand,
  product_data.image_url,
  product_data.ingredients,
  product_data.skin_types,
  product_data.benefits,
  product_data.rating,
  product_data.review_count,
  product_data.stock_quantity,
  product_data.is_featured,
  product_data.ai_match_score
FROM (VALUES
  ('Hydrating Vitamin C Serum', 'This powerful vitamin C serum delivers 20% L-Ascorbic Acid to brighten skin, reduce dark spots, and protect against environmental damage. Enhanced with hyaluronic acid for deep hydration.', 'Brightening serum with 20% Vitamin C', 3999, 5399, 'Serums', 'GlowLab', '/api/placeholder/400/400', ARRAY['Vitamin C', 'Hyaluronic Acid', 'Vitamin E'], ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Brightening', 'Anti-aging', 'Hydrating'], 4.8, 1247, 50, true, 96),
  ('Renewal Night Moisturizer', 'Rich night cream with retinol and peptides for overnight skin renewal. Reduces fine lines and improves skin texture while you sleep.', 'Anti-aging night moisturizer with retinol', 5199, NULL, 'Moisturizers', 'PureSkin', '/api/placeholder/400/400', ARRAY['Retinol', 'Peptides', 'Ceramides'], ARRAY['Dry', 'Normal', 'Mature'], ARRAY['Anti-aging', 'Moisturizing', 'Firming'], 4.9, 856, 30, true, 89),
  ('Gentle Foam Cleanser', 'pH-balanced foam cleanser that removes impurities without stripping natural oils. Perfect for sensitive skin daily cleansing routine.', 'Gentle daily cleanser for all skin types', 2299, NULL, 'Cleansers', 'CleanBeauty', '/api/placeholder/400/400', ARRAY['Glycerin', 'Ceramides', 'Aloe Vera'], ARRAY['All Types'], ARRAY['Cleansing', 'Soothing', 'Balancing'], 4.7, 2341, 100, false, 92),
  ('Advanced Retinol Serum', 'Powerful anti-aging serum with 0.5% retinol for reducing fine lines, wrinkles, and improving skin texture. Start with 2-3 times per week.', 'Professional strength retinol treatment', 4599, NULL, 'Serums', 'GlowLab', '/api/placeholder/400/400', ARRAY['Retinol', 'Squalane', 'Vitamin E'], ARRAY['Normal', 'Dry', 'Mature'], ARRAY['Anti-aging', 'Smoothing', 'Firming'], 4.6, 932, 25, true, 88),
  ('Hydrating Face Mask', 'Intensive hydrating mask with hyaluronic acid and marine collagen. Use weekly for plump, moisturized skin.', 'Weekly hydrating treatment mask', 2899, NULL, 'Masks', 'PureSkin', '/api/placeholder/400/400', ARRAY['Hyaluronic Acid', 'Marine Collagen', 'Algae Extract'], ARRAY['Dry', 'Dehydrated'], ARRAY['Hydrating', 'Plumping', 'Soothing'], 4.5, 654, 75, false, 91),
  ('Exfoliating BHA Toner', 'Gentle exfoliating toner with salicylic acid to unclog pores and improve skin texture. Perfect for oily and acne-prone skin.', 'Daily exfoliating toner with BHA', 1999, NULL, 'Toners', 'CleanBeauty', '/api/placeholder/400/400', ARRAY['Salicylic Acid', 'Niacinamide', 'Green Tea'], ARRAY['Oily', 'Combination', 'Acne-Prone'], ARRAY['Exfoliating', 'Pore-refining', 'Oil-control'], 4.4, 1203, 80, false, 85),
  ('Broad Spectrum SPF 50', 'Lightweight daily sunscreen with zinc oxide and titanium dioxide. Non-greasy formula perfect for daily wear under makeup.', 'Daily mineral sunscreen SPF 50', 3299, NULL, 'Sunscreens', 'SunShield', '/api/placeholder/400/400', ARRAY['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E'], ARRAY['All Types'], ARRAY['Sun Protection', 'Anti-aging', 'Non-comedogenic'], 4.7, 1890, 120, true, 94),
  ('Niacinamide Pore Refiner', '10% Niacinamide serum to minimize pores, control oil production, and improve skin texture. Ideal for combination and oily skin.', 'Pore-minimizing serum with 10% niacinamide', 2799, NULL, 'Serums', 'GlowLab', '/api/placeholder/400/400', ARRAY['Niacinamide', 'Zinc PCA', 'Hyaluronic Acid'], ARRAY['Oily', 'Combination'], ARRAY['Pore-refining', 'Oil-control', 'Smoothing'], 4.6, 678, 60, false, 85),
  ('Peptide Recovery Cream', 'Luxurious anti-aging cream with advanced peptide complex for firming and lifting. Perfect for mature skin seeking visible results.', 'Advanced anti-aging peptide cream', 6499, 7999, 'Moisturizers', 'PureSkin', '/api/placeholder/400/400', ARRAY['Peptides', 'Ceramides', 'Retinyl Palmitate'], ARRAY['Mature', 'Dry'], ARRAY['Anti-aging', 'Firming', 'Lifting'], 4.9, 432, 20, true, 94),
  ('Micellar Cleansing Water', 'Gentle micellar water that removes makeup and impurities without rinsing. Perfect for sensitive skin and travel.', 'No-rinse makeup remover and cleanser', 1899, NULL, 'Cleansers', 'CleanBeauty', '/api/placeholder/400/400', ARRAY['Micellar Technology', 'Glycerin', 'Rose Water'], ARRAY['All Types'], ARRAY['Makeup Removal', 'Gentle', 'Convenient'], 4.5, 1890, 150, false, 78),
  ('AHA Renewal Treatment', 'Glycolic and lactic acid treatment for smooth, radiant skin. Use 2-3 times weekly for best results.', 'Chemical exfoliant with AHA blend', 3899, NULL, 'Treatments', 'SkinRenewal', '/api/placeholder/400/400', ARRAY['Glycolic Acid', 'Lactic Acid', 'Aloe Vera'], ARRAY['Normal', 'Combination'], ARRAY['Exfoliating', 'Brightening', 'Smoothing'], 4.5, 543, 40, false, 87),
  ('Eye Contour Cream', 'Intensive eye cream with caffeine and peptides to reduce puffiness and fine lines around delicate eye area.', 'Anti-aging eye cream with caffeine', 4299, NULL, 'Eye Care', 'EyePerfect', '/api/placeholder/400/400', ARRAY['Caffeine', 'Peptides', 'Hyaluronic Acid'], ARRAY['All Types'], ARRAY['Anti-puffiness', 'Anti-aging', 'Hydrating'], 4.6, 789, 35, false, 90)
) AS product_data(name, description, short_description, price, original_price, category_name, brand, image_url, ingredients, skin_types, benefits, rating, review_count, stock_quantity, is_featured, ai_match_score)
JOIN public.categories ON categories.name = product_data.category_name;

-- Create trigger to update profiles when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
