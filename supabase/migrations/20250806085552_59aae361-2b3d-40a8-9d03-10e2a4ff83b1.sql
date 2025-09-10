-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_dynamic_ai_score(product_id uuid, user_skin_type text DEFAULT 'normal'::text, user_concerns text[] DEFAULT '{}'::text[], user_age integer DEFAULT 25, user_climate text DEFAULT 'temperate'::text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_personalized_recommendations(user_skin_type text DEFAULT 'normal'::text, user_concerns text[] DEFAULT '{}'::text[], user_age integer DEFAULT 25, user_climate text DEFAULT 'temperate'::text, limit_count integer DEFAULT 10)
 RETURNS TABLE(id uuid, name text, brand text, price integer, image_url text, dynamic_score integer, match_reasons text[])
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.search_products_enhanced(
  search_query text DEFAULT '',
  skin_type_filter text DEFAULT '',
  concern_filters text[] DEFAULT '{}',
  price_min integer DEFAULT 0,
  price_max integer DEFAULT 999999,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  name text,
  brand text,
  price integer,
  image_url text,
  rating numeric,
  ai_match_score integer,
  search_rank real
) 
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.price,
    p.image_url,
    p.rating,
    p.ai_match_score,
    ts_rank(
      to_tsvector('english', p.name || ' ' || p.brand || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.short_description, '')),
      plainto_tsquery('english', search_query)
    ) as search_rank
  FROM public.products p
  WHERE 
    (search_query = '' OR to_tsvector('english', p.name || ' ' || p.brand || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query))
    AND (skin_type_filter = '' OR p.skin_types @> ARRAY[skin_type_filter] OR 'all' = ANY(p.skin_types))
    AND (array_length(concern_filters, 1) IS NULL OR p.benefits && concern_filters)
    AND p.price >= price_min
    AND p.price <= price_max
    AND p.stock_quantity > 0
  ORDER BY 
    CASE WHEN search_query = '' THEN p.ai_match_score ELSE ts_rank(to_tsvector('english', p.name || ' ' || p.brand || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', search_query)) END DESC,
    p.rating DESC,
    p.review_count DESC
  LIMIT limit_count;
END;
$function$;