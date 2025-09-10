import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Star, Share2, Sparkles, Plus, Minus, Eye, Zap, Award, Users, Clock, Beaker, Medal, Play, Pause, RotateCcw, Maximize, ThumbsUp, MessageSquare, Camera, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { aiAlgorithm } from '@/lib/ai-algorithm';
import { toast } from 'sonner';

interface InteractiveProductViewerProps {
  product: any;
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

const InteractiveProductViewer: React.FC<InteractiveProductViewerProps> = ({
  product,
  images,
  selectedImage,
  onImageSelect
}) => {
  const [is360View, setIs360View] = useState(false);
  const [isARView, setIsARView] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const simulate360View = () => {
    setIs360View(true);
    // Simulate 360° rotation by cycling through images
    let imageIndex = 0;
    const interval = setInterval(() => {
      onImageSelect(imageIndex % images.length);
      imageIndex++;
      if (imageIndex >= images.length * 2) {
        clearInterval(interval);
        setIs360View(false);
      }
    }, 200);
  };

  const simulateARTryOn = () => {
    setIsARView(true);
    toast.success("AR Try-On simulation activated! 📱 This would open your camera in a real implementation.");
    setTimeout(() => setIsARView(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Interactive Features */}
      <div className="relative group">
        <div 
          className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onMouseMove={handleMouseMove}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={images[selectedImage]}
            alt={`${product.name} - Image ${selectedImage + 1}`}
            className={`w-full h-96 lg:h-[500px] object-cover transition-transform duration-500 ${
              isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-105'
            }`}
            style={isZoomed ? {
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            } : {}}
          />
          
          {/* Interactive Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Interactive Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="h-10 w-10 p-0 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                simulate360View();
              }}
              disabled={is360View}
              className="h-10 w-10 p-0 rounded-full bg-background/80 backdrop-blur-sm"
            >
              {is360View ? <Pause className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                simulateARTryOn();
              }}
              className="h-10 w-10 p-0 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Camera className={`h-4 w-4 ${isARView ? 'text-green-600' : ''}`} />
            </Button>
          </div>

          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.ai_match_score > 90 && (
              <Badge className="bg-gradient-primary text-white border-0 shadow-glow animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Recommended
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-gradient-accent text-white border-0">
                <Medal className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.clinical_evidence_score && product.clinical_evidence_score > 80 && (
              <Badge className="bg-green-600 text-white border-0">
                <Beaker className="h-3 w-3 mr-1" />
                Clinically Proven
              </Badge>
            )}
          </div>

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1">
              <p className="text-xs text-muted-foreground">Click to zoom out</p>
            </div>
          )}

          {/* AR Overlay */}
          {isARView && (
            <div className="absolute inset-0 bg-green-500/20 border-4 border-green-500 rounded-xl animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
                  AR Try-On Active
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 360° View Indicator */}
        {is360View && (
          <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
            360° View Active
          </div>
        )}
      </div>

      {/* Enhanced Image Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Product Views ({images.length})</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Features Panel */}
      <Card className="border-primary/10">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <Button
              variant="outline"
              onClick={simulate360View}
              disabled={is360View}
              className="flex flex-col gap-2 h-auto py-4"
            >
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">360° View</div>
                <div className="text-xs text-muted-foreground">Rotate product</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={simulateARTryOn}
              className="flex flex-col gap-2 h-auto py-4"
            >
              <Camera className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">AR Try-On</div>
                <div className="text-xs text-muted-foreground">Virtual test</div>
              </div>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">AI Analysis</div>
                    <div className="text-xs text-muted-foreground">Detailed insights</div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI Product Analysis</DialogTitle>
                  <DialogDescription>
                    Personalized insights powered by your skin profile and product science.
                  </DialogDescription>
                </DialogHeader>
                <AIProductAnalysis product={product} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AIProductAnalysis: React.FC<{ product: any }> = ({ product }) => {
  const [analysisData, setAnalysisData] = useState({
    compatibilityScore: 0,
    skinBenefits: [],
    timeline: [],
    alternatives: []
  });

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisData({
        compatibilityScore: product.ai_match_score || 85,
        skinBenefits: [
          { benefit: 'Hydration', effectiveness: 92, timeframe: '1-2 weeks' },
          { benefit: 'Anti-aging', effectiveness: 88, timeframe: '4-6 weeks' },
          { benefit: 'Brightness', effectiveness: 76, timeframe: '2-3 weeks' }
        ],
        timeline: [
          { week: 1, result: 'Initial hydration improvement' },
          { week: 2, result: 'Visible texture enhancement' },
          { week: 4, result: 'Noticeable anti-aging effects' },
          { week: 8, result: 'Optimal results achieved' }
        ],
        alternatives: []
      });
    }, 1000);
  }, [product]);

  return (
    <div className="space-y-6">
      {/* Compatibility Score */}
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold text-primary">{analysisData.compatibilityScore}%</div>
        <div className="text-muted-foreground">Compatibility with your skin profile</div>
        <Progress value={analysisData.compatibilityScore} className="h-2" />
      </div>

      {/* Benefits Analysis */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Predicted Benefits
        </h4>
        {analysisData.skinBenefits.map((benefit, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{benefit.benefit}</span>
              <span className="text-muted-foreground">{benefit.timeframe}</span>
            </div>
            <Progress value={benefit.effectiveness} className="h-1" />
          </div>
        ))}
      </div>

      {/* Results Timeline */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Expected Timeline
        </h4>
        <div className="space-y-3">
          {analysisData.timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                {item.week}W
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveProductViewer;