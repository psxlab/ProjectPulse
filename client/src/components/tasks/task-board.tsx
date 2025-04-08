import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useTasks, useTasksByStatus } from "@/hooks/use-tasks";
import { useUsers } from "@/hooks/use-teams";
import TaskCard from "@/components/tasks/task-card";
import TaskDetailModal from "@/components/tasks/task-detail-modal";
import { Button } from "@/components/ui/button";
import { Task } from "@shared/schema";
import { MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TaskBoardProps = {
  projectId: number;
  projectName: string;
};

export default function TaskBoard({ projectId, projectName }: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  
  // Get tasks by status
  const { data: todoTasks, isLoading: todoLoading } = useTasksByStatus(projectId, "todo");
  const { data: inProgressTasks, isLoading: inProgressLoading } = useTasksByStatus(projectId, "in_progress");
  const { data: reviewTasks, isLoading: reviewLoading } = useTasksByStatus(projectId, "review");
  const { data: doneTasks, isLoading: doneLoading } = useTasksByStatus(projectId, "done");
  
  const isLoading = todoLoading || inProgressLoading || reviewLoading || doneLoading;
  
  const handleTaskClick = (taskId: number) => {
    setSelectedTask(taskId);
  };
  
  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };
  
  const renderTaskColumn = (
    title: string, 
    tasks: Task[] | undefined, 
    count: number,
    status: string,
    isLoading: boolean
  ) => {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            {title} <span className="ml-1 rounded-full bg-neutral-100 px-2 text-xs text-neutral-600">{count}</span>
          </h3>
          <button className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </>
          ) : (
            <>
              {tasks?.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => handleTaskClick(task.id)} 
                />
              ))}
              
              <Button 
                variant="outline" 
                className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 p-3 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
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
            </>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* To Do Column */}
        {renderTaskColumn("To Do", todoTasks, todoTasks?.length || 0, "todo", todoLoading)}
        
        {/* In Progress Column */}
        {renderTaskColumn("In Progress", inProgressTasks, inProgressTasks?.length || 0, "in_progress", inProgressLoading)}
        
        {/* Review Column */}
        {renderTaskColumn("Review", reviewTasks, reviewTasks?.length || 0, "review", reviewLoading)}
        
        {/* Done Column */}
        {renderTaskColumn("Done", doneTasks, doneTasks?.length || 0, "done", doneLoading)}
      </div>
      
      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal 
          isOpen={selectedTask !== null} 
          onClose={handleCloseTaskDetail} 
          taskId={selectedTask} 
        />
      )}
    </div>
  );
}


