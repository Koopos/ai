import { useAuth } from "../auth/AuthProvider";
import { User, Bell } from "lucide-react";

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Breadcrumb or page title */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">欢迎回来, {user?.displayName || user?.username}!</h2>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full" />
            ) : (
              <User className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.displayName}</p>
            <p className="text-muted-foreground text-xs capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
