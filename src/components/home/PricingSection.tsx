'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2, Github } from 'lucide-react';
import config from '@/config';

const features = [
  {
    text: (
      <>
        <span className="font-semibold text-foreground">Unlimited</span> projects — public or
        private
      </>
    ),
  },
  { text: 'Export to PNG, SVG & PDF with full fidelity' },
  { text: 'Community-driven features and roadmap' },
  { text: 'MIT License — modify, self-host, extend freely' },
];

const PricingSection = () => {
  return (
    <section id="open-source" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free. Open Source. Ready to Scale.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Shandraw is open-source and MIT-licensed. Use it freely in personal, commercial, or
            educational projects. No subscriptions. No lock-in.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <Card className="w-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 max-w-lg shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Github className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-4xl font-bold">Free Forever</CardTitle>
              <h3 className="mt-1 text-muted-foreground text-base font-normal">
                No subscriptions. No hidden fees. Just clean, open code.
              </h3>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4 text-sm sm:text-base text-muted-foreground">
                {features.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="mr-2 mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/register">Start for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href={config.repo} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
