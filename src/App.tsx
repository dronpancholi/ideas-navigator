import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import AddIdea from "./pages/AddIdea";
import IdeaDetails from "./pages/IdeaDetails";
import TaskTracker from "./pages/TaskTracker";
import Settings from "./pages/Settings";
import ChatAssistant from "./pages/ChatAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="ideas-stack-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add" element={<AddIdea />} />
            <Route path="/idea/:id" element={<IdeaDetails />} />
            <Route path="/tasks" element={<TaskTracker />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
