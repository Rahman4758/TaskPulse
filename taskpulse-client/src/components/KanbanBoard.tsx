import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, data: Partial<Task>) => void;
}

const statusConfig = {
  todo: {
    title: 'To Do',
    icon: Circle,
    className: 'status-todo',
    bgColor: 'bg-status-todo/5',
  },
  'in-progress': {
    title: 'In Progress',
    icon: Clock,
    className: 'status-progress',
    bgColor: 'bg-orange-500/5',
  },
  done: {
    title: 'Done',
    icon: CheckCircle2,
    className: 'status-done',
    bgColor: 'bg-status-done/5',
  },
};

export const KanbanBoard = ({ 
  tasks, 
  loading, 
  onEditTask, 
  onDeleteTask, 
  onUpdateTask 
}: KanbanBoardProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask(draggedTask._id, { status });
    }
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map((status) => (
          <Card key={status} className="kanban-column">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(Object.keys(statusConfig) as TaskStatus[]).map((status) => {
        const config = statusConfig[status];
        const statusTasks = getTasksByStatus(status);
        const Icon = config.icon;

        return (
          <Card
            key={status}
            className={`kanban-column ${config.className} ${config.bgColor}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span>{config.title}</span>
                </div>
                <Badge variant="secondary" className="bg-background/50">
                  {statusTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {statusTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                    <Icon className="h-8 w-8" />
                  </div>
                  <p className="text-sm">No tasks yet</p>
                  <p className="text-xs">Drag tasks here or create new ones</p>
                </div>
              ) : (
                statusTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedTask?._id === task._id}
                  />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};