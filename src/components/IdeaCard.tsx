
import { motion } from "framer-motion";
import { ChevronRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Idea } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

export default function IdeaCard({ idea, index }: IdeaCardProps) {
  // Calculate progress percentage based on tasks completed
  const totalTasks = idea.tasks.length;
  const completedTasks = idea.tasks.filter(task => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Get appropriate status color
  const getStatusColor = () => {
    switch (idea.status) {
      case "Concept": return "bg-blue-500";
      case "Prototype": return "bg-purple-500";
      case "Testing": return "bg-amber-500";
      case "Implementation": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full"
    >
      <Link to={`/idea/${idea.id}`}>
        <div className="glass rounded-2xl p-5 mb-4 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{idea.title}</h3>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${getStatusColor()} text-white px-2 py-0.5 rounded-full`}>
                    {idea.status}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {idea.category}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
