import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  Film,
  Music,
  FolderOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../auth/AuthProvider";
import { cn } from "../../shared/utils/cn";

const navigation = [
  { name: "日常管理", href: "/daily", icon: Calendar },
  { name: "读书", href: "/reading", icon: BookOpen },
  { name: "电影", href: "/movies", icon: Film },
  { name: "音乐", href: "/music", icon: Music },
  { name: "文件", href: "/files", icon: FolderOpen },
  { name: "设置", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { actualTheme, setTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">家庭娱乐中心</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: navIsActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  navIsActive || isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {actualTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{actualTheme === "dark" ? "亮色模式" : "暗色模式"}</span>
        </button>

        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors text-muted-foreground"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
