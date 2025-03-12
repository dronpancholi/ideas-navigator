
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { IdeaCategory, IdeaStatus } from "@/lib/types";
import { addIdea } from "@/lib/store";

const AddIdea = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("Business");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IdeaStatus>("Concept");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories: IdeaCategory[] = [
    "Business", 
    "Tech", 
    "Study", 
    "Investment", 
    "Personal", 
    "Other"
  ];
  
  const statuses: IdeaStatus[] = [
    "Concept", 
    "Prototype", 
    "Testing", 
    "Implementation"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      addIdea(title, category, description, status, notes);
      navigate("/");
    } catch (error) {
      console.error("Error adding idea:", error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-6 py-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-2 text-xl font-medium">Add New Idea</h1>
      </div>
      
      {/* Form */}
      <div className="px-6 py-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
              required
              className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IdeaCategory)}
              required
              className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea"
              rows={4}
              required
              className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statuses.map((stat) => (
                <button
                  key={stat}
                  type="button"
                  onClick={() => setStatus(stat)}
                  className={`p-3 rounded-xl transition-all ${
                    status === stat
                      ? "bg-primary text-white"
                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes & Research
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or research details (optional)"
              rows={3}
              className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white rounded-xl flex justify-center items-center hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Idea"
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddIdea;
