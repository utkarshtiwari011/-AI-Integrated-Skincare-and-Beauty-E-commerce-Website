import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, User, Search } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              AI-Powered Skincare
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Combining cutting-edge artificial intelligence with premium skincare science 
              to deliver personalized beauty solutions that actually work.
            </p>
            <div className="flex justify-center gap-4">
              <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2">
                50,000+ Happy Customers
              </Badge>
              <Badge className="bg-gradient-serum text-foreground px-4 py-2">
                96% Satisfaction Rate
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Our <span className="bg-gradient-primary bg-clip-text text-transparent">Story</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2023, GlowAI emerged from a simple realization: everyone's skin is unique, 
                yet the beauty industry has been offering one-size-fits-all solutions for decades.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our team of dermatologists, data scientists, and beauty experts came together to create 
                the world's first AI-powered skincare recommendation engine that truly understands 
                individual skin needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span>Advanced AI analysis of skin conditions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-300"></div>
                  <span>Personalized product recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-500"></div>
                  <span>Continuous learning and improvement</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-card shadow-elevated p-8 animate-float">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Our proprietary algorithm analyzes over 100 skin parameters to create your unique profile
                  </p>
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    99.7% Accuracy Rate
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Cutting-Edge
              </span>{" "}
              Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We leverage the latest in AI, machine learning, and dermatological science
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-elevated p-6 text-center hover:shadow-glow transition-spring">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary-foreground rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Computer Vision</h3>
              <p className="text-muted-foreground">
                Advanced image analysis to identify skin conditions, texture, and concerns with medical-grade precision
              </p>
            </Card>

            <Card className="bg-gradient-card shadow-elevated p-6 text-center hover:shadow-glow transition-spring">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary-foreground rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
              <p className="text-muted-foreground">
                Continuously learning from thousands of skin profiles to improve recommendation accuracy
              </p>
            </Card>

            <Card className="bg-gradient-card shadow-elevated p-6 text-center hover:shadow-glow transition-spring">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary-foreground rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dermatology Science</h3>
              <p className="text-muted-foreground">
                Backed by clinical research and developed in partnership with leading dermatologists
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Meet Our <span className="bg-gradient-primary bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Experts in AI, dermatology, and beauty science working together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-elevated overflow-hidden group hover:shadow-glow transition-spring">
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. Priya Sharma</h3>
                <p className="text-primary font-medium mb-2">Chief Dermatologist</p>
                <p className="text-sm text-muted-foreground">
                  15+ years in dermatology research, specializing in personalized skincare solutions
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card shadow-elevated overflow-hidden group hover:shadow-glow transition-spring">
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rahul Patel</h3>
                <p className="text-primary font-medium mb-2">AI Research Director</p>
                <p className="text-sm text-muted-foreground">
                  Former Google AI researcher, expert in computer vision and machine learning
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card shadow-elevated overflow-hidden group hover:shadow-glow transition-spring">
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ananya Gupta</h3>
                <p className="text-primary font-medium mb-2">Product Innovation Lead</p>
                <p className="text-sm text-muted-foreground">
                  Beauty industry veteran with 12 years in product development and formulation
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Trusted by Thousands
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">50,000+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">96%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">1M+</div>
              <p className="text-muted-foreground">AI Analyses Performed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">500+</div>
              <p className="text-muted-foreground">Premium Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who've discovered their perfect skincare routine with our AI-powered analysis
          </p>
          <Button size="lg" variant="premium" className="px-8 py-4 text-lg animate-pulse-glow">
            <Search className="mr-2" />
            Start Your Free Analysis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;