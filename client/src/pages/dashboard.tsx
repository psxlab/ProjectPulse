import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import OverviewStats from "@/components/dashboard/overview-stats";
import ProjectTabs from "@/components/dashboard/project-tabs";
import TaskBoard from "@/components/tasks/task-board";
import TaskCreateModal from "@/components/tasks/task-create-modal";
import { useProjects } from "@/hooks/use-projects";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatsResponse } from "@/lib/types";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: stats, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  const mobileAppProject = projects?.find(p => p.name === "Mobile App Redesign");

  // Handle project selection
  const handleProjectSelect = (projectId: number) => {
    setSelectedProject(projectId);
    setLocation(`/projects/${projectId}`);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content flex-1 overflow-auto px-4 py-6 md:px-6 lg:ml-64">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
              <p className="text-sm text-neutral-500">
                Welcome back, here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm sm:w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
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
                Add Task
              </Button>
            </div>
          </div>
        </header>

        {/* Overview Stats */}
        <OverviewStats stats={stats} isLoading={statsLoading} />

        {/* Project Tabs */}
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Task Board */}
        {mobileAppProject && (
          <TaskBoard
            projectId={mobileAppProject.id}
            projectName={mobileAppProject.name}
          />
        )}

        {/* Task Create Modal */}
        <TaskCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultProjectId={selectedProject || undefined}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
