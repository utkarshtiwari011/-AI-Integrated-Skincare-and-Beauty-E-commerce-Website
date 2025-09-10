import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import SkincareChatbot from './SkincareChatbot';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-elevated hover:scale-110 transition-all duration-300 z-40"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <SkincareChatbot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default ChatbotButton;