
import { IdeaStatus } from "@/lib/types";

interface ProgressBarProps {
  status: IdeaStatus;
}

export default function ProgressBar({ status }: ProgressBarProps) {
  const statuses: IdeaStatus[] = ["Concept", "Prototype", "Testing", "Implementation"];
  const currentIndex = statuses.indexOf(status);
  
  return (
    <div className="mb-6">
      <div className="relative flex items-center justify-between">
        {statuses.map((statusItem, index) => {
          const isActive = index <= currentIndex;
          const isCurrentStatus = status === statusItem;
          
          return (
            <div key={statusItem} className="flex flex-col items-center z-10">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? "bg-primary" : "bg-secondary"
                } ${isCurrentStatus ? "ring-4 ring-primary/20" : ""}`}
              >
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
              <span 
                className={`text-xs mt-2 font-medium text-center transition-all duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {statusItem}
              </span>
            </div>
          );
        })}
        
        {/* Progress lines between circles */}
        <div className="absolute top-3 left-0 right-0 h-px bg-secondary -z-0">
          <div 
            className="absolute top-0 left-0 h-px bg-primary transition-all duration-700"
            style={{ 
              width: currentIndex === 0 ? "0%" : 
                     currentIndex === 1 ? "33%" : 
                     currentIndex === 2 ? "66%" : 
                     "100%" 
            }}
          />
        </div>
      </div>
    </div>
  );
}
