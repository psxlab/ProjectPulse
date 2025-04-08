import React from "react";
import { useLocation, Link } from "wouter";
import { useProjects } from "@/hooks/use-projects";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { data: projects, isLoading } = useProjects();

  return (
    <aside 
      className={`sidebar fixed inset-y-0 left-0 z-10 flex w-64 flex-col bg-white shadow-md transition-all lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-4">
        <h1 className="text-xl font-bold text-primary">TaskFlow</h1>
        <button onClick={onClose} className="lg:hidden">
          <X className="h-5 w-5 text-neutral-500" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold uppercase text-neutral-500">Main Menu</p>
          <Link href="/">
            <a className={`mt-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
              location === "/" 
                ? "bg-primary-light/10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </a>
          </Link>
          <a className="mt-1 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <FileText className="mr-3 h-5 w-5" />
            Projects
          </a>
          <a className="mt-1 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <Users className="mr-3 h-5 w-5" />
            Teams
          </a>
          <a className="mt-1 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <BarChart3 className="mr-3 h-5 w-5" />
            Reports
          </a>
        </div>

        <div className="mb-4">
          <p className="px-3 text-xs font-semibold uppercase text-neutral-500">Your Projects</p>
          
          {isLoading ? (
            <>
              <Skeleton className="mt-2 h-8 w-full" />
              <Skeleton className="mt-1 h-8 w-full" />
              <Skeleton className="mt-1 h-8 w-full" />
            </>
          ) : (
            projects?.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <a className={`mt-1 flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  location === `/projects/${project.id}` 
                    ? "bg-primary-light/10 text-primary" 
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}>
                  <span 
                    className="mr-3 h-2 w-2 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  ></span>
                  {project.name}
                </a>
              </Link>
            ))
          )}
        </div>
      </nav>

      <div className="border-t border-neutral-100 p-4">
        <div className="flex items-center">
          <img 
            className="h-8 w-8 rounded-full" 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User avatar" 
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-700">Tom Cook</p>
            <p className="text-xs text-neutral-500">tom@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
