import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Users, Sparkles, Heart, Verified } from 'lucide-react';

const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      text: "Dermatologist Tested",
      color: "text-green-600"
    },
    {
      icon: Award,
      text: "Beauty Awards Winner",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      text: "50K+ Happy Customers",
      color: "text-blue-600"
    },
    {
      icon: Sparkles,
      text: "Clean Beauty",
      color: "text-purple-600"
    },
    {
      icon: Heart,
      text: "Cruelty Free",
      color: "text-pink-600"
    },
    {
      icon: Verified,
      text: "Authentic Product",
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-xl">
      {signals.map((signal, index) => {
        const Icon = signal.icon;
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Icon className={`h-4 w-4 ${signal.color}`} />
            <span className="font-medium">{signal.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustSignals;