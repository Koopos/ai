import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./core/theme/ThemeProvider";
import { AuthProvider } from "./core/auth/AuthProvider";
import { AppLayout } from "./core/layout/AppLayout";
import { LoginPage } from "./core/auth/LoginPage";
import { DashboardPage } from "./modules/daily/pages/DashboardPage";
import { ReadingPage } from "./modules/reading/pages/ReadingPage";
import { MoviesPage } from "./modules/movies/pages/MoviesPage";
import { MusicPage } from "./modules/music/pages/MusicPage";
import { FilesPage } from "./modules/files/pages/FilesPage";
import { SettingsPage } from "./shared/pages/SettingsPage";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/daily" replace />} />
                <Route path="daily" element={<DashboardPage />} />
                <Route path="reading" element={<ReadingPage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="music" element={<MusicPage />} />
                <Route path="files" element={<FilesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
