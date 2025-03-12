import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { exportData, importData } from "@/lib/store";
import { toast } from "@/lib/toast";

const Settings = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ideas-stack-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    setIsImporting(true);
    try {
      importData(importText);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Invalid format.");
    } finally {
      setIsImporting(false);
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
        <h1 className="ml-2 text-xl font-medium">Settings</h1>
      </div>

      {/* Settings content */}
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Theme</h2>
          <ThemeToggle />
        </div>
        
        {/* Export/Import section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Data Management</h2>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 bg-primary text-white rounded-xl flex justify-center items-center hover:bg-primary/90 transition-colors disabled:opacity-70 mb-4"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Export Data"
            )}
          </button>

          {/* Import */}
          <div className="space-y-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON data to import"
              rows={4}
              className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="w-full py-3 bg-accent text-accent-foreground rounded-xl flex justify-center items-center hover:bg-accent/90 transition-colors disabled:opacity-70"
            >
              {isImporting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Import Data"
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
