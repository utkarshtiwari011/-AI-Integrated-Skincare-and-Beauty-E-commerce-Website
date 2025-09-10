import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Microscope, 
  Shield, 
  Sparkles, 
  Zap, 
  Heart,
  Leaf,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';
// import ProductViewer3D from '@/components/3d/ProductViewer3D';

const features = [
  {
    icon: Brain,
    title: 'AI Skin Analysis',
    description: 'Advanced computer vision analyzes your skin type, concerns, and recommends perfect products.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    details: ['Real-time analysis', 'Skin type detection', 'Concern identification', 'Personalized recommendations']
  },
  {
    icon: Microscope,
    title: 'Clinical Formulations',
    description: 'Laboratory-tested ingredients with proven efficacy for visible results.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    details: ['Dermatologist tested', 'Clinical trials', 'Safe ingredients', 'Proven results']
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'All products are hypoallergenic, cruelty-free, and suitable for sensitive skin.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    details: ['Hypoallergenic', 'Cruelty-free', 'Sensitive skin safe', 'No harmful chemicals']
  },
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    description: 'Premium botanical extracts and natural ingredients for gentle yet effective care.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    details: ['Organic extracts', 'Sustainable sourcing', 'Eco-friendly', 'Pure formulations']
  },
  {
    icon: Zap,
    title: 'Fast Results',
    description: 'See visible improvements in your skin within 7-14 days of consistent use.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    details: ['7-day results', 'Fast absorption', 'Immediate hydration', 'Visible improvement']
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized by beauty experts and dermatologists worldwide for excellence.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    details: ['Beauty awards', 'Expert recognition', 'Customer choice', 'Industry leader']
  }
];

const stats = [
  { number: '50,000+', label: 'Happy Customers', icon: Users },
  { number: '4.9/5', label: 'Average Rating', icon: Star },
  { number: '98%', label: 'Satisfaction Rate', icon: Heart },
  { number: '7 Days', label: 'Visible Results', icon: Clock }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gradient-primary text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Advanced Technology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">Revolutionary</span> Skincare Science
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Combining cutting-edge AI technology with premium ingredients to deliver 
            personalized skincare solutions that actually work.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 3D Product Showcase */}
        <motion.div 
          className="bg-gradient-card rounded-3xl p-8 border border-border/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-secondary text-secondary-foreground">
                Interactive 3D
              </Badge>
              <h3 className="text-3xl font-bold mb-4">
                Experience Our Products in <span className="text-gradient-primary">3D</span>
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Interact with our premium skincare products in an immersive 3D environment. 
                Rotate, zoom, and explore every detail of our carefully crafted formulations.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Premium glass packaging</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Elegant product design</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Sustainable materials</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Premium Serum</h3>
                  <p className="text-white/80">Interactive Experience</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-lg">
                <div className="text-xs font-medium text-white">Premium Quality</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;