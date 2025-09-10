import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote, Verified } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Beauty Enthusiast',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'The AI skin analysis was incredibly accurate! It recommended the perfect serum for my hyperpigmentation, and I saw results in just 2 weeks. My skin has never looked better!',
    product: 'Vitamin C Serum',
    verified: true,
    beforeAfter: 'Reduced dark spots by 80%'
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    role: 'Dermatology Student',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'As someone studying dermatology, I was impressed by the scientific approach. The ingredients are top-notch, and the formulations are comparable to clinical-grade products.',
    product: 'Retinol Night Cream',
    verified: true,
    beforeAfter: 'Smoother skin texture in 4 weeks'
  },
  {
    id: 3,
    name: 'Jessica Chen',
    role: 'Working Professional',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'The personalized routine completely transformed my skincare game. The products work beautifully together, and my morning routine is now something I actually look forward to!',
    product: 'Complete Routine Set',
    verified: true,
    beforeAfter: 'Glowing, hydrated skin daily'
  },
  {
    id: 4,
    name: 'Amanda Taylor',
    role: 'Sensitive Skin Sufferer',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'Finally found products that don\'t irritate my sensitive skin! The gentle formulations are incredibly effective. My skin barrier has never been stronger.',
    product: 'Gentle Cleanser',
    verified: true,
    beforeAfter: 'No more irritation or redness'
  },
  {
    id: 5,
    name: 'Rachel Kim',
    role: 'Skincare Blogger',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'I\'ve tried hundreds of skincare products for my blog, and these are truly exceptional. The quality, packaging, and results are all premium. Highly recommend!',
    product: 'Hydrating Mask',
    verified: true,
    beforeAfter: 'Plump, moisturized skin instantly'
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    role: 'Busy Mom',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'Perfect for my busy lifestyle! The products are easy to use and incredibly effective. Even with limited time, I can maintain healthy, glowing skin.',
    product: 'Multi-Step Routine',
    verified: true,
    beforeAfter: 'Healthy glow in minimal time'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
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
            <Verified className="w-4 h-4 mr-2" />
            Real Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-primary">50,000+</span> Happy Customers
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See what our customers are saying about their transformative skincare journeys 
            with our AI-powered recommendations and premium products.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300 relative overflow-hidden">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Product Used */}
                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-primary mb-1">Product Used:</div>
                    <div className="text-sm text-muted-foreground">{testimonial.product}</div>
                  </div>

                  {/* Results */}
                  <div className="bg-green-500/10 rounded-lg p-3 mb-6">
                    <div className="text-sm font-medium text-green-600 mb-1">Results:</div>
                    <div className="text-sm text-muted-foreground">{testimonial.beforeAfter}</div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-primary rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-sm opacity-90">Satisfied Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">4.9★</div>
            <div className="text-sm opacity-90">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-sm opacity-90">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">30K+</div>
            <div className="text-sm opacity-90">5-Star Reviews</div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Trusted by Leading Beauty Experts</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">Dermatologist Approved</div>
            <div className="w-px h-6 bg-border" />
            <div className="text-lg font-semibold">Allure Beauty Award</div>
            <div className="w-px h-6 bg-border" />
            <div className="text-lg font-semibold">Vogue Recommended</div>
            <div className="w-px h-6 bg-border" />
            <div className="text-lg font-semibold">FDA Approved</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;