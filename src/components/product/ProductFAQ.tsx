import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductFAQProps {
  product: {
    name: string;
    brand: string;
    skin_types: string[];
    usage_frequency?: string;
    ingredients: string[];
  };
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ product }) => {
  const faqs = [
    {
      question: `Is ${product.name} suitable for my skin type?`,
      answer: `This product is specifically formulated for ${product.skin_types.join(', ')} skin types. Our advanced formula is designed to work harmoniously with these skin types for optimal results. If you have sensitive skin or specific concerns, we recommend doing a patch test before full application.`
    },
    {
      question: "How often should I use this product?",
      answer: `For best results, use this product ${product.usage_frequency || 'daily'} as part of your skincare routine. Start with a smaller amount to allow your skin to adjust, then gradually increase to the recommended frequency. Consistency is key to seeing visible improvements.`
    },
    {
      question: "What are the key active ingredients?",
      answer: `This formula contains carefully selected active ingredients including ${product.ingredients.slice(0, 3).join(', ')}, and more. Each ingredient is chosen for its specific benefits and proven efficacy. All ingredients are dermatologically tested and safe for regular use.`
    },
    {
      question: "How long before I see results?",
      answer: "Most users begin to notice improvements within 2-4 weeks of consistent use. However, individual results may vary based on skin type, condition, and adherence to the recommended usage. For optimal results, use consistently as part of a complete skincare routine."
    },
    {
      question: "Can I use this with other skincare products?",
      answer: "Yes, this product is designed to work well with other skincare products. However, we recommend introducing one new product at a time to monitor your skin's response. If using active ingredients like retinol or acids, consult with a dermatologist for the best layering sequence."
    },
    {
      question: "Is this product cruelty-free and vegan?",
      answer: `${product.brand} is committed to ethical beauty practices. This product is cruelty-free and we do not test on animals. For specific vegan certifications and detailed ingredient sourcing information, please check the product packaging or contact our customer service team.`
    },
    {
      question: "What if I experience irritation or allergic reactions?",
      answer: "If you experience any irritation, redness, or allergic reactions, discontinue use immediately and rinse the area with cool water. We recommend patch testing all new products. If symptoms persist, consult with a dermatologist. Our customer service team is also available to help with any concerns."
    },
    {
      question: "How should I store this product?",
      answer: "Store in a cool, dry place away from direct sunlight and heat. Keep the container tightly closed when not in use. Avoid storing in areas with high humidity like bathrooms if possible. Proper storage helps maintain the product's efficacy and extends its shelf life."
    }
  ];

  return (
    <Card className="border-primary/10 shadow-elevated">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-6">
          <h4 className="font-semibold text-xl">Frequently Asked Questions</h4>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-primary/10">
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 p-6 bg-primary/5 rounded-xl">
            <h5 className="font-semibold text-primary mb-2">Still have questions?</h5>
            <p className="text-muted-foreground mb-4">
              Our skincare experts are here to help! Get personalized advice and recommendations.
            </p>
            <div className="flex gap-4">
              <button className="text-primary font-medium hover:underline">
                Chat with Expert
              </button>
              <button className="text-primary font-medium hover:underline">
                Email Support
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFAQ;