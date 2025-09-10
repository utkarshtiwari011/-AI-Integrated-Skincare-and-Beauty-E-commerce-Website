import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Beaker, Shield, Leaf, CheckCircle2, Users, LineChart } from 'lucide-react';

interface APlusContentProps {
  product: {
    name: string;
    brand: string;
    benefits: string[];
    ingredients: string[];
  };
}

const APlusContent: React.FC<APlusContentProps> = ({ product }) => {
  return (
    <section aria-label="Enhanced A+ product content">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/10">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Why You'll Love It
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              {product.benefits.slice(0, 6).map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" /> Backed by Science
            </h3>
            <p className="text-sm text-muted-foreground">
              Dermatologist-informed formula blending proven actives with skin-barrier friendly bases for maximum efficacy and comfort.
            </p>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.slice(0, 6).map((ing, i) => (
                <Badge key={i} variant="outline" className="text-xs">{ing}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 mb-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Real Results Timeline</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[['Week 1','Hydration boost'],['Week 2','Texture looks smoother'],['Week 4','Visible radiance'],['Week 8','Peak results']].map(([title, desc], i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <LineChart className="h-4 w-4 text-primary" /> {title}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Why Choose {product.brand}</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[{icon: Beaker, label: 'Clinically Aligned'}, {icon: Leaf, label: 'Clean Ingredients'}, {icon: Shield, label: 'Derm-Tested'}, {icon: Users, label: 'Loved by Customers'}].map((f, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 text-center">
                <f.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">{f.label}</div>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <p className="text-sm text-muted-foreground">
            Designed to slot seamlessly into your AM/PM routine with instant sensorial payoff and long-term skin health benefits.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default APlusContent;
