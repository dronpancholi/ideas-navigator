
import { motion } from "framer-motion";
import { ChevronLeft, User, Sun, Moon, Upload, Download, Database, Bell, Globe, Lock, Palette, Cloud, RefreshCw, PenTool, Layout, ListTodo, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { exportData, importData } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState("");
  
  // New state for settings
  const [autoSave, setAutoSave] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState("realtime");
  const [editorFontSize, setEditorFontSize] = useState("medium");
  const [spellCheck, setSpellCheck] = useState(true);
  const [showWordCount, setShowWordCount] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [autoFormatting, setAutoFormatting] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [defaultView, setDefaultView] = useState("list");
  const [defaultCategory, setDefaultCategory] = useState("All");

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
      toast.success("Data imported successfully!");
      setImportText("");
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
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center bg-background/95 backdrop-blur-sm border-b">
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
      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="editor">
              <PenTool className="mr-2 h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="mr-2 h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Layout className="mr-2 h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize how Ideas Stack looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {["Default", "Purple", "Blue", "Green", "Orange"].map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        className={`h-12 w-full ${color === "Default" ? "border-primary" : ""}`}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>Customize your writing experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="spellcheck">Spell Check</Label>
                      <p className="text-sm text-muted-foreground">Highlight spelling errors while typing</p>
                    </div>
                    <Switch 
                      id="spellcheck"
                      checked={spellCheck}
                      onCheckedChange={setSpellCheck}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wordcount">Word Count</Label>
                      <p className="text-sm text-muted-foreground">Show word and character count</p>
                    </div>
                    <Switch 
                      id="wordcount"
                      checked={showWordCount}
                      onCheckedChange={setShowWordCount}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="linenumbers">Line Numbers</Label>
                      <p className="text-sm text-muted-foreground">Display line numbers in the editor</p>
                    </div>
                    <Switch 
                      id="linenumbers"
                      checked={showLineNumbers}
                      onCheckedChange={setShowLineNumbers}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoformat">Auto Formatting</Label>
                      <p className="text-sm text-muted-foreground">Format text automatically as you type</p>
                    </div>
                    <Switch 
                      id="autoformat"
                      checked={autoFormatting}
                      onCheckedChange={setAutoFormatting}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Font Size</Label>
                  <RadioGroup value={editorFontSize} onValueChange={setEditorFontSize}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large">Large</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Settings</CardTitle>
                <CardDescription>Customize how reminders work for your tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminders">Enable Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for upcoming tasks</p>
                  </div>
                  <Switch 
                    id="reminders"
                    checked={remindersEnabled}
                    onCheckedChange={setRemindersEnabled}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Default Reminder Time</Label>
                  <RadioGroup value="9am" onValueChange={() => {}}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="9am" id="9am" />
                        <Label htmlFor="9am">9:00 AM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="12pm" id="12pm" />
                        <Label htmlFor="12pm">12:00 PM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3pm" id="3pm" />
                        <Label htmlFor="3pm">3:00 PM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6pm" id="6pm" />
                        <Label htmlFor="6pm">6:00 PM</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="early-reminder">Early Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send a reminder 15 minutes before the due time</p>
                  </div>
                  <Switch 
                    id="early-reminder"
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Import and export your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full flex items-center justify-center"
                    >
                      {isExporting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Export Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Download all your ideas and tasks as a JSON file
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="import-data">Import Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Paste JSON data to import your ideas and tasks
                      </p>
                    </div>
                    <textarea
                      id="import-data"
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste JSON data to import"
                      rows={4}
                      className="w-full p-3 bg-secondary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                    <Button
                      onClick={handleImport}
                      disabled={isImporting || !importText.trim()}
                      className="w-full flex items-center justify-center"
                    >
                      {isImporting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Import Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sync & Backup</CardTitle>
                <CardDescription>Manage how your data is synchronized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autosave">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                  </div>
                  <Switch 
                    id="autosave"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Sync Frequency</Label>
                  <RadioGroup value={syncFrequency} onValueChange={setSyncFrequency}>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="realtime" id="realtime" />
                        <Label htmlFor="realtime">Real-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly">Hourly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">Manual</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>View Settings</CardTitle>
                <CardDescription>Customize default views for ideas and tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Default View</Label>
                  <RadioGroup value={defaultView} onValueChange={setDefaultView}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="list" id="list" />
                        <Label htmlFor="list">List View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grid" id="grid" />
                        <Label htmlFor="grid">Grid View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kanban" id="kanban" />
                        <Label htmlFor="kanban">Kanban View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="calendar" id="calendar" />
                        <Label htmlFor="calendar">Calendar View</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Default Category Filter</Label>
                  <RadioGroup value={defaultCategory} onValueChange={setDefaultCategory}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="All" id="All" />
                        <Label htmlFor="All">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Business" id="Business" />
                        <Label htmlFor="Business">Business</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tech" id="Tech" />
                        <Label htmlFor="Tech">Tech</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Study" id="Study" />
                        <Label htmlFor="Study">Study</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Personal" id="Personal" />
                        <Label htmlFor="Personal">Personal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Other" id="Other" />
                        <Label htmlFor="Other">Other</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Notify me about:</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="due-soon">Tasks due soon</Label>
                      <Switch id="due-soon" checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="status-changes">Status changes</Label>
                      <Switch id="status-changes" checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-features">New features</Label>
                      <Switch id="new-features" checked={true} onCheckedChange={() => {}} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
                <CardDescription>Configure AI assistant settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Llama API</h3>
                    <p className="text-sm text-muted-foreground">Connected to aimlapi.com</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>AI Features:</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-suggestions">Idea suggestions</Label>
                      <Switch id="ai-suggestions" checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-summary">Auto summarization</Label>
                      <Switch id="ai-summary" checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-categorization">Smart categorization</Label>
                      <Switch id="ai-categorization" checked={false} onCheckedChange={() => {}} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Settings;
