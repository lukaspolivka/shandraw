import config from '@/config';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/75 py-6 text-center text-sm text-muted-foreground backdrop-blur-lg print:hidden">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {config.app_name}. All Rights Reserved.
          </p>
          <p className="font-medium">
            Developed by{' '}
            <span className="font-semibold text-primary transition-colors hover:text-primary/80">
              {config.developer}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
