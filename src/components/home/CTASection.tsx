import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const CTASection = () => {
  return (
    <>
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Check out our Documentation
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Dive deeper into DBML and learn all the features of Shandraw.
          </p>
          <Button asChild className="mt-8" size="lg" variant="outline">
            <Link href="https://dbml.dbdiagram.io/home" target="_blank">
              Read the Docs
            </Link>
          </Button>
        </div>
      </section>
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to map out your masterpiece?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sign up now and start diagramming in seconds.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default CTASection;
