import Link from 'next/link';
import Image from 'next/image';
import config from '@/config';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export function ShareHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-card/75 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Go to homepage" className="flex items-center gap-2">
          <Image
            src="/icon-transparent.png"
            alt={config.app_name || 'App Logo'}
            width={30}
            height={30}
            priority
          />
          <span className="text-xl font-bold text-foreground">{config.app_name}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link href="/login" passHref>
            <Button asChild>
              <span>Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
