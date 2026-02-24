import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '../contexts/RoleContext';
import RoleToggle from './RoleToggle';
import SubmitRequestPage from '../pages/SubmitRequestPage';
import ViewRequestsPage from '../pages/ViewRequestsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import { FileBarChart } from 'lucide-react';
import { Heart } from 'lucide-react';

export default function Layout() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
                <FileBarChart className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">Report Request Portal</h1>
                <p className="text-sm text-muted-foreground font-medium">Power BI Report Management</p>
              </div>
            </div>
            <RoleToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto mb-10 h-12 p-1.5 bg-muted/50 backdrop-blur-sm" style={{ gridTemplateColumns: role === 'Admin' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
            <TabsTrigger 
              value="submit" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium transition-all"
            >
              Submit Request
            </TabsTrigger>
            <TabsTrigger 
              value="view"
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium transition-all"
            >
              View Requests
            </TabsTrigger>
            {role === 'Admin' && (
              <TabsTrigger 
                value="admin"
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium transition-all"
              >
                Admin Dashboard
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="submit" className="mt-0 animate-fade-in">
            <SubmitRequestPage />
          </TabsContent>

          <TabsContent value="view" className="mt-0 animate-fade-in">
            <ViewRequestsPage />
          </TabsContent>

          {role === 'Admin' && (
            <TabsContent value="admin" className="mt-0 animate-fade-in">
              <AdminDashboardPage />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Report Request Portal. Built with{' '}
            <Heart className="inline w-4 h-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
