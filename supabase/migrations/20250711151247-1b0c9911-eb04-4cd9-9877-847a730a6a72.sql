-- Update products with premium pricing and enhanced data
UPDATE products SET 
  price = 8499,
  original_price = 12999,
  rating = 4.9,
  review_count = 2847,
  brand = 'LuxeGlow',
  description = 'Revolutionary 25% Vitamin C serum with premium botanical extracts. Clinical-grade formula delivers visible results in 7 days. Formulated with cutting-edge nanotechnology for maximum absorption and efficacy.',
  short_description = 'Premium Vitamin C serum with clinical-grade nanotechnology',
  benefits = ARRAY['Brightening', 'Anti-aging', 'Antioxidant protection', 'Collagen boost', 'Even skin tone'],
  skin_types = ARRAY['All skin types', 'Dull skin', 'Aging skin', 'Uneven tone'],
  ingredients = ARRAY['25% L-Ascorbic Acid', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid', 'Niacinamide', 'Peptides'],
  ai_match_score = 98,
  is_featured = true,
  stock_quantity = 45
WHERE name LIKE '%Vitamin C%';

UPDATE products SET 
  price = 12499,
  original_price = 18999,
  rating = 4.8,
  review_count = 1834,
  brand = 'EliteCell',
  description = 'Luxury anti-aging moisturizer with advanced peptide complex and 24k gold nanoparticles. Clinically proven to reduce fine lines by 40% in 4 weeks. Features breakthrough micro-encapsulation technology.',
  short_description = 'Luxury anti-aging moisturizer with 24k gold and peptides',
  benefits = ARRAY['Anti-aging', 'Firming', 'Hydration', 'Wrinkle reduction', 'Luxury skincare'],
  skin_types = ARRAY['Mature skin', 'Dry skin', 'Normal skin', 'Aging concerns'],
  ingredients = ARRAY['Retinol', 'Peptide Complex', '24k Gold', 'Hyaluronic Acid', 'Ceramides', 'Bakuchiol'],
  ai_match_score = 96,
  is_featured = true,
  stock_quantity = 32
WHERE name LIKE '%Moisturizer%' OR name LIKE '%Cream%';

UPDATE products SET 
  price = 6799,
  original_price = 9499,
  rating = 4.7,
  review_count = 3421,
  brand = 'PureLux',
  description = 'Premium enzymatic cleanser with probiotics and botanical extracts. Features advanced pH-balancing technology and gentle exfoliation. Suitable for the most sensitive skin types.',
  short_description = 'Premium enzymatic cleanser with probiotics',
  benefits = ARRAY['Deep cleansing', 'pH balancing', 'Gentle exfoliation', 'Probiotic support', 'Sensitive skin safe'],
  skin_types = ARRAY['All skin types', 'Sensitive skin', 'Acne-prone', 'Combination skin'],
  ingredients = ARRAY['Papaya Enzyme', 'Probiotics', 'Centella Asiatica', 'Green Tea', 'Chamomile', 'Aloe Vera'],
  ai_match_score = 94,
  is_featured = true,
  stock_quantity = 67
WHERE name LIKE '%Cleanser%';

-- Insert additional premium products
INSERT INTO products (
  name, brand, price, original_price, rating, review_count, 
  description, short_description, benefits, skin_types, ingredients,
  ai_match_score, is_featured, stock_quantity, category_id
) VALUES 
(
  'Diamond Radiance Essence',
  'LuxeGlow',
  15999,
  24999,
  4.9,
  1567,
  'Ultra-premium essence infused with diamond powder and rare botanical extracts. Features revolutionary micro-diamond technology for instant luminosity and long-term skin transformation.',
  'Ultra-premium diamond essence for radiant skin',
  ARRAY['Instant radiance', 'Diamond glow', 'Skin transformation', 'Luxury skincare', 'Anti-aging'],
  ARRAY['All skin types', 'Dull skin', 'Mature skin', 'Special occasions'],
  ARRAY['Diamond Powder', 'Rare Botanicals', 'Platinum Peptides', 'Caviar Extract', 'Swiss Glacial Water'],
  99,
  true,
  18,
  (SELECT id FROM categories WHERE name = 'Serums' LIMIT 1)
),
(
  'Platinum Cell Renewal Serum',
  'EliteCell',
  18499,
  27999,
  4.8,
  945,
  'Revolutionary platinum-infused serum with stem cell technology. Clinically proven to reverse skin aging at the cellular level. Features patented time-release formula.',
  'Platinum serum with stem cell technology',
  ARRAY['Cellular renewal', 'Age reversal', 'Platinum infusion', 'Stem cell therapy', 'Time-release'],
  ARRAY['Mature skin', 'Anti-aging concerns', 'Premium skincare'],
  ARRAY['Platinum Nanoparticles', 'Plant Stem Cells', 'Growth Factors', 'Peptide Complex', 'Hyaluronic Acid'],
  97,
  true,
  12,
  (SELECT id FROM categories WHERE name = 'Serums' LIMIT 1)
),
(
  'Royal Honey Repair Mask',
  'PureLux',
  9999,
  14999,
  4.7,
  2134,
  'Luxurious overnight mask with rare Manuka honey and gold leaf. Intensive repair treatment that works while you sleep for dramatically improved skin texture and radiance.',
  'Luxury overnight mask with Manuka honey and gold',
  ARRAY['Overnight repair', 'Intensive hydration', 'Skin texture', 'Luxury treatment', 'Radiance boost'],
  ARRAY['All skin types', 'Dry skin', 'Damaged skin', 'Dull skin'],
  ARRAY['Manuka Honey', 'Gold Leaf', 'Royal Jelly', 'Collagen', 'Botanical Oils', 'Vitamins'],
  95,
  true,
  28,
  (SELECT id FROM categories WHERE name = 'Treatments' LIMIT 1)
);