import { StatsResponse } from "@/lib/types";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type OverviewStatsProps = {
  stats?: StatsResponse;
  isLoading: boolean;
};

export default function OverviewStats({ stats, isLoading }: OverviewStatsProps) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <Skeleton className="mr-4 h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-primary-light/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Projects</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.totalProjects || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-info/10 p-3">
            <Clock className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">In Progress</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.inProgress || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-success/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Completed</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.completed || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-error/10 p-3">
            <AlertCircle className="h-6 w-6 text-error" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Overdue</p>
            <p className="text-2xl font-bold text-neutral-800">{stats?.overdue || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
