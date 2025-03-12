
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/store";

interface TaskItemProps {
  task: Task;
  index: number;
}

export default function TaskItem({ task, index }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const toggleComplete = () => {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    updateTask(updatedTask);
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    // Small delay for animation
    setTimeout(() => {
      deleteTask(task.ideaId, task.id);
    }, 300);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: isDeleting ? 10 : 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="glass p-3 rounded-xl mb-2 flex items-center justify-between"
    >
      <div 
        className="flex items-center flex-1 cursor-pointer" 
        onClick={toggleComplete}
      >
        <div className="mr-3">
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className={`${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
          {task.dueDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Due: {format(task.dueDate, "MMM d, yyyy")}
            </p>
          )}
        </div>
      </div>
      <button 
        onClick={handleDelete}
        className="text-muted-foreground hover:text-destructive transition-colors p-1"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
