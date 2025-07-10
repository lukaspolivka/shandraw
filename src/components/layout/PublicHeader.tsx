import ThemeToggle from './ThemeToggle';
import PublicAuthButton from './Header/PublicAuthButton';
import AppLogo from './Header/AppLogo';

const PublicHeader = () => {
  return (
    <header className="sticky top-0 h-16 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-5 flex h-16  items-center justify-between">
        <AppLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <PublicAuthButton />
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
