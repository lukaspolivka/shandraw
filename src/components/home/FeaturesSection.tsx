import React from 'react';
import { CheckCircle2, FileCode, Move, Download, WifiOff, Github } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

const features = [
  {
    icon: <FileCode className="h-6 w-6 text-primary" />,
    title: 'Code-First Approach',
    description: 'Write DBML, see your diagram update live. No more drag-and-drop fuss.',
  },
  {
    icon: <Move className="h-6 w-6 text-primary" />,
    title: 'Interactive Diagrams',
    description: 'Pan, zoom, and explore your schema with a fluid and responsive canvas.',
  },
  {
    icon: <Download className="h-6 w-6 text-primary" />,
    title: 'Multiple Export Options',
    description: 'Export your diagrams to PNG, SVG, or PDF for documentation and sharing.',
  },
  {
    icon: <WifiOff className="h-6 w-6 text-primary" />,
    title: 'Offline Support',
    description:
      'Work on your diagrams even without an internet connection. Your changes sync automatically.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-32 px-10 bg-muted/50">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Design Schemas
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Powerful features designed for developers and data architects.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 max-w-lg shadow-xl"
            >
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-md font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
