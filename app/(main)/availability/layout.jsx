import { Suspense } from "react";
import { CalendarClock, Loader2 } from "lucide-react";

function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="relative">
        <div className="animate-pulse bg-primary/10 rounded-lg p-4 mb-3">
          <CalendarClock className="h-8 w-8 text-primary/70" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
          
        </div>
      </div>
    </div>
  );
}

export default function EventsPage({children}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <Suspense fallback={<LoadingIndicator />}>
        {children}
      </Suspense>
    </div>
  );
}