import { HeartPulse } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center space-y-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 animate-pulse">
        <HeartPulse className="size-8 text-blue-600 dark:text-blue-500 animate-bounce" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading your dashboard...</p>
    </div>
  );
}
