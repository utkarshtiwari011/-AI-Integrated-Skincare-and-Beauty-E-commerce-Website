-- Create edge function for AI image generation
CREATE OR REPLACE FUNCTION public.request_product_image_generation(
  product_id uuid,
  image_type text DEFAULT 'product_shot'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_record RECORD;
  image_prompt text;
  result jsonb;
BEGIN
  -- Get product details
  SELECT * INTO product_record FROM products WHERE id = product_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Product not found');
  END IF;
  
  -- Generate AI image prompt based on product
  CASE image_type
    WHEN 'product_shot' THEN
      image_prompt := 'Professional product photography of ' || product_record.name || 
                     ' by ' || product_record.brand || ', clean white background, studio lighting, ' ||
                     'high resolution, product photography style, beauty product, skincare, elegant';
    WHEN 'lifestyle' THEN
      image_prompt := 'Lifestyle photography showing ' || product_record.name || 
                     ' in use, natural lighting, modern bathroom or vanity setting, ' ||
                     'elegant hands applying skincare product, luxury beauty routine';
    WHEN 'ingredients' THEN
      image_prompt := 'Artistic close-up of ' || array_to_string(product_record.ingredients[1:3], ', ') ||
                     ' ingredients, botanical photography, natural elements, clean aesthetic, ' ||
                     'scientific beauty, macro photography style';
    ELSE
      image_prompt := 'Professional beauty product photography of ' || product_record.name;
  END CASE;
  
  -- Return the prompt for frontend to use with image generation service
  result := jsonb_build_object(
    'product_id', product_id,
    'image_type', image_type,
    'prompt', image_prompt,
    'suggested_dimensions', jsonb_build_object('width', 1024, 'height', 1024),
    'style_params', jsonb_build_object(
      'style', 'professional product photography',
      'quality', 'high',
      'lighting', 'studio',
      'background', 'clean white'
    )
  );
  
  RETURN result;
END;
$$;

-- Create table for storing generated images
CREATE TABLE IF NOT EXISTS public.generated_product_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  image_type text NOT NULL,
  image_url text NOT NULL,
  prompt_used text,
  generation_params jsonb,
  ai_model_used text,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE public.generated_product_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Generated images are viewable by everyone" 
ON public.generated_product_images 
FOR SELECT 
USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_generated_images_product_id ON public.generated_product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_type ON public.generated_product_images(image_type);
CREATE INDEX IF NOT EXISTS idx_generated_images_active ON public.generated_product_images(is_active);

-- Update products table to support multiple AI-generated images
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ai_generated_images jsonb DEFAULT '{}';

-- Function to update product with generated images
CREATE OR REPLACE FUNCTION public.add_generated_image_to_product(
  product_id uuid,
  image_type text,
  image_url text,
  prompt_used text DEFAULT NULL,
  generation_params jsonb DEFAULT '{}'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into generated images table
  INSERT INTO public.generated_product_images (
    product_id, image_type, image_url, prompt_used, generation_params
  ) VALUES (
    product_id, image_type, image_url, prompt_used, generation_params
  );
  
  -- Update product images array if it's a main product image
  IF image_type = 'product_shot' THEN
    UPDATE public.products 
    SET images = COALESCE(images, '{}') || ARRAY[image_url]
    WHERE id = product_id;
  END IF;
  
  -- Update AI generated images JSON
  UPDATE public.products 
  SET ai_generated_images = COALESCE(ai_generated_images, '{}') || 
                           jsonb_build_object(image_type, image_url)
  WHERE id = product_id;
  
  RETURN true;
END;
$$;

-- Enhanced product search with image generation status
CREATE OR REPLACE FUNCTION public.get_products_with_image_status(
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  brand text,
  price integer,
  image_url text,
  rating numeric,
  ai_match_score integer,
  has_ai_images boolean,
  ai_image_count integer
) 
LANGUAGE plpgsql
SET search_path = public
AS $$
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
    CASE WHEN gi.image_count > 0 THEN true ELSE false END as has_ai_images,
    COALESCE(gi.image_count, 0)::integer as ai_image_count
  FROM public.products p
  LEFT JOIN (
    SELECT 
      product_id, 
      COUNT(*) as image_count
    FROM public.generated_product_images 
    WHERE is_active = true
    GROUP BY product_id
  ) gi ON p.id = gi.product_id
  WHERE p.stock_quantity > 0
  ORDER BY p.ai_match_score DESC, p.rating DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;