
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  ChevronLeft, 
  Pencil, 
  Trash2, 
  Plus, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { Idea, Task, IdeaStatus } from "@/lib/types";
import { loadIdeas, updateIdea, deleteIdea, addTask } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";
import Navbar from "@/components/Navbar";

const IdeaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedIdea, setEditedIdea] = useState<Partial<Idea>>({});
  
  useEffect(() => {
    const loadData = () => {
      if (!id) return;
      
      const ideas = loadIdeas();
      const found = ideas.find(idea => idea.id === id);
      
      setIdea(found || null);
      setIsLoading(false);
      
      if (found) {
        setEditedIdea({
          title: found.title,
          category: found.category,
          description: found.description,
          status: found.status,
          notes: found.notes
        });
      }
    };
    
    loadData();
    
    // Listen for storage changes
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [id]);
  
  const handleStatusChange = (newStatus: IdeaStatus) => {
    if (idea) {
      const updatedIdea = { ...idea, status: newStatus };
      updateIdea(updatedIdea);
      setIdea(updatedIdea);
    }
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (idea && newTaskTitle.trim()) {
      const newTask = addTask(idea.id, newTaskTitle.trim());
      setIdea({
        ...idea,
        tasks: [...idea.tasks, newTask]
      });
      setNewTaskTitle("");
      setShowTaskForm(false);
    }
  };
  
  const handleDeleteIdea = () => {
    if (idea && window.confirm("Are you sure you want to delete this idea?")) {
      deleteIdea(idea.id);
      navigate("/");
    }
  };
  
  const handleSaveEdit = () => {
    if (idea && editedIdea.title) {
      const updatedIdea = {
        ...idea,
        ...editedIdea,
      };
      updateIdea(updatedIdea);
      setIdea(updatedIdea);
      setIsEditing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-64">
          <div className="h-6 bg-secondary rounded"></div>
          <div className="h-4 bg-secondary rounded w-5/6"></div>
          <div className="h-4 bg-secondary rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  if (!idea) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-medium mb-2">Idea not found</h2>
        <p className="text-muted-foreground mb-6 text-center">
          The idea you're looking for doesn't exist or has been deleted
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }
  
  // Calculate progress percentage based on tasks completed
  const totalTasks = idea.tasks.length;
  const completedTasks = idea.tasks.filter(task => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-xl font-medium">Idea Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label={isEditing ? "Cancel editing" : "Edit idea"}
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={handleDeleteIdea}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Delete idea"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="px-6 py-6 max-w-md mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={editedIdea.title || ""}
                onChange={(e) => setEditedIdea({ ...editedIdea, title: e.target.value })}
                className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="edit-category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="edit-category"
                value={editedIdea.category}
                onChange={(e) => setEditedIdea({ ...editedIdea, category: e.target.value as any })}
                className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Business">Business</option>
                <option value="Tech">Tech</option>
                <option value="Study">Study</option>
                <option value="Investment">Investment</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                value={editedIdea.description || ""}
                onChange={(e) => setEditedIdea({ ...editedIdea, description: e.target.value })}
                rows={4}
                className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="edit-notes" className="block text-sm font-medium mb-2">
                Notes
              </label>
              <textarea
                id="edit-notes"
                value={editedIdea.notes || ""}
                onChange={(e) => setEditedIdea({ ...editedIdea, notes: e.target.value })}
                rows={3}
                className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <button
                onClick={handleSaveEdit}
                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 glass rounded-2xl p-5"
            >
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{idea.title}</h2>
                  <p className="text-sm text-muted-foreground">{idea.category}</p>
                </div>
              </div>
              <p className="mb-4">{idea.description}</p>
              <div className="text-xs text-muted-foreground mb-1">
                Created on {format(new Date(idea.createdAt), "MMMM d, yyyy")}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-3">Progress Status</h3>
              <ProgressBar status={idea.status} />
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {["Concept", "Prototype", "Testing", "Implementation"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as IdeaStatus)}
                    className={`p-2 rounded-xl text-sm transition-all ${
                      idea.status === status
                        ? "bg-primary text-white"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {idea.notes && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 glass rounded-2xl p-5"
              >
                <h3 className="text-lg font-medium mb-3">Notes & Research</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{idea.notes}</p>
              </motion.div>
            )}
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Tasks</h3>
                <div className="flex items-center">
                  <div className="text-xs mr-2">
                    <span className="font-medium">{completedTasks}</span>
                    <span className="text-muted-foreground"> of </span>
                    <span className="font-medium">{totalTasks}</span>
                  </div>
                  <div className="w-16 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              {showTaskForm ? (
                <form onSubmit={handleAddTask} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 p-3 bg-secondary/50 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 rounded-r-xl hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="w-full py-3 mb-4 flex items-center justify-center bg-secondary/70 rounded-xl hover:bg-secondary transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add Task</span>
                </button>
              )}
              
              {idea.tasks.length > 0 ? (
                <div className="space-y-2">
                  {idea.tasks.map((task, index) => (
                    <TaskItem key={task.id} task={task} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 glass rounded-2xl">
                  <CheckCircle className="h-10 w-10 text-muted mx-auto mb-2" />
                  <p className="text-muted-foreground">No tasks yet</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
      
      <Navbar />
    </motion.div>
  );
};

export default IdeaDetails;
