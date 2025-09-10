import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Sparkles, X, Bot, User, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { aiAlgorithm } from '@/lib/ai-algorithm';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
}

interface SkincareChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SkincareChatbot: React.FC<SkincareChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem('userSkinProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your personal skincare AI assistant. I can help you find the perfect products, answer skincare questions, and provide personalized recommendations based on your skin type and concerns. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "Find products for my skin type",
        "I have acne concerns",
        "Recommend anti-aging products",
        "Help with dry skin",
        "Product ingredients analysis"
      ]
    };
    setMessages([welcomeMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(async () => {
      const botResponse = await processUserMessage(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserMessage = async (message: string): Promise<Message> => {
    const lowerMessage = message.toLowerCase();
    
    // Analyze intent
    if (lowerMessage.includes('acne') || lowerMessage.includes('pimple') || lowerMessage.includes('breakout')) {
      return await handleAcneConcerns();
    } else if (lowerMessage.includes('dry') || lowerMessage.includes('moisture') || lowerMessage.includes('hydrat')) {
      return await handleDrySkinConcerns();
    } else if (lowerMessage.includes('aging') || lowerMessage.includes('wrinkle') || lowerMessage.includes('anti-age')) {
      return await handleAntiAgingConcerns();
    } else if (lowerMessage.includes('sensitive') || lowerMessage.includes('irritat')) {
      return await handleSensitiveSkinConcerns();
    } else if (lowerMessage.includes('product') && (lowerMessage.includes('find') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest'))) {
      return await handleProductRecommendations(message);
    } else if (lowerMessage.includes('ingredient') || lowerMessage.includes('what') && lowerMessage.includes('contains')) {
      return await handleIngredientQuestions(message);
    } else if (lowerMessage.includes('routine') || lowerMessage.includes('order') || lowerMessage.includes('steps')) {
      return handleRoutineQuestions();
    } else {
      return handleGeneralQuestions(message);
    }
  };

  const handleAcneConcerns = async (): Promise<Message> => {
    const products = await searchProductsForConcern(['acne', 'oily_skin', 'pore_control']);
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I understand you're dealing with acne concerns. Here are some excellent products that can help reduce breakouts and control oil production. Look for ingredients like salicylic acid, niacinamide, and benzoyl peroxide.",
      timestamp: new Date(),
      products: products.slice(0, 3),
      suggestions: [
        "Tell me about salicylic acid",
        "How to prevent acne scars",
        "Gentle products for acne-prone skin",
        "Daily routine for acne"
      ]
    };
  };

  const handleDrySkinConcerns = async (): Promise<Message> => {
    const products = await searchProductsForConcern(['dryness', 'dehydration', 'hydrating']);
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "Dry skin needs extra hydration and barrier repair. I recommend products with hyaluronic acid, ceramides, and rich moisturizers. Here are some top picks that will help restore your skin's moisture balance.",
      timestamp: new Date(),
      products: products.slice(0, 3),
      suggestions: [
        "What is hyaluronic acid?",
        "Night routine for dry skin",
        "Gentle cleansers for dry skin",
        "Moisturizer vs serum"
      ]
    };
  };

  const handleAntiAgingConcerns = async (): Promise<Message> => {
    const products = await searchProductsForConcern(['aging', 'wrinkles', 'fine_lines']);
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "For anti-aging, focus on ingredients like retinol, peptides, vitamin C, and antioxidants. These products can help reduce fine lines, improve skin texture, and boost collagen production.",
      timestamp: new Date(),
      products: products.slice(0, 3),
      suggestions: [
        "When to start using retinol?",
        "Vitamin C vs retinol",
        "Best anti-aging ingredients",
        "Morning vs evening routine"
      ]
    };
  };

  const handleSensitiveSkinConcerns = async (): Promise<Message> => {
    const products = await searchProductsForSkinType('sensitive');
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "Sensitive skin requires gentle, fragrance-free formulations. Look for products with minimal ingredients, soothing components like aloe vera or chamomile, and avoid harsh actives initially.",
      timestamp: new Date(),
      products: products.slice(0, 3),
      suggestions: [
        "Patch testing guide",
        "Ingredients to avoid",
        "Gentle cleansing routine",
        "How to calm irritated skin"
      ]
    };
  };

  const handleProductRecommendations = async (message: string): Promise<Message> => {
    let products = [];
    
    if (userProfile && userProfile.skinType) {
      const recommendations = await aiAlgorithm.getPersonalizedRecommendations(userProfile, 5);
      products = recommendations;
    } else {
      // Generic recommendations
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(5);
      products = data || [];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: userProfile 
        ? "Based on your skin profile, here are my personalized recommendations for you:"
        : "Here are some of our top-rated products. For personalized recommendations, consider taking our skin analysis quiz first!",
      timestamp: new Date(),
      products: products.slice(0, 4),
      suggestions: [
        "Take skin analysis quiz",
        "Compare these products",
        "Show more options",
        "Product usage tips"
      ]
    };
  };

  const handleIngredientQuestions = async (message: string): Promise<Message> => {
    const commonIngredients = {
      'hyaluronic acid': 'A powerful humectant that can hold up to 1000 times its weight in water, providing intense hydration.',
      'retinol': 'A vitamin A derivative that promotes cell turnover, reduces fine lines, and improves skin texture.',
      'niacinamide': 'A form of vitamin B3 that helps control oil production, minimize pores, and reduce inflammation.',
      'salicylic acid': 'A beta-hydroxy acid that exfoliates inside pores, making it excellent for acne-prone skin.',
      'vitamin c': 'A potent antioxidant that brightens skin, fades dark spots, and protects against environmental damage.',
      'ceramides': 'Lipids that help restore and maintain the skin barrier, preventing moisture loss.',
      'peptides': 'Amino acid chains that can stimulate collagen production and improve skin firmness.'
    };

    const ingredient = Object.keys(commonIngredients).find(ing => 
      message.toLowerCase().includes(ing)
    );

    if (ingredient) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: ${commonIngredients[ingredient]}`,
        timestamp: new Date(),
        suggestions: [
          "Show products with this ingredient",
          "Are there any side effects?",
          "How to use this ingredient",
          "Other beneficial ingredients"
        ]
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I'd be happy to explain skincare ingredients! Could you specify which ingredient you're curious about? Common ones include hyaluronic acid, retinol, niacinamide, vitamin C, and salicylic acid.",
      timestamp: new Date(),
      suggestions: [
        "Tell me about retinol",
        "What is niacinamide?",
        "Explain hyaluronic acid",
        "Vitamin C benefits"
      ]
    };
  };

  const handleRoutineQuestions = (): Message => {
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "A basic skincare routine should follow this order:\n\n**Morning:**\n1. Gentle cleanser\n2. Toner (optional)\n3. Serum (vitamin C)\n4. Moisturizer\n5. Sunscreen (SPF 30+)\n\n**Evening:**\n1. Makeup remover/oil cleanser\n2. Gentle cleanser\n3. Treatment (retinol/acids)\n4. Serum\n5. Moisturizer\n\nStart simple and gradually add products to avoid overwhelming your skin!",
      timestamp: new Date(),
      suggestions: [
        "Morning routine tips",
        "Evening routine details",
        "How to introduce new products",
        "Routine for my skin type"
      ]
    };
  };

  const handleGeneralQuestions = (message: string): Message => {
    const responses = [
      "That's a great question! Could you provide more details so I can give you the most helpful advice?",
      "I'm here to help with your skincare journey! What specific aspect would you like to know more about?",
      "Let me help you with that. Could you be more specific about what you're looking for?",
    ];

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      suggestions: [
        "Product recommendations",
        "Skin analysis quiz",
        "Ingredient explanations",
        "Routine building help"
      ]
    };
  };

  const searchProductsForConcern = async (concerns: string[]) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .overlaps('benefits', concerns)
      .order('ai_match_score', { ascending: false })
      .limit(5);
    
    return data || [];
  };

  const searchProductsForSkinType = async (skinType: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .contains('skin_types', [skinType])
      .order('rating', { ascending: false })
      .limit(5);
    
    return data || [];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlist(productId);
    toast.success('Added to wishlist!');
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-background border-primary/20 shadow-2xl">
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Skincare AI Assistant</CardTitle>
                <p className="text-sm text-white/80">Powered by advanced AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.type === 'user' ? 'bg-primary text-white' : 'bg-muted'}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 space-y-2 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-white ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>

                    {/* Product Recommendations */}
                    {message.products && message.products.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 mt-3">
                        {message.products.map((product) => (
                          <div key={product.id} className="border rounded-lg p-3 bg-card">
                            <div className="flex gap-3">
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleAddToWishlist(product.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Heart className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAddToCart(product.id)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about skincare..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()} className="bg-gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkincareChatbot;