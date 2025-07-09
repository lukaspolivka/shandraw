import ThemeToggle from './ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';
import AppLogo from './Header/AppLogo';
import ProjectCreateButton from './Header/ProjectCreateButton';

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <AppLogo />
        <div className="flex items-center gap-3">
          <ProjectCreateButton />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
