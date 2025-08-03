"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQCardProps {
  question: string;
  answer: string;
  className?: string;
  initialOpen?: boolean;
}

export default function FAQCard({
  question,
  answer,
  className = '',
  initialOpen = false,
}: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${className} ${
        isOpen ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question}`}
      >
        <h3 className="font-medium text-gray-900">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div
        id={`faq-answer-${question}`}
        className={`px-4 pb-4 pt-0 transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}