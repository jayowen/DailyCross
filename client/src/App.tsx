import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SermonsPage from "@/pages/sermons-page";
import StoriesPage from "@/pages/stories-page";
import WorshipPage from "@/pages/worship-page";
import PodcastsPage from "@/pages/podcasts-page";
import ChurchDirectoryPage from "@/pages/community-page";
import ChurchDetailPage from "@/pages/church-detail-page";
import BibleStudyPage from "@/pages/bible-study-page";
import MyGrowthPage from "@/pages/my-growth-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/sermons" component={SermonsPage} />
      <ProtectedRoute path="/stories" component={StoriesPage} />
      <ProtectedRoute path="/worship" component={WorshipPage} />
      <ProtectedRoute path="/podcasts" component={PodcastsPage} />
      <ProtectedRoute path="/community" component={ChurchDirectoryPage} />
      <ProtectedRoute path="/church/:id" component={ChurchDetailPage} />
      <ProtectedRoute path="/bible-study" component={BibleStudyPage} />
      <ProtectedRoute path="/my-growth" component={MyGrowthPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
