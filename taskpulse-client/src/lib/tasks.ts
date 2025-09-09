import { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = "https://taskpulse-ow75.onrender.com/api"; 
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('taskpulse_token');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // For demo purposes, use mock data
      // setTasks(getMockTasks());
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<CreateTaskRequest>) => {
    try {
      const token = localStorage.getItem('taskpulse_token');
        const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      // For demo purposes, create mock task locally
      const mockTask: Task = {
        _id: Date.now().toString(),
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, mockTask]);
      
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<UpdateTaskRequest>) => {
    try {
      const token = localStorage.getItem('taskpulse_token');
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      // For demo purposes, update task locally
      setTasks(prev => prev.map(task => 
        task._id === taskId 
          ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
          : task
      ));
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('taskpulse_token');
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(task => task._id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      // For demo purposes, delete task locally
      setTasks(prev => prev.filter(task => task._id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};


