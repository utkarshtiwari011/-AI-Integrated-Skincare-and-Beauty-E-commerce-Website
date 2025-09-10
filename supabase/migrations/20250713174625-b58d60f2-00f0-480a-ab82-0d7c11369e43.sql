-- Update product prices to minimum 400 rupees and improve AI algorithm
-- 1. Update all products to have minimum price of 400 rupees
UPDATE public.products 
SET price = GREATEST(price, 40000) -- 40000 paise = 400 rupees
WHERE price < 40000;

-- 2. Update premium products to higher price points for better margins
UPDATE public.products 
SET price = CASE 
  WHEN name ILIKE '%vitamin c%' AND name ILIKE '%serum%' THEN 89999 -- ₹899.99
  WHEN name ILIKE '%moisturizer%' OR name ILIKE '%cream%' THEN 134999 -- ₹1349.99
  WHEN name ILIKE '%cleanser%' THEN 74999 -- ₹749.99
  WHEN name ILIKE '%essence%' THEN 169999 -- ₹1699.99
  WHEN name ILIKE '%platinum%' AND name ILIKE '%serum%' THEN 194999 -- ₹1949.99
  WHEN name ILIKE '%honey%' AND name ILIKE '%mask%' THEN 109999 -- ₹1099.99
  ELSE GREATEST(price, 40000)
END;

-- 3. Add new columns for enhanced AI algorithm
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS skin_concern_match JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ingredient_compatibility JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS age_group_target TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS climate_suitability TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS usage_frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS clinical_evidence_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_satisfaction_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS price_performance_ratio DECIMAL(3,2) DEFAULT 0.0;

-- 4. Update AI match scores with improved algorithm data
UPDATE public.products SET
  skin_concern_match = CASE 
    WHEN benefits @> ARRAY['acne-fighting'] THEN '{"acne": 95, "oily_skin": 90, "blackheads": 85}'::jsonb
    WHEN benefits @> ARRAY['anti-aging'] THEN '{"wrinkles": 95, "fine_lines": 90, "aging": 95}'::jsonb
    WHEN benefits @> ARRAY['hydrating'] THEN '{"dryness": 95, "dehydration": 90, "flakiness": 85}'::jsonb
    WHEN benefits @> ARRAY['brightening'] THEN '{"dark_spots": 95, "pigmentation": 90, "dullness": 85}'::jsonb
    ELSE '{}'::jsonb
  END,
  age_group_target = CASE 
    WHEN benefits @> ARRAY['anti-aging'] THEN ARRAY['35-45', '45-55', '55+']
    WHEN benefits @> ARRAY['acne-fighting'] THEN ARRAY['13-25', '25-35']
    WHEN benefits @> ARRAY['hydrating'] THEN ARRAY['25-35', '35-45', '45-55']
    ELSE ARRAY['18-65']
  END,
  climate_suitability = CASE 
    WHEN name ILIKE '%gel%' OR benefits @> ARRAY['oil-control'] THEN ARRAY['humid', 'tropical']
    WHEN name ILIKE '%cream%' OR benefits @> ARRAY['hydrating'] THEN ARRAY['dry', 'cold', 'temperate']
    ELSE ARRAY['all']
  END,
  clinical_evidence_score = CASE 
    WHEN ingredients @> ARRAY['hyaluronic-acid'] OR ingredients @> ARRAY['vitamin-c'] THEN 85
    WHEN ingredients @> ARRAY['retinol'] OR ingredients @> ARRAY['niacinamide'] THEN 90
    WHEN ingredients @> ARRAY['salicylic-acid'] THEN 80
    ELSE 60
  END,
  user_satisfaction_score = GREATEST(rating, 3.5),
  price_performance_ratio = CASE 
    WHEN price < 80000 THEN 8.5 -- Good value under ₹800
    WHEN price BETWEEN 80000 AND 150000 THEN 7.0 -- Premium pricing
    WHEN price > 150000 THEN 6.0 -- Luxury pricing
    ELSE 7.0
  END;

-- 5. Create function for dynamic AI score calculation
CREATE OR REPLACE FUNCTION calculate_dynamic_ai_score(
  product_id UUID,
  user_skin_type TEXT DEFAULT 'normal',
  user_concerns TEXT[] DEFAULT '{}',
  user_age INTEGER DEFAULT 25,
  user_climate TEXT DEFAULT 'temperate'
) RETURNS INTEGER AS $$
DECLARE
  product_record RECORD;
  score INTEGER := 0;
  concern TEXT;
BEGIN
  SELECT * INTO product_record FROM products WHERE id = product_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Base score from existing ai_match_score
  score := COALESCE(product_record.ai_match_score, 50);
  
  -- Skin type matching (15 points)
  IF product_record.skin_types @> ARRAY[user_skin_type] OR product_record.skin_types @> ARRAY['all'] THEN
    score := score + 15;
  ELSIF user_skin_type = 'sensitive' AND product_record.skin_types @> ARRAY['gentle'] THEN
    score := score + 10;
  END IF;
  
  -- Concern matching (up to 60 points - 20 per concern, max 3)
  FOREACH concern IN ARRAY user_concerns[1:3] LOOP
    IF (product_record.skin_concern_match->concern)::INTEGER > 80 THEN
      score := score + 20;
    ELSIF (product_record.skin_concern_match->concern)::INTEGER > 60 THEN
      score := score + 15;
    ELSIF (product_record.skin_concern_match->concern)::INTEGER > 40 THEN
      score := score + 10;
    END IF;
  END LOOP;
  
  -- Age group matching (10 points)
  CASE 
    WHEN user_age BETWEEN 13 AND 25 AND product_record.age_group_target @> ARRAY['13-25'] THEN
      score := score + 10;
    WHEN user_age BETWEEN 25 AND 35 AND product_record.age_group_target @> ARRAY['25-35'] THEN
      score := score + 10;
    WHEN user_age BETWEEN 35 AND 45 AND product_record.age_group_target @> ARRAY['35-45'] THEN
      score := score + 10;
    WHEN user_age BETWEEN 45 AND 55 AND product_record.age_group_target @> ARRAY['45-55'] THEN
      score := score + 10;
    WHEN user_age > 55 AND product_record.age_group_target @> ARRAY['55+'] THEN
      score := score + 10;
    ELSE
      -- No penalty, just no bonus
  END CASE;
  
  -- Climate suitability (10 points)
  IF product_record.climate_suitability @> ARRAY[user_climate] OR product_record.climate_suitability @> ARRAY['all'] THEN
    score := score + 10;
  END IF;
  
  -- Clinical evidence bonus (up to 15 points)
  IF product_record.clinical_evidence_score > 80 THEN
    score := score + 15;
  ELSIF product_record.clinical_evidence_score > 60 THEN
    score := score + 10;
  ELSIF product_record.clinical_evidence_score > 40 THEN
    score := score + 5;
  END IF;
  
  -- User satisfaction bonus (up to 10 points)
  IF product_record.user_satisfaction_score > 4.5 THEN
    score := score + 10;
  ELSIF product_record.user_satisfaction_score > 4.0 THEN
    score := score + 8;
  ELSIF product_record.user_satisfaction_score > 3.5 THEN
    score := score + 5;
  END IF;
  
  -- Price-performance bonus (up to 10 points)
  IF product_record.price_performance_ratio > 8.0 THEN
    score := score + 10;
  ELSIF product_record.price_performance_ratio > 7.0 THEN
    score := score + 8;
  ELSIF product_record.price_performance_ratio > 6.0 THEN
    score := score + 5;
  END IF;
  
  -- Ensure score doesn't exceed 100
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- 6. Create function for personalized recommendations
CREATE OR REPLACE FUNCTION get_personalized_recommendations(
  user_skin_type TEXT DEFAULT 'normal',
  user_concerns TEXT[] DEFAULT '{}',
  user_age INTEGER DEFAULT 25,
  user_climate TEXT DEFAULT 'temperate',
  limit_count INTEGER DEFAULT 10
) RETURNS TABLE (
  id UUID,
  name TEXT,
  brand TEXT,
  price INTEGER,
  image_url TEXT,
  dynamic_score INTEGER,
  match_reasons TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.price,
    p.image_url,
    calculate_dynamic_ai_score(p.id, user_skin_type, user_concerns, user_age, user_climate) as dynamic_score,
    ARRAY[
      CASE WHEN p.skin_types @> ARRAY[user_skin_type] THEN 'Perfect for your skin type' END,
      CASE WHEN array_length(user_concerns, 1) > 0 AND p.benefits && user_concerns THEN 'Addresses your skin concerns' END,
      CASE WHEN p.clinical_evidence_score > 80 THEN 'Clinically proven ingredients' END,
      CASE WHEN p.user_satisfaction_score > 4.0 THEN 'Highly rated by users' END,
      CASE WHEN p.price_performance_ratio > 7.0 THEN 'Great value for money' END
    ]::TEXT[] as match_reasons
  FROM products p
  WHERE p.stock_quantity > 0
  ORDER BY calculate_dynamic_ai_score(p.id, user_skin_type, user_concerns, user_age, user_climate) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_ai_scoring ON products(ai_match_score, price, rating);
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price) WHERE price >= 40000;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating) WHERE rating >= 4.0;
CREATE INDEX IF NOT EXISTS idx_products_skin_concern_match ON products USING GIN(skin_concern_match);
CREATE INDEX IF NOT EXISTS idx_products_age_group_target ON products USING GIN(age_group_target);
CREATE INDEX IF NOT EXISTS idx_products_climate_suitability ON products USING GIN(climate_suitability);
CREATE INDEX IF NOT EXISTS idx_products_benefits ON products USING GIN(benefits);
CREATE INDEX IF NOT EXISTS idx_products_skin_types ON products USING GIN(skin_types);
CREATE INDEX IF NOT EXISTS idx_products_ingredients ON products USING GIN(ingredients);