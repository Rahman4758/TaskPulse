import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const priorityConfig = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

export const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  isDragging 
}: TaskCardProps) => {
  const priority = priorityConfig[task.priority];

  return (
    <Card
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      className={`
        task-card cursor-move transition-[var(--transition-smooth)]
        ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'}
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {task.title}
          </h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-60 hover:opacity-100"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task._id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 ${priority.className}`}
          >
            {priority.label}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};