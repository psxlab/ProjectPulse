import { useState, useEffect } from "react";
import { Task } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import { Bell, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { data: assignee } = useQuery({
    queryKey: ["/api/users", task.assigneeId],
    enabled: !!task.assigneeId,
  });
  
  // Format task date info
  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const isPastDue = isPast(dueDate) && task.status !== "done";
    const isToday = new Date().toDateString() === dueDate.toDateString();
    
    let dateText = formatDistanceToNow(dueDate, { addSuffix: true });
    if (isToday) dateText = "Today";
    
    return { dateText, isPastDue, isToday };
  };
  
  const dueDateInfo = getDueDateInfo();
  
  // Get tag styling
  const getTagStyle = (tagName: string) => {
    switch (tagName.toLowerCase()) {
      case "design":
        return "bg-neutral-100 text-neutral-800";
      case "development":
        return "bg-info/10 text-info";
      case "ux design":
        return "bg-primary/10 text-primary";
      case "research":
        return "bg-neutral-100 text-neutral-800";
      case "qa":
        return "bg-warning/10 text-warning";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };
  
  return (
    <div 
      className={`cursor-pointer rounded-lg bg-white p-4 shadow-sm ${
        task.status === "done" ? "opacity-70" : ""
      }`} 
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
          getTagStyle(task.tags[0] || "")
        }`}>
          {task.tags[0] || "Task"}
        </span>
        <div className="flex items-center text-neutral-500">
          {dueDateInfo?.isPastDue ? (
            <Bell className="mr-1 h-4 w-4 text-error" />
          ) : task.status === "done" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : dueDateInfo?.isToday ? (
            <Bell className="mr-1 h-4 w-4" />
          ) : null}
          <span className={`text-xs ${dueDateInfo?.isPastDue ? "text-error" : ""}`}>
            {dueDateInfo?.dateText || "No due date"}
          </span>
        </div>
      </div>
      
      <h4 className="mt-2 font-medium text-neutral-800">{task.title}</h4>
      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{task.description}</p>
      
      {task.progress !== undefined && task.progress > 0 && (
        <div className="mt-3">
          <Progress value={task.progress} className="h-2" />
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          {assignee ? (
            <>
              <img 
                className="h-6 w-6 rounded-full" 
                src={assignee.avatar || "https://via.placeholder.com/24"} 
                alt={assignee.name} 
              />
              <span className="ml-2 text-xs text-neutral-500">{assignee.name}</span>
            </>
          ) : (
            <span className="text-xs text-neutral-500">Unassigned</span>
          )}
        </div>
        
        <div className="flex items-center text-neutral-500">
          <Calendar className="mr-1 h-4 w-4" />
          <span className="text-xs">
            {task.dueDate 
              ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : "No date"}
          </span>
        </div>
      </div>
    </div>
  );
}
