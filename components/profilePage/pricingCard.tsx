import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';


type PricingCardProps = {
    name: string;
    price: string;
    features: string[];
    buttonText: string;
    disabled?: boolean;
    current?: boolean;
    highlighted?: boolean;
  };
  
  export const PricingCard = ({
    name,
    price,
    features,
    buttonText,
    disabled = false,
    current = false,
    highlighted = false,
  }: PricingCardProps) => {
    return (
      <Card
        className={`border-2 transition-all ${
          highlighted
            ? "border-green-500"
            : "border-transparent hover:border-green-500"
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{name}</CardTitle>
            {current && <Badge>Current</Badge>}
          </div>
          <CardDescription>
            <span className="text-2xl font-bold">{price}</span>/month
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    );
  };