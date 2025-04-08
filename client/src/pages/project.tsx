import { useState } from "react";
import { useRoute } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import TaskBoard from "@/components/tasks/task-board";
import TaskCreateModal from "@/components/tasks/task-create-modal";
import { useProjectWithStats } from "@/hooks/use-projects";
import { useTeamMembers } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Project() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("week");
  
  // Get project ID from route
  const [match, params] = useRoute("/projects/:id");
  const projectId = match ? parseInt(params.id) : 0;
  
  // Fetch project data
  const { data: project, isLoading } = useProjectWithStats(projectId);
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers(project?.teamId || 0);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-neutral-50">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="main-content flex-1 overflow-auto px-4 py-6 md:px-6 lg:ml-64">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-8 w-40" />
            <div className="mt-3 sm:mt-0">
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="mb-3">
                <Skeleton className="mb-3 h-6 w-32" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, cardIndex) => (
                    <Skeleton key={cardIndex} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-neutral-700">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content flex-1 overflow-auto px-4 py-6 md:px-6 lg:ml-64">
        {/* Project Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">{project.name}</h2>
          <div className="mt-3 flex items-center sm:mt-0">
            <div className="flex -space-x-2">
              {!teamMembersLoading && teamMembers?.slice(0, 3).map((member) => (
                <img
                  key={member.id}
                  className="h-6 w-6 rounded-full border-2 border-white"
                  src={member.user.avatar || "https://via.placeholder.com/40"}
                  alt={member.user.name}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" className="ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4 text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Invite
            </Button>
            <div className="ml-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <TaskBoard projectId={project.id} projectName={project.name} />

        {/* Task Create Modal */}
        <TaskCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultProjectId={projectId}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Add Button - Mobile only */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
