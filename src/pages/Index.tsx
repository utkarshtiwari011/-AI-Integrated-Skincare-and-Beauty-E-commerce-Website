import Navigation from "@/components/Navigation";
import EnhancedHero from "@/components/Hero/EnhancedHero";
import ProductGrid from "@/components/ProductGrid";
import SkinAnalysis from "@/components/SkinAnalysis";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { useState } from "react";

const Index = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {!showAnalysis ? (
        <>
          <EnhancedHero />
          <FeaturesSection />
          <ProductShowcase />
          <TestimonialsSection />
          <ProductGrid />
          
          {/* Call to Action Section */}
          <section className="py-20 bg-gradient-hero">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Skin?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who've discovered their perfect skincare routine with our AI-powered analysis
              </p>
              <button
                onClick={() => setShowAnalysis(true)}
                className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-glow transition-spring"
              >
                Start Your Free Analysis
              </button>
            </div>
          </section>
        </>
      ) : (
        <SkinAnalysis />
      )}
      
      {/* Footer */}
      <footer className="bg-foreground/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">G</span>
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  GlowAI
                </span>
              </div>
              <p className="text-muted-foreground">
                AI-powered skincare solutions for your unique skin needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Serums</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Moisturizers</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Cleansers</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Treatments</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">AI Tools</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Skin Analysis</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Product Matching</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Routine Builder</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Progress Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Returns</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 GlowAI. All rights reserved. Powered by advanced AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;