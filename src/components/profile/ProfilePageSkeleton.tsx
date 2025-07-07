'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-3 border rounded-md p-6">
          <Skeleton className="h-[120px] w-[120px] rounded-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-2/3" />
        </aside>

        {/* Tabs + Form Skeleton */}
        <section className="flex-1 space-y-6">
          {/* Tabs Header */}
          <Tabs value="profile" className="w-full">
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="profile" disabled>
                <Skeleton className="h-8 w-full" />
              </TabsTrigger>
              <TabsTrigger value="password" disabled>
                <Skeleton className="h-8 w-full" />
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab Skeleton */}
            <Card className="mt-6">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-28" />
              </CardContent>
            </Card>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
