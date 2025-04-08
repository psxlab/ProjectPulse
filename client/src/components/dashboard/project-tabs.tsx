import React from "react";

type ProjectTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-6">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange("all");
            }}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === "all" 
                ? "border-primary text-primary" 
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            All Projects
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange("my-tasks");
            }}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === "my-tasks" 
                ? "border-primary text-primary" 
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            My Tasks
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange("team");
            }}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === "team" 
                ? "border-primary text-primary" 
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            Team
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange("reports");
            }}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === "reports" 
                ? "border-primary text-primary" 
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            Reports
          </a>
        </nav>
      </div>
    </div>
  );
}
