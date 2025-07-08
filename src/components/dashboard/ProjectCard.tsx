'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { MoreVertical, Trash2, Share2, ArrowRight, Table2, GitMerge, Globe } from 'lucide-react';

import type { ProjectData } from '@/types';

interface ProjectCardProps {
  project: ProjectData;
  onDelete: (id: string) => void;
  onShare: (project: ProjectData) => void;
}

export function ProjectCard({ project, onDelete, onShare }: ProjectCardProps) {
  const tablesCount = useMemo(
    () => project.nodes?.filter((n) => n.type === 'table').length ?? 0,
    [project.nodes]
  );

  const relationsCount = useMemo(() => project.edges?.length ?? 0, [project.edges]);

  return (
    <Card className="group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{project.projectName}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Project options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onShare(project)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {project.isPublic && (
          <Badge variant="secondary" className="flex items-center w-fit text-xs">
            <Globe className="mr-1.5 h-3 w-3" />
            Publicly Shared
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-2 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Table2 className="h-4 w-4" />
            {tablesCount} {tablesCount === 1 ? 'Table' : 'Tables'}
          </span>
          <span className="flex items-center gap-1.5">
            <GitMerge className="h-4 w-4" />
            {relationsCount} {relationsCount === 1 ? 'Relation' : 'Relations'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="justify-end pt-4">
        <Link href={`/editor/${project.id}`} aria-label={`Open ${project.projectName}`}>
          <Button size="sm" className="group/button">
            Open Project
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
