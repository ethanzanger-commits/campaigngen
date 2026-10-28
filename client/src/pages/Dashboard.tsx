import { useCampaigns } from "@/hooks/use-campaigns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";

export default function Dashboard() {
  const campaigns = useCampaigns();
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">My Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Saved in this browser only. Clearing your browser data removes them.
          </p>
        </div>
        <Button asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 self-start sm:self-auto">
          <Link href="/create">
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            New Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
          {campaigns.map((campaign, index) => (
            <motion.li
              key={campaign.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
            >
              <Link
                href={`/campaigns/${campaign.id}`}
                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              >
                <div className="bg-card group-hover:bg-accent/5 rounded-2xl p-6 border border-border/60 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {campaign.productName}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {campaign.description}
                  </p>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {campaign.tone}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium truncate max-w-[150px]">
                      {campaign.audience}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 sm:py-20 bg-card/50 rounded-3xl border border-dashed border-border px-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold mb-2">No campaigns yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Describe a product, its audience and your preferred tone, and CampaignGen will
            draft slogans, social posts, an email, a media plan and more.
          </p>
          <Button asChild size="lg" className="gap-2 h-12 px-8">
            <Link href="/create">
              <PlusCircle className="w-5 h-5" aria-hidden="true" />
              Create First Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
