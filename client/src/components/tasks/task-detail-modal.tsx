import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { insertTaskSchema } from "@shared/schema";
import { useTask, useUpdateTask, useTaskComments, useCreateComment } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { useUsers } from "@/hooks/use-teams";
import { format } from "date-fns";
import {
  Check,
  Calendar,
  Tag,
  MessageSquare,
  Clock,
  X,
  User,
  Send,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TaskStatus, TaskPriority } from "@shared/schema";
import { CommentWithUser } from "@/lib/types";

// Form schema for task update
const formSchema = insertTaskSchema.extend({
  tags: z.string().optional().transform(val => val ? val.split(",").map(tag => tag.trim()) : []),
  id: z.number(),
});

type TaskFormValues = z.infer<typeof formSchema>;

// Comment form schema
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

type TaskDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
};

export default function TaskDetailModal({
  isOpen,
  onClose,
  taskId,
}: TaskDetailModalProps) {
  const { toast } = useToast();
  const { data: task, isLoading } = useTask(taskId);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(taskId);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: createComment, isPending: isCommentPending } = useCreateComment();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  // Get users for assignee field
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
  });
  
  // Task edit form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: taskId,
      title: "",
      description: "",
      projectId: undefined,
      status: "todo" as TaskStatus,
      priority: "medium" as TaskPriority,
      assigneeId: undefined,
      creatorId: 1, // Hardcoded for this example
      dueDate: undefined,
      tags: "",
      progress: 0,
    },
  });
  
  // Comment form
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });
  
  // Update form values when task data is loaded
  useEffect(() => {
    if (task) {
      form.reset({
        id: task.id,
        title: task.title,
        description: task.description || "",
        projectId: task.projectId,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : undefined,
        tags: task.tags?.join(", ") || "",
        progress: task.progress || 0,
      });
    }
  }, [task, form]);
  
  const onSubmit = (data: TaskFormValues) => {
    // Convert string date to Date object if provided
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    
    updateTask(
      { id: taskId, data: formattedData },
      {
        onSuccess: () => {
          toast({
            title: "Task updated",
            description: "Task has been updated successfully.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error updating task",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };
  
  const onCommentSubmit = (data: CommentFormValues) => {
    createComment(
      {
        taskId,
        comment: {
          userId: 1, // Hardcoded for this example
          content: data.content,
        },
      },
      {
        onSuccess: () => {
          commentForm.reset();
        },
        onError: (error) => {
          toast({
            title: "Error adding comment",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };
  
  if (isLoading) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{task?.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Progress</FormLabel>
                        <span className="text-sm">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <Progress value={field.value} className="h-2" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
            
            <Separator className="my-6" />
            
            {/* Comments Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Comments
              </h3>
              
              <div className="space-y-4 mb-4">
                {commentsLoading ? (
                  <p>Loading comments...</p>
                ) : comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar>
                        <AvatarImage src={comment.user.avatar || ""} />
                        <AvatarFallback>
                          {comment.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-xs text-neutral-500 ml-2">
                            {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm">No comments yet</p>
                )}
              </div>
              
              {/* Add Comment */}
              <Form {...commentForm}>
                <form
                  onSubmit={commentForm.handleSubmit(onCommentSubmit)}
                  className="flex items-end space-x-2"
                >
                  <FormField
                    control={commentForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Add a comment..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="sm" disabled={isCommentPending}>
                    <Send className="h-4 w-4 mr-1" />
                    {isCommentPending ? "Sending..." : "Send"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      onOpenChange={() => field.onBlur()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      onOpenChange={() => field.onBlur()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Assignee</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString()}
                      onOpenChange={() => field.onBlur()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Due Date</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex">
                          <Input type="date" {...field} className="w-full" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Project</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      onOpenChange={() => field.onBlur()}
                      disabled={projectsLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Design, Development, Research..."
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task?.tags?.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


