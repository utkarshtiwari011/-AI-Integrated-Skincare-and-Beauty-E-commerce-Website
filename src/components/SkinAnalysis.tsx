import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Check, User, Brain, Target, Clock } from "lucide-react";
import { aiAlgorithm } from '@/lib/ai-algorithm';

interface AnalysisStep {
  id: string;
  title: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'skin-type',
    title: 'Skin Type',
    question: 'How would you describe your skin type?',
    type: 'single',
    options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
  },
  {
    id: 'concerns',
    title: 'Skin Concerns',
    question: 'What are your main skin concerns? (Select all that apply)',
    type: 'multiple',
    options: ['Acne', 'Fine Lines', 'Dark Spots', 'Large Pores', 'Dullness', 'Redness', 'Uneven Texture']
  },
  {
    id: 'routine',
    title: 'Current Routine',
    question: 'How extensive is your current skincare routine?',
    type: 'single',
    options: ['Just cleanser', 'Basic (cleanser + moisturizer)', 'Moderate (3-5 products)', 'Extensive (6+ products)']
  },
  {
    id: 'goals',
    title: 'Goals',
    question: 'What do you want to achieve with your skincare routine?',
    type: 'multiple',
    options: ['Prevent aging', 'Clear acne', 'Brighten skin', 'Hydrate skin', 'Minimize pores', 'Even skin tone']
  }
];

const SkinAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiResults, setAiResults] = useState<any>(null);

  const currentStepData = analysisSteps[currentStep];
  const progress = ((currentStep + 1) / analysisSteps.length) * 100;

  const handleSingleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentStepData.id]: value }));
  };

  const handleMultipleAnswer = (value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = (prev[currentStepData.id] as string[]) || [];
      if (checked) {
        return { ...prev, [currentStepData.id]: [...currentAnswers, value] };
      } else {
        return { ...prev, [currentStepData.id]: currentAnswers.filter(a => a !== value) };
      }
    });
  };

  const nextStep = async () => {
    if (currentStep < analysisSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnalyzing(true);
      setAnalysisStep(0);
      
      const analysisSteps = [
        'Analyzing skin tone and texture...',
        'Detecting skin concerns...',
        'Processing AI recommendations...',
        'Finalizing personalized results...'
      ];

      // Simulate progressive analysis
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      try {
        // Use enhanced AI algorithm for analysis
        const analysisData = await aiAlgorithm.analyzeSkinProfile({
          oiliness: answers['skin-type'] === 'Oily' ? 8 : answers['skin-type'] === 'Dry' ? 2 : 5,
          sensitivity: answers['skin-type'] === 'Sensitive' ? 9 : 3,
          hydration: answers['skin-type'] === 'Dry' ? 2 : 6,
          concerns: (answers['concerns'] as string[]) || [],
          age: 28,
          climate: 'temperate',
          lifestyle: 'normal'
        });

        setAiResults(analysisData);
      } catch (error) {
        console.error('Analysis error:', error);
        // Fallback to basic results
        setAiResults({
          skinType: answers['skin-type'] as string,
          concerns: (answers['concerns'] as string[]) || [],
          recommendations: ['Use gentle cleanser', 'Apply moisturizer daily', 'Use SPF protection'],
          confidence: 0.85
        });
      }
      
      setIsAnalyzing(false);
      setIsComplete(true);
    }
  };

  const canProceed = () => {
    const answer = answers[currentStepData.id];
    if (currentStepData.type === 'single') {
      return answer && answer !== '';
    } else {
      return answer && (answer as string[]).length > 0;
    }
  };

  if (isAnalyzing) {
    return (
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-card shadow-elevated">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Analyzing Your Skin Profile</h3>
              <p className="text-muted-foreground mb-8">
                Our AI is processing your responses to create personalized recommendations...
              </p>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  {['Analyzing skin tone and texture...', 'Detecting skin concerns...', 'Processing AI recommendations...', 'Finalizing personalized results...'][analysisStep]}
                </p>
                <Progress value={(analysisStep + 1) * 25} className="w-64 mx-auto mb-6" />
                <div className="flex justify-center gap-4">
                  <Brain className="w-6 h-6 text-primary animate-pulse" />
                  <Target className="w-6 h-6 text-muted-foreground" />
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isComplete) {
    return (
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-card shadow-elevated">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl mb-2">Your Personalized Skin Profile</CardTitle>
              <p className="text-muted-foreground">Based on your responses, here's what we recommend</p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Analysis Results */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 fill-primary text-primary" />
                      Skin Type Analysis
                    </h4>
                    <Badge variant="secondary" className="text-lg px-4 py-2 capitalize">
                      {aiResults?.skinType || answers['skin-type'] as string}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {Math.round((aiResults?.confidence || 0.85) * 100)}% Confidence
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Primary Concerns</h4>
                    <div className="flex flex-wrap gap-2">
                      {(aiResults?.concerns || answers['concerns'] as string[])?.map((concern) => (
                        <Badge key={concern} className="bg-gradient-serum capitalize">
                          {concern.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Routine Level</h4>
                    <p className="text-muted-foreground">
                      Based on your current routine: <strong>{answers['routine'] as string}</strong>
                    </p>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Ingredients for You</h4>
                    <div className="space-y-2">
                      {(aiResults?.recommendations || [
                        'Hyaluronic Acid - Deep hydration',
                        'Niacinamide - Pore minimization', 
                        'Vitamin C - Brightening'
                      ]).slice(0, 3).map((rec: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-accent'
                          }`}></div>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Success Timeline</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Week 1-2: Improved hydration</p>
                      <p>• Week 3-4: Smoother texture</p>
                      <p>• Week 6-8: Visible brightening</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="premium" size="lg" className="px-8">
                  View Recommended Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-gradient-card shadow-elevated">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">Step {currentStep + 1} of {analysisSteps.length}</Badge>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mb-6" />
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <p className="text-muted-foreground">{currentStepData.question}</p>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentStepData.type === 'single' ? (
              <RadioGroup
                value={answers[currentStepData.id] as string || ''}
                onValueChange={handleSingleAnswer}
                className="space-y-4"
              >
                {currentStepData.options.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-smooth cursor-pointer">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                {currentStepData.options.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                    <Checkbox
                      id={option}
                      checked={(answers[currentStepData.id] as string[])?.includes(option) || false}
                      onCheckedChange={(checked) => handleMultipleAnswer(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                variant="premium"
              >
                {currentStep === analysisSteps.length - 1 ? 'Complete Analysis' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SkinAnalysis;