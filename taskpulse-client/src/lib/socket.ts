import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from '@/hooks/use-toast';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const url = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5005'
    socketRef.current = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      auth: {
        token: localStorage.getItem('taskpulse_token'),
      },
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to TaskPulse server');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time updates. Some features may not work properly.",
        variant: "destructive",
      });
    });

    // Task-related event handlers
    socket.on('task:created', (task) => {
      console.log('Task created:', task);
      toast({
        title: "New Task",
        description: `A new task "${task.title}" was created.`,
      });
      // In a real app, you would update the tasks state here
      // This requires refactoring to lift state up or use a global state manager
    });

    socket.on('task:updated', (task) => {
      console.log('Task updated:', task);
      toast({
        title: "Task Updated",
        description: `Task "${task.title}" was modified.`,
      });
    });

    socket.on('task:deleted', (taskId) => {
      console.log('Task deleted:', taskId);
      toast({
        title: "Task Deleted",
        description: "A task was removed from the board.",
      });
    });

    // User activity events
    socket.on('user:joined', (user) => {
      toast({
        title: "User Joined",
        description: `${user.name} joined the workspace.`,
      });
    });

    socket.on('user:left', (user) => {
      toast({
        title: "User Left",
        description: `${user.name} left the workspace.`,
      });
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Helper functions to emit events
  const emitTaskCreated = (task: any) => {
    socketRef.current?.emit('task:create', task);
  };

  const emitTaskUpdated = (task: any) => {
    socketRef.current?.emit('task:update', task);
  };

  const emitTaskDeleted = (taskId: string) => {
    socketRef.current?.emit('task:delete', taskId);
  };

  const emitUserActivity = (activity: string) => {
    socketRef.current?.emit('user:activity', activity);
  };

  return {
    socket: socketRef.current,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
    emitUserActivity,
  };
};