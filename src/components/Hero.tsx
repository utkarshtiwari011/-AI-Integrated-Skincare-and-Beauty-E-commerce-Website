import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Heart, Search } from "lucide-react";
import heroImage from "@/assets/hero-skincare.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">Trusted by 50,000+ customers</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Skincare Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Discover your perfect skincare routine with our advanced AI analysis. 
              Personalized recommendations based on your unique skin needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="premium" className="text-lg px-8 py-4">
                <Search className="mr-2" />
                Start AI Analysis
              </Button>
              <Button size="lg" variant="serum" className="text-lg px-8 py-4">
                Shop Products
              </Button>
            </div>
          </div>
          
          {/* Right Content - AI Analysis Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-border/50 shadow-elevated max-w-md">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4">Free Skin Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Get personalized product recommendations in under 2 minutes
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Skin type identification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">Concern-based matching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">Ingredient compatibility</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6" variant="glow">
                  Begin Analysis
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-pulse opacity-40 delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-accent rounded-full animate-pulse opacity-50 delay-500"></div>
    </section>
  );
};

export default Hero;