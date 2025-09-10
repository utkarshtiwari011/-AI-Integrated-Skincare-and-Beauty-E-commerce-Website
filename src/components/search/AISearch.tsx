
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  skin_types: string[];
  benefits: string[];
  ai_match_score: number;
}

interface AISearchProps {
  onResults: (products: Product[]) => void;
  onLoading: (loading: boolean) => void;
}

const AISearch: React.FC<AISearchProps> = ({ onResults, onLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const skinConcerns = [
    'acne', 'dark spots', 'wrinkles', 'dryness', 'oily skin',
    'sensitive skin', 'anti-aging', 'brightening', 'hydration'
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = skinConcerns.filter(concern =>
        concern.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    const sanitizedQuery = searchQuery.trim().replace(/[<>'"]/g, '');
    if (!sanitizedQuery || sanitizedQuery.length > 100) {
      if (sanitizedQuery.length > 100) {
        toast.error('Search query is too long');
      }
      return;
    }

    onLoading(true);
    setShowSuggestions(false);

    try {
      // Enhanced search with proper sanitization
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%,brand.ilike.%${sanitizedQuery}%`)
        .order('ai_match_score', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Enhance with AI scoring based on query relevance
      const scoredProducts = products?.map(product => ({
        ...product,
        ai_match_score: calculateAIScore(product, searchQuery)
      })).sort((a, b) => b.ai_match_score - a.ai_match_score) || [];

      onResults(scoredProducts);
      
      if (scoredProducts.length === 0) {
        toast.info('No products found. Try different keywords!');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  const calculateAIScore = (product: any, query: string): number => {
    let score = product.ai_match_score || 0;
    const queryLower = query.toLowerCase();
    
    // Boost score based on relevance
    if (product.name.toLowerCase().includes(queryLower)) score += 30;
    if (product.brand.toLowerCase().includes(queryLower)) score += 20;
    if (product.description.toLowerCase().includes(queryLower)) score += 15;
    
    // Boost based on skin types and benefits
    product.skin_types?.forEach((type: string) => {
      if (type.toLowerCase().includes(queryLower)) score += 25;
    });
    
    product.benefits?.forEach((benefit: string) => {
      if (benefit.toLowerCase().includes(queryLower)) score += 20;
    });

    // New enhanced scoring factors
    // Check skin concern matching
    if (product.skin_concern_match && typeof product.skin_concern_match === 'object') {
      Object.entries(product.skin_concern_match).forEach(([concern, matchScore]) => {
        if (concern.toLowerCase().includes(queryLower) && typeof matchScore === 'number') {
          score += Math.floor(matchScore / 5); // Convert 0-100 to 0-20 bonus
        }
      });
    }

    // Clinical evidence bonus
    if (product.clinical_evidence_score > 80) score += 15;
    else if (product.clinical_evidence_score > 60) score += 10;

    // User satisfaction bonus
    if (product.user_satisfaction_score > 4.5) score += 10;
    else if (product.user_satisfaction_score > 4.0) score += 5;

    // Price-performance bonus
    if (product.price_performance_ratio > 8.0) score += 10;
    else if (product.price_performance_ratio > 7.0) score += 5;

    return Math.min(score, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by skin concern, ingredient, or product type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-20 h-12 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary text-lg"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleSearch()}
            size="sm"
            className="bg-gradient-primary hover:opacity-90"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            AI Search
          </Button>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-primary/5 flex items-center gap-2 transition-colors"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISearch;
