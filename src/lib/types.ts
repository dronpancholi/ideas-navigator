
export type IdeaStatus = "Concept" | "Prototype" | "Testing" | "Implementation";

export type IdeaCategory = 
  | "Business" 
  | "Tech" 
  | "Study" 
  | "Investment" 
  | "Personal" 
  | "Other";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  ideaId: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface Idea {
  id: string;
  title: string;
  category: IdeaCategory;
  description: string;
  status: IdeaStatus;
  notes: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
