'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';
import config from '@/config';
import Link from 'next/link';

interface ShareProjectModalProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareProjectModal({ project, open, onOpenChange }: ShareProjectModalProps) {
  const [isPublic, setIsPublic] = useState(project.isPublic);
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getToken, updateProjectInList } = useAppStore();

  useEffect(() => {
    setIsPublic(project.isPublic);
    if (project.isPublic && project.shareId) {
      setShareLink(`${config.base_url}/share/${project.shareId}`);
    } else {
      setShareLink('');
    }
  }, [project]);

  const handleTogglePublic = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const token = getToken()!;
      const response = await fetch('/api/project/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId: project.id, isPublic: checked }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const result = await response.json();
      const updatedProject = result.data;
      updateProjectInList(updatedProject);
      setIsPublic(updatedProject.isPublic);
      if (updatedProject.isPublic && updatedProject.shareId) {
        setShareLink(`${config.base_url}/share/${updatedProject.shareId}`);
      } else {
        setShareLink('');
      }
      toast({
        title: 'Sharing Updated',
        description: `Project is now ${updatedProject.isPublic ? 'public' : 'private'}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
      setIsPublic(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({ title: 'Link Copied!', description: 'Shareable link copied to clipboard.' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{project.projectName}"</DialogTitle>
          <DialogDescription>
            Toggle sharing to make your diagram publicly viewable via a link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-4">
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={isLoading}
            />
            <Label htmlFor="public-switch" className="flex flex-col items-start">
              <span>Public Sharing</span>
              <span className="text-xs text-muted-foreground">
                Anyone with the link can view and export.
              </span>
            </Label>
            
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {(!isLoading &&shareLink && isPublic) && <Link href={shareLink} target='_blank'>
            <Button variant="outline" size="icon"><Eye className="h-4 w-4"/></Button>
            </Link>}
          </div>

          {isPublic && shareLink && (
            <div className="space-y-2">
              <Label htmlFor="share-link">Shareable Link</Label>
              <div className="flex items-center space-x-2">
                <Input id="share-link" value={shareLink} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
