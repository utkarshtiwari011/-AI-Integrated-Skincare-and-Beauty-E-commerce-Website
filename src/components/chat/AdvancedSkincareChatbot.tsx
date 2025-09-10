import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send, Sparkles, X, Bot, User, Heart, ShoppingCart, Globe, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  language: string;
  suggestions?: string[];
  products?: any[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

interface AdvancedChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedSkincareChatbot: React.FC<AdvancedChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [conversationContext, setConversationContext] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const skincareDictionary = {
    en: {
      welcome: "Hi! I'm your AI skincare expert. I can help you find perfect products, analyze your skin, and provide personalized recommendations in multiple languages. How can I assist you today?",
      analyzing: "Analyzing your request...",
      noResults: "I couldn't find specific products for that, but let me suggest some alternatives:",
      addedToCart: "Added to cart!",
      addedToWishlist: "Added to wishlist!",
      suggestions: {
        skinAnalysis: "Analyze my skin type",
        productRecommendations: "Recommend products for me",
        ingredientInfo: "Tell me about skincare ingredients",
        routineHelp: "Help me build a routine"
      }
    },
    es: {
      welcome: "¡Hola! Soy tu experto en cuidado de la piel con IA. Puedo ayudarte a encontrar productos perfectos, analizar tu piel y proporcionar recomendaciones personalizadas. ¿Cómo puedo ayudarte hoy?",
      analyzing: "Analizando tu solicitud...",
      noResults: "No pude encontrar productos específicos para eso, pero déjame sugerir algunas alternativas:",
      addedToCart: "¡Agregado al carrito!",
      addedToWishlist: "¡Agregado a favoritos!",
      suggestions: {
        skinAnalysis: "Analizar mi tipo de piel",
        productRecommendations: "Recomendar productos para mí",
        ingredientInfo: "Háblame sobre ingredientes para el cuidado de la piel",
        routineHelp: "Ayúdame a crear una rutina"
      }
    },
    fr: {
      welcome: "Salut ! Je suis votre expert IA en soins de la peau. Je peux vous aider à trouver des produits parfaits, analyser votre peau et fournir des recommandations personnalisées. Comment puis-je vous aider aujourd'hui ?",
      analyzing: "Analyse de votre demande...",
      noResults: "Je n'ai pas pu trouver de produits spécifiques pour cela, mais laissez-moi vous suggérer des alternatives :",
      addedToCart: "Ajouté au panier !",
      addedToWishlist: "Ajouté aux favoris !",
      suggestions: {
        skinAnalysis: "Analyser mon type de peau",
        productRecommendations: "Recommander des produits pour moi",
        ingredientInfo: "Parlez-moi des ingrédients de soins de la peau",
        routineHelp: "Aidez-moi à créer une routine"
      }
    },
    hi: {
      welcome: "नमस्ते! मैं आपका AI स्किनकेयर एक्सपर्ट हूं। मैं आपको सही उत्पाद खोजने, आपकी त्वचा का विश्लेषण करने और व्यक्तिगत सुझाव देने में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      analyzing: "आपके अनुरोध का विश्लेषण कर रहा हूं...",
      noResults: "मुझे इसके लिए विशिष्ट उत्पाद नहीं मिले, लेकिन मैं कुछ विकल्प सुझाता हूं:",
      addedToCart: "कार्ट में जोड़ा गया!",
      addedToWishlist: "विशलिस्ट में जोड़ा गया!",
      suggestions: {
        skinAnalysis: "मेरी त्वचा के प्रकार का विश्लेषण करें",
        productRecommendations: "मेरे लिए उत्पाद सुझाएं",
        ingredientInfo: "स्किनकेयर सामग्री के बारे में बताएं",
        routineHelp: "रूटीन बनाने में मदद करें"
      }
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user profile
    const profile = localStorage.getItem('userSkinProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const dict = skincareDictionary[selectedLanguage] || skincareDictionary.en;
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: dict.welcome,
      timestamp: new Date(),
      language: selectedLanguage,
      suggestions: Object.values(dict.suggestions),
      confidence: 1.0,
      sentiment: 'positive'
    };
    setMessages([welcomeMessage]);
  };

  const speakMessage = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  };

  const analyzeMessageSentiment = (text: string): { sentiment: 'positive' | 'neutral' | 'negative', confidence: number } => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'best', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed'];
    
    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'positive', confidence: Math.min(0.9, 0.5 + (positiveCount * 0.2)) };
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative', confidence: Math.min(0.9, 0.5 + (negativeCount * 0.2)) };
    }
    
    return { sentiment: 'neutral', confidence: 0.7 };
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    // Simplified translation - in production, use a proper translation service
    const translations = {
      'hello': { es: 'hola', fr: 'bonjour', hi: 'नमस्ते' },
      'thank you': { es: 'gracias', fr: 'merci', hi: 'धन्यवाद' },
      'goodbye': { es: 'adiós', fr: 'au revoir', hi: 'अलविदा' }
    };
    
    // For now, return original text - integrate with Google Translate API in production
    return text;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const { sentiment, confidence } = analyzeMessageSentiment(input);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      language: selectedLanguage,
      sentiment,
      confidence
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, { role: 'user', content: input, sentiment, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    // Add delay for more natural conversation
    setTimeout(async () => {
      const botResponse = await processAdvancedMessage(input, sentiment, confidence);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Auto-speak response if enabled
      if (botResponse.content.length < 200) {
        speakMessage(botResponse.content);
      }
    }, 1500);
  };

  const processAdvancedMessage = async (message: string, sentiment: string, confidence: number): Promise<Message> => {
    const lowerMessage = message.toLowerCase();
    const dict = skincareDictionary[selectedLanguage] || skincareDictionary.en;
    
    // Enhanced AI processing with context awareness
    const context = conversationContext.slice(-3); // Last 3 interactions
    
    // Multilingual intent detection
    const intents = {
      acne: ['acne', 'pimple', 'breakout', 'spots', 'blemish', 'espinillas', 'bouton', 'मुंहासे'],
      aging: ['aging', 'wrinkle', 'fine lines', 'anti-age', 'envejecimiento', 'rides', 'बुढ़ापा'],
      dryness: ['dry', 'moisture', 'hydration', 'seco', 'humedad', 'sec', 'hydratation', 'सूखी'],
      sensitive: ['sensitive', 'irritation', 'gentle', 'sensible', 'irritación', 'sensible', 'संवेदनशील'],
      routine: ['routine', 'steps', 'order', 'rutina', 'pasos', 'routine', 'étapes', 'दिनचर्या']
    };

    // Detect intent with multilingual support
    let detectedIntent = 'general';
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedIntent = intent;
        break;
      }
    }

    let response: Message;

    switch (detectedIntent) {
      case 'acne':
        response = await handleAcneConcernsAdvanced(sentiment, confidence);
        break;
      case 'aging':
        response = await handleAntiAgingAdvanced(sentiment, confidence);
        break;
      case 'dryness':
        response = await handleDrySkinAdvanced(sentiment, confidence);
        break;
      case 'sensitive':
        response = await handleSensitiveSkinAdvanced(sentiment, confidence);
        break;
      case 'routine':
        response = await handleRoutineAdvanced(sentiment, confidence);
        break;
      default:
        response = await handleGeneralAdvanced(message, sentiment, confidence);
    }

    // Add conversation context
    setConversationContext(prev => [...prev, { 
      role: 'assistant', 
      content: response.content, 
      intent: detectedIntent,
      timestamp: new Date() 
    }]);

    return response;
  };

  const handleAcneConcernsAdvanced = async (sentiment: string, confidence: number): Promise<Message> => {
    const products = await searchProductsForConcern(['acne', 'oily_skin', 'pore_control']);
    const dict = skincareDictionary[selectedLanguage] || skincareDictionary.en;
    
    const responses = {
      en: "I understand acne can be frustrating! Here are clinically-proven products that target breakouts effectively. The key is consistency and gentle care.",
      es: "¡Entiendo que el acné puede ser frustrante! Aquí tienes productos clínicamente probados que combaten las espinillas eficazmente. La clave es la consistencia y el cuidado suave.",
      fr: "Je comprends que l'acné puisse être frustrant ! Voici des produits cliniquement prouvés qui ciblent efficacement les boutons. La clé est la cohérence et les soins doux.",
      hi: "मैं समझता हूं कि मुंहासे परेशान करने वाले हो सकते हैं! यहां चिकित्सकीय रूप से सिद्ध उत्पाद हैं जो प्रभावी रूप से ब्रेकआउट्स को लक्षित करते हैं।"
    };
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[selectedLanguage] || responses.en,
      timestamp: new Date(),
      language: selectedLanguage,
      products: products.slice(0, 3),
      confidence: 0.95,
      sentiment: sentiment === 'negative' ? 'positive' : 'neutral',
      suggestions: [
        "Tell me about salicylic acid",
        "How to prevent acne scars",
        "Gentle products for acne-prone skin",
        "Morning vs evening routine for acne"
      ]
    };
  };

  const handleAntiAgingAdvanced = async (sentiment: string, confidence: number): Promise<Message> => {
    const products = await searchProductsForConcern(['aging', 'wrinkles', 'fine_lines']);
    
    const responses = {
      en: "Aging gracefully is beautiful! These scientifically-backed products help maintain youthful, healthy skin with proven anti-aging ingredients.",
      es: "¡Envejecer con gracia es hermoso! Estos productos respaldados científicamente ayudan a mantener una piel joven y saludable con ingredientes anti-edad probados.",
      fr: "Vieillir avec grâce est beau ! Ces produits scientifiquement soutenus aident à maintenir une peau jeune et saine avec des ingrédients anti-âge prouvés.",
      hi: "सुंदरता से बुढ़ापा आना खूबसूरत है! ये वैज्ञानिक रूप से समर्थित उत्पाद सिद्ध एंटी-एजिंग सामग्री के साथ युवा, स्वस्थ त्वचा बनाए रखने में मदद करते हैं।"
    };
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[selectedLanguage] || responses.en,
      timestamp: new Date(),
      language: selectedLanguage,
      products: products.slice(0, 3),
      confidence: 0.92,
      sentiment: 'positive',
      suggestions: [
        "When to start using retinol?",
        "Best anti-aging ingredients",
        "Vitamin C vs retinol benefits",
        "Professional vs at-home treatments"
      ]
    };
  };

  const handleDrySkinAdvanced = async (sentiment: string, confidence: number): Promise<Message> => {
    const products = await searchProductsForConcern(['dryness', 'dehydration', 'hydrating']);
    
    const responses = {
      en: "Dry skin needs extra love! These deeply hydrating formulas restore your skin's natural moisture barrier for lasting comfort.",
      es: "¡La piel seca necesita amor extra! Estas fórmulas profundamente hidratantes restauran la barrera natural de humedad de tu piel para una comodidad duradera.",
      fr: "La peau sèche a besoin d'amour supplémentaire ! Ces formules profondément hydratantes restaurent la barrière d'humidité naturelle de votre peau pour un confort durable.",
      hi: "सूखी त्वचा को अतिरिक्त देखभाल की जरूरत है! ये गहराई से हाइड्रेटिंग फॉर्मूले स्थायी आराम के लिए आपकी त्वचा की प्राकृतिक नमी बाधा को बहाल करते हैं।"
    };
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[selectedLanguage] || responses.en,
      timestamp: new Date(),
      language: selectedLanguage,
      products: products.slice(0, 3),
      confidence: 0.89,
      sentiment: 'positive',
      suggestions: [
        "Best hydrating ingredients",
        "Day vs night moisturizers",
        "How to layer skincare products",
        "Climate and skin hydration"
      ]
    };
  };

  const handleSensitiveSkinAdvanced = async (sentiment: string, confidence: number): Promise<Message> => {
    const products = await searchProductsForSkinType('sensitive');
    
    const responses = {
      en: "Sensitive skin deserves gentle care! These hypoallergenic, fragrance-free products soothe and protect without irritation.",
      es: "¡La piel sensible merece cuidado suave! Estos productos hipoalergénicos y sin fragancia calman y protegen sin irritación.",
      fr: "La peau sensible mérite des soins doux ! Ces produits hypoallergéniques et sans parfum apaisent et protègent sans irritation.",
      hi: "संवेदनशील त्वचा को कोमल देखभाल की जरूरत है! ये हाइपोएलर्जेनिक, खुशबू रहित उत्पाद बिना जलन के शांत और सुरक्षा प्रदान करते हैं।"
    };
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[selectedLanguage] || responses.en,
      timestamp: new Date(),
      language: selectedLanguage,
      products: products.slice(0, 3),
      confidence: 0.94,
      sentiment: 'positive',
      suggestions: [
        "Ingredients to avoid for sensitive skin",
        "How to do a patch test",
        "Calming sensitive skin naturally",
        "Building tolerance to new products"
      ]
    };
  };

  const handleRoutineAdvanced = async (sentiment: string, confidence: number): Promise<Message> => {
    const responses = {
      en: "Building an effective skincare routine is key to healthy skin! Here's a personalized guide based on your needs:",
      es: "¡Construir una rutina efectiva de cuidado de la piel es clave para una piel saludable! Aquí tienes una guía personalizada basada en tus necesidades:",
      fr: "Construire une routine de soins efficace est la clé d'une peau saine ! Voici un guide personnalisé basé sur vos besoins :",
      hi: "एक प्रभावी स्किनकेयर रूटीन बनाना स्वस्थ त्वचा की कुंजी है! यहां आपकी जरूरतों के आधार पर एक व्यक्तिगत गाइड है:"
    };
    
    const routineSteps = {
      en: [
        "🌅 Morning: Cleanser → Toner → Serum → Moisturizer → Sunscreen",
        "🌙 Evening: Cleanser → Treatment → Serum → Moisturizer",
        "📅 Weekly: Exfoliation 1-2 times, Mask 1-2 times"
      ],
      es: [
        "🌅 Mañana: Limpiador → Tónico → Sérum → Hidratante → Protector solar",
        "🌙 Noche: Limpiador → Tratamiento → Sérum → Hidratante",
        "📅 Semanal: Exfoliación 1-2 veces, Mascarilla 1-2 veces"
      ],
      hi: [
        "🌅 सुबह: क्लींजर → टोनर → सीरम → मॉइस्चराइज़र → सनस्क्रीन",
        "🌙 शाम: क्लींजर → ट्रीटमेंट → सीरम → मॉइस्चराइज़र",
        "📅 साप्ताहिक: एक्सफोलिएशन 1-2 बार, मास्क 1-2 बार"
      ]
    };
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[selectedLanguage] || responses.en + '\n\n' + 
               (routineSteps[selectedLanguage] || routineSteps.en).join('\n'),
      timestamp: new Date(),
      language: selectedLanguage,
      confidence: 0.97,
      sentiment: 'positive',
      suggestions: [
        "Product order importance",
        "How long to see results",
        "Adjusting routine seasonally",
        "Common routine mistakes"
      ]
    };
  };

  const handleGeneralAdvanced = async (message: string, sentiment: string, confidence: number): Promise<Message> => {
    const responses = {
      en: [
        "That's a great question! Let me help you with personalized skincare advice.",
        "I'm here to guide you on your skincare journey! What specific concerns do you have?",
        "Every skin is unique, and I'm here to help you find what works best for yours!"
      ],
      es: [
        "¡Esa es una gran pregunta! Déjame ayudarte con consejos personalizados de cuidado de la piel.",
        "¡Estoy aquí para guiarte en tu viaje de cuidado de la piel! ¿Qué preocupaciones específicas tienes?",
        "Cada piel es única, ¡y estoy aquí para ayudarte a encontrar lo que funciona mejor para la tuya!"
      ],
      hi: [
        "यह एक बेहतरीन प्रश्न है! मुझे व्यक्तिगत स्किनकेयर सलाह के साथ आपकी मदद करने दें।",
        "मैं आपकी स्किनकेयर यात्रा में आपका मार्गदर्शन करने के लिए यहां हूं! आपकी विशिष्ट चिंताएं क्या हैं?",
        "हर त्वचा अनोखी है, और मैं यहां आपको यह खोजने में मदद करने के लिए हूं कि आपकी के लिए सबसे अच्छा क्या काम करता है!"
      ]
    };
    
    const responseArray = responses[selectedLanguage] || responses.en;
    const selectedResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: selectedResponse,
      timestamp: new Date(),
      language: selectedLanguage,
      confidence: 0.85,
      sentiment: 'positive',
      suggestions: [
        "Analyze my skin type",
        "Product recommendations",
        "Ingredient education",
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
    toast.success(skincareDictionary[selectedLanguage]?.addedToCart || 'Added to cart!');
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlist(productId);
    toast.success(skincareDictionary[selectedLanguage]?.addedToWishlist || 'Added to wishlist!');
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col bg-background border-primary/20 shadow-2xl">
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-xl">Advanced AI Skincare Assistant</CardTitle>
                <p className="text-sm text-white/80">Multilingual • Voice-enabled • Personalized</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Voice Controls */}
              {isSpeaking ? (
                <Button variant="ghost" size="sm" onClick={stopSpeaking} className="text-white hover:bg-white/20">
                  <VolumeX className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className={message.type === 'user' ? 'bg-primary text-white' : 'bg-muted'}>
                      {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 space-y-2 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-lg max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-white ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.confidence && (
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <Sparkles className="h-3 w-3" />
                          <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                          {message.sentiment && (
                            <Badge variant="outline" className="text-xs">
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Product Recommendations */}
                    {message.products && message.products.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {message.products.map((product) => (
                          <div key={product.id} className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow">
                            <div className="flex gap-3">
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleAddToWishlist(product.id)}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Heart className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAddToCart(product.id)}
                                      className="h-7 px-3 text-xs"
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

                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.language && (
                        <Badge variant="outline" className="text-xs">
                          {languages.find(l => l.code === message.language)?.flag}
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-lg bg-muted">
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
                placeholder={selectedLanguage === 'en' ? "Ask me anything about skincare..." : 
                           selectedLanguage === 'es' ? "Pregúntame sobre cuidado de la piel..." :
                           selectedLanguage === 'hi' ? "स्किनकेयर के बारे में कुछ भी पूछें..." :
                           "Ask me anything about skincare..."}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={startListening}
                disabled={isListening}
                className={`${isListening ? 'bg-red-100 text-red-600' : ''}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
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

export default AdvancedSkincareChatbot;