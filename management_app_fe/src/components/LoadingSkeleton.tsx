import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProjectCardSkeleton = () => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const TaskCardSkeleton = () => (
  <Card className="group hover:shadow-sm transition-shadow">
    <CardHeader className="pb-3 space-y-2">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-4/5" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const AnalyticsCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-4 lg:pb-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4 rounded" />
    </CardHeader>
    <CardContent className="p-3 lg:p-4 pt-0">
      <Skeleton className="h-8 w-12" />
    </CardContent>
  </Card>
);

export const TaskColumnSkeleton = ({
  taskCount = 3,
}: {
  taskCount?: number;
}) => (
  <div className="flex-1 min-w-0">
    <div className="bg-muted/30 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: taskCount }).map((_, i) => (
          <TaskCardSkeleton key={`task-${i}`} />
        ))}
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-6 lg:mb-8">
      <div className="space-y-2 min-w-0 flex-1">
        <Skeleton className="h-8 lg:h-10 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>

    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={`project-${i}`} />
      ))}
    </div>
  </div>
);

export const ProjectSkeleton = () => (
  <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-6 lg:mb-8">
      <div className="space-y-2 min-w-0 flex-1">
        <Skeleton className="h-8 lg:h-10 w-64" />
        <Skeleton className="h-4 lg:h-5 w-96 max-w-full" />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-24" />
      </div>
    </div>

    <div className="mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnalyticsCardSkeleton key={`analytics-${i}`} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded" />
        </CardContent>
      </Card>
    </div>

    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[400px] lg:min-h-[600px]">
      <TaskColumnSkeleton taskCount={3} />
      <TaskColumnSkeleton taskCount={2} />
      <TaskColumnSkeleton taskCount={4} />
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={`setting-${i}`}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
