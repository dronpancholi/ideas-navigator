
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckSquare, List, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Idea, Task } from "@/lib/types";
import { loadIdeas } from "@/lib/store";
import TaskItem from "@/components/TaskItem";
import Navbar from "@/components/Navbar";

const TaskTracker = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming">("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = () => {
      const ideasData = loadIdeas();
      setIdeas(ideasData);
      
      // Flatten all tasks into a single array
      const allTasks = ideasData.flatMap(idea => 
        idea.tasks.map(task => ({
          ...task,
          ideaId: idea.id
        }))
      );
      
      setTasks(allTasks);
      setIsLoading(false);
    };
    
    loadData();
    
    // Listen for storage changes
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);
  
  // Get filtered tasks based on active tab
  const filteredTasks = activeTab === "all" 
    ? tasks 
    : tasks.filter(task => 
        !task.completed && task.dueDate && new Date(task.dueDate) > new Date()
      );
  
  // Group tasks by idea
  const tasksByIdea = filteredTasks.reduce((acc, task) => {
    if (!acc[task.ideaId]) {
      acc[task.ideaId] = [];
    }
    acc[task.ideaId].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // Find idea by id
  const getIdeaById = (id: string) => ideas.find(idea => idea.id === id);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-6 pt-6 pb-3">
        <h1 className="text-2xl font-semibold text-center mb-4">Task Tracker</h1>
        
        {/* Tabs */}
        <div className="flex justify-center p-1 bg-secondary/50 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-sm"
                : "hover:bg-secondary"
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm transition-all ${
              activeTab === "upcoming"
                ? "bg-primary text-white shadow-sm"
                : "hover:bg-secondary"
            }`}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Upcoming
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="px-6 py-6 max-w-md mx-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-secondary rounded-xl w-full mb-2"></div>
            <div className="h-10 bg-secondary rounded-xl w-full mb-2"></div>
            <div className="h-10 bg-secondary rounded-xl w-5/6"></div>
          </div>
        ) : Object.keys(tasksByIdea).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(tasksByIdea).map(([ideaId, tasks]) => {
              const idea = getIdeaById(ideaId);
              if (!idea) return null;
              
              return (
                <motion.div
                  key={ideaId}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-2xl p-4"
                >
                  <Link to={`/idea/${ideaId}`} className="block mb-3">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Lightbulb className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{idea.title}</h3>
                        <div className="flex text-xs">
                          <span className="text-muted-foreground">
                            {idea.category}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {idea.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="pl-4 space-y-2">
                    {tasks.map((task, index) => (
                      <TaskItem key={task.id} task={task} index={index} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "all" 
                ? "You don't have any tasks yet" 
                : "You don't have any upcoming tasks"}
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Go Back Home
            </Link>
          </motion.div>
        )}
      </div>
      
      <Navbar />
    </motion.div>
  );
};

export default TaskTracker;
