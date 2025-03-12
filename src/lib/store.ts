import { Idea, Task, IdeaCategory, IdeaStatus } from "./types";
import { toast } from "@/lib/toast";

// Internal data structures
const IDEAS_STORAGE_KEY = "ideas-stack-data";

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Load ideas from localStorage
export function loadIdeas(): Idea[] {
  try {
    const storedData = localStorage.getItem(IDEAS_STORAGE_KEY);
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    // Convert string dates back to Date objects
    return parsedData.map((idea: any) => ({
      ...idea,
      createdAt: new Date(idea.createdAt),
      updatedAt: new Date(idea.updatedAt),
      tasks: idea.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }))
    }));
  } catch (error) {
    console.error("Failed to load ideas:", error);
    return [];
  }
}

// Save ideas to localStorage
export function saveIdeas(ideas: Idea[]): void {
  try {
    localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  } catch (error) {
    console.error("Failed to save ideas:", error);
    toast.error("Failed to save your data. Please try again.");
  }
}

// Add a new idea
export function addIdea(
  title: string,
  category: IdeaCategory,
  description: string,
  status: IdeaStatus,
  notes: string
): Idea {
  const ideas = loadIdeas();
  const now = new Date();
  
  const newIdea: Idea = {
    id: generateId(),
    title,
    category,
    description,
    status,
    notes,
    tasks: [],
    createdAt: now,
    updatedAt: now
  };
  
  ideas.push(newIdea);
  saveIdeas(ideas);
  toast.success("Idea added successfully!");
  
  return newIdea;
}

// Update an existing idea
export function updateIdea(updatedIdea: Idea): Idea {
  const ideas = loadIdeas();
  const index = ideas.findIndex(idea => idea.id === updatedIdea.id);
  
  if (index === -1) {
    toast.error("Idea not found");
    throw new Error("Idea not found");
  }
  
  updatedIdea.updatedAt = new Date();
  ideas[index] = updatedIdea;
  saveIdeas(ideas);
  toast.success("Idea updated successfully!");
  
  return updatedIdea;
}

// Delete an idea
export function deleteIdea(id: string): void {
  const ideas = loadIdeas();
  const filteredIdeas = ideas.filter(idea => idea.id !== id);
  
  if (filteredIdeas.length === ideas.length) {
    toast.error("Idea not found");
    throw new Error("Idea not found");
  }
  
  saveIdeas(filteredIdeas);
  toast.success("Idea deleted successfully!");
}

// Add a task to an idea
export function addTask(ideaId: string, title: string, dueDate?: Date): Task {
  const ideas = loadIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === ideaId);
  
  if (ideaIndex === -1) {
    toast.error("Idea not found");
    throw new Error("Idea not found");
  }
  
  const newTask: Task = {
    id: generateId(),
    title,
    completed: false,
    ideaId,
    createdAt: new Date(),
    dueDate
  };
  
  ideas[ideaIndex].tasks.push(newTask);
  ideas[ideaIndex].updatedAt = new Date();
  saveIdeas(ideas);
  
  return newTask;
}

// Update a task
export function updateTask(updatedTask: Task): Task {
  const ideas = loadIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === updatedTask.ideaId);
  
  if (ideaIndex === -1) {
    toast.error("Idea not found");
    throw new Error("Idea not found");
  }
  
  const taskIndex = ideas[ideaIndex].tasks.findIndex(task => task.id === updatedTask.id);
  
  if (taskIndex === -1) {
    toast.error("Task not found");
    throw new Error("Task not found");
  }
  
  ideas[ideaIndex].tasks[taskIndex] = updatedTask;
  ideas[ideaIndex].updatedAt = new Date();
  saveIdeas(ideas);
  
  return updatedTask;
}

// Delete a task
export function deleteTask(ideaId: string, taskId: string): void {
  const ideas = loadIdeas();
  const ideaIndex = ideas.findIndex(idea => idea.id === ideaId);
  
  if (ideaIndex === -1) {
    toast.error("Idea not found");
    throw new Error("Idea not found");
  }
  
  const filteredTasks = ideas[ideaIndex].tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === ideas[ideaIndex].tasks.length) {
    toast.error("Task not found");
    throw new Error("Task not found");
  }
  
  ideas[ideaIndex].tasks = filteredTasks;
  ideas[ideaIndex].updatedAt = new Date();
  saveIdeas(ideas);
}

// Export data as JSON
export function exportData(): string {
  const data = loadIdeas();
  return JSON.stringify(data);
}

// Import data from JSON
export function importData(jsonData: string): void {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Basic validation - make sure it's an array
    if (!Array.isArray(parsedData)) {
      throw new Error("Invalid data format");
    }
    
    // Convert string dates to Date objects
    const processedData = parsedData.map((idea: any) => ({
      ...idea,
      createdAt: new Date(idea.createdAt),
      updatedAt: new Date(idea.updatedAt),
      tasks: idea.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }))
    }));
    
    saveIdeas(processedData);
    toast.success("Data imported successfully!");
  } catch (error) {
    console.error("Failed to import data:", error);
    toast.error("Failed to import data. Invalid format.");
  }
}
