import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const HeroSection = () => {
  return (
    <section className="py-20 text-center md:py-32">
      <div className="container">
        <Badge variant="outline" className="mb-4">
          Beta
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Visualize Your Database Instantly
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Shandraw is a code-driven diagramming tool that turns your database schema into beautiful,
          interactive diagrams in real-time.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Get Started for Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
