import { Link, useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const mobileLinkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav aria-label="Main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              aria-label="CampaignGen home"
              className="flex-shrink-0 flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                CampaignGen
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Button asChild variant={isActive("/campaigns") ? "secondary" : "ghost"} className="gap-2">
                <Link href="/campaigns" aria-current={isActive("/campaigns") ? "page" : undefined}>
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  My Campaigns
                </Link>
              </Button>
              <Button asChild variant={isActive("/create") ? "default" : "ghost"} className="gap-2">
                <Link href="/create" aria-current={isActive("/create") ? "page" : undefined}>
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  New Campaign
                </Link>
              </Button>
            </div>

            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </nav>

        {menuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/campaigns"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive("/campaigns") ? "page" : undefined}
                className={mobileLinkClass(isActive("/campaigns"))}
              >
                <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                My Campaigns
              </Link>
              <Link
                href="/create"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive("/create") ? "page" : undefined}
                className={mobileLinkClass(isActive("/create"))}
              >
                <PlusCircle className="w-5 h-5" aria-hidden="true" />
                New Campaign
              </Link>
            </div>
          </div>
        )}
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in focus:outline-none"
      >
        {children}
      </main>
    </div>
  );
}
