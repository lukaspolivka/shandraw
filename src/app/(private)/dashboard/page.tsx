import { ProjectList } from '@/components/dashboard/ProjectList';
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">My Projects</h2>
      <div className="mt-6">
        <ProjectList />
      </div>
    </div>
  );
};

export default DashboardPage;
