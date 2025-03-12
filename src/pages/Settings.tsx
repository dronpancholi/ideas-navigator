
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Trash2, Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { exportData, importData, loadIdeas } from "@/lib/store";
import Navbar from "@/components/Navbar";

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Get data
      const jsonData = exportData();
      
      // Create download file
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Set link properties
      link.href = url;
      link.download = `ideas-stack-backup-${new Date().toISOString().split("T")[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        importData(jsonData);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        toast.success("Data imported successfully");
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data");
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read import file");
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      try {
        // Replace with empty array
        importData("[]");
        toast.success("All data cleared successfully");
      } catch (error) {
        console.error("Clear data error:", error);
        toast.error("Failed to clear data");
      }
    }
  };
  
  // Count total ideas and tasks
  const ideas = loadIdeas();
  const totalIdeas = ideas.length;
  const totalTasks = ideas.reduce((acc, idea) => acc + idea.tasks.length, 0);
  const completedTasks = ideas.reduce(
    (acc, idea) => acc + idea.tasks.filter(task => task.completed).length,
    0
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-6 pt-6 pb-3">
        <h1 className="text-2xl font-semibold text-center mb-2">Settings</h1>
      </div>
      
      {/* Main content */}
      <div className="px-6 py-6 max-w-md mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 mb-6"
        >
          <h2 className="text-lg font-medium mb-4">Data Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">{totalIdeas}</div>
              <div className="text-xs text-muted-foreground">Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">{totalTasks}</div>
              <div className="text-xs text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">{completedTasks}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </motion.div>
        
        {/* Data management */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 mb-6"
        >
          <h2 className="text-lg font-medium mb-4">Backup & Restore</h2>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 px-4 flex items-center justify-center bg-secondary/70 rounded-xl hover:bg-secondary transition-colors"
            >
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2 text-primary" />
              )}
              <span>Export Data</span>
            </button>
            
            <button
              onClick={triggerFileInput}
              disabled={isImporting}
              className="w-full py-3 px-4 flex items-center justify-center bg-secondary/70 rounded-xl hover:bg-secondary transition-colors"
            >
              {isImporting ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Upload className="h-5 w-5 mr-2 text-primary" />
              )}
              <span>Import Data</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </motion.div>
        
        {/* Danger zone */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 border border-destructive/20 mb-6"
        >
          <h2 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h2>
          <button
            onClick={handleClearData}
            className="w-full py-3 px-4 flex items-center justify-center bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            <span>Clear All Data</span>
          </button>
        </motion.div>
        
        {/* About section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-lg font-medium mb-2">First Projects - Ideas Stack</h2>
          <p className="text-sm text-muted-foreground mb-2">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Made with ♥ by Lovable
          </p>
        </motion.div>
      </div>
      
      <Navbar />
    </motion.div>
  );
};

export default Settings;
