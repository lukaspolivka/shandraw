'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PasswordForm from '@/components/profile/PasswordForm';
import { ProfileForm } from '@/components/profile/ProfileForm';
import ProfilePageSkeleton from '@/components/profile/ProfilePageSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import getInitials from '@/lib/utils/getInitials';

export default function ProfilePage() {
  const { user } = useAppStore();
  const [selectedTab, setSelectedTab] = useState('profile');

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  if (!user) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-2 border rounded-md p-6">
          <Avatar className="h-[120px] w-[120px]">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
          <p className="text-muted-foreground">{user.email}</p>
        </aside>

        <section className="flex-1">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger
                value="profile"
                className="hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Password
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="profile"
              className="mt-6 transition-opacity duration-300 ease-in-out"
              data-state={selectedTab === 'profile' ? 'active' : 'inactive'}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Public Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="password"
              className="mt-6 transition-opacity duration-300 ease-in-out"
              data-state={selectedTab === 'password' ? 'active' : 'inactive'}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
