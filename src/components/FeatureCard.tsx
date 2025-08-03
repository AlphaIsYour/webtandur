import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  features: string[];
}

export default function FeatureCard({ icon, title, features }: FeatureCardProps) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="font-semibold text-lg ml-2">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}