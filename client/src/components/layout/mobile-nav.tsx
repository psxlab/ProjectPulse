import React from "react";
import { useLocation, Link } from "wouter";
import { LayoutDashboard, FileText, Plus, BarChart3 } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 z-20 flex w-full justify-between border-t border-neutral-200 bg-white shadow-lg md:hidden">
      <Link href="/">
        <a className={`flex flex-1 flex-col items-center justify-center py-3 ${
          location === "/" ? "text-primary" : "text-neutral-500"
        }`}>
          <LayoutDashboard className="h-6 w-6" />
          <span className="mt-1 text-xs">Home</span>
        </a>
      </Link>
      
      <a className="flex flex-1 flex-col items-center justify-center py-3 text-neutral-500">
        <FileText className="h-6 w-6" />
        <span className="mt-1 text-xs">Projects</span>
      </a>
      
      <a className="flex flex-1 flex-col items-center justify-center py-3 text-neutral-500">
        <Plus className="h-6 w-6" />
        <span className="mt-1 text-xs">Add</span>
      </a>
      
      <a className="flex flex-1 flex-col items-center justify-center py-3 text-neutral-500">
        <BarChart3 className="h-6 w-6" />
        <span className="mt-1 text-xs">Reports</span>
      </a>
      
      <a className="flex flex-1 flex-col items-center justify-center py-3 text-neutral-500">
        <img 
          className="h-6 w-6 rounded-full" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
          alt="User profile" 
        />
        <span className="mt-1 text-xs">Profile</span>
      </a>
    </div>
  );
}
