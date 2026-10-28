import { useCampaign } from "@/hooks/use-campaigns";
import { deleteCampaign } from "@/lib/campaign-store";
import { useRoute, useLocation, Link } from "wouter";
import { ArrowLeft, Trash2, Copy, Check, Mail, Hash, TrendingUp, Palette, DollarSign, Zap, Lightbulb, Sparkles, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CAMPAIGN_TABS: [string, string][] = [
  ["overview", "Overview"],
  ["social", "Social Media"],
  ["email", "Email Marketing"],
  ["vendors", "Media Vendors"],
  ["competitors", "Competitor Analysis"],
  ["budget", "Budget Plan"],
  ["creative", "Creative Mocks"],
  ["metrics", "Metrics"],
  ["bigidea", "Big Idea"],
  ["charts", "Charts"],
];

// Notice shown on sections whose numbers/claims are model-generated
function AiEstimateNote() {
  return (
    <p className="text-sm text-muted-foreground bg-muted/50 border border-border/50 rounded-lg px-4 py-3">
      These figures are AI-generated estimates, not verified data. Check them against your own
      sources before you rely on them.
    </p>
  );
}

// Helper for copy to clipboard button
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); fail quietly.
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Copied" : ""}</span>
    </Button>
  );
}

function CopyBodyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; fail quietly.
    }
  };
  return (
    <Button variant="outline" className="gap-2" onClick={handleCopy}>
      {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
      {copied ? "Copied" : "Copy Body"}
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Email body copied to clipboard" : ""}</span>
    </Button>
  );
}

export default function CampaignDetails() {
  const [, params] = useRoute("/campaigns/:id");
  const [, setLocation] = useLocation();
  const campaign = useCampaign(params?.id ?? "");

  if (!campaign) {
    return (
      <div className="text-center py-16" role="alert">
        <p className="text-destructive font-medium text-lg">Campaign not found</p>
        <p className="text-muted-foreground mt-2">
          Campaigns are saved in the browser that created them. It may have been deleted, or it
          was created on another device.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/campaigns">Back to My Campaigns</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete the campaign for "${campaign.productName}"? This can't be undone.`)) {
      deleteCampaign(campaign.id);
      setLocation("/campaigns");
    }
  };

  // Type assertion for generated content
  const content = campaign.generatedContent as any;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-4">
        <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors">
          <Link href="/campaigns">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to My Campaigns
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display break-words">{campaign.productName}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="text-sm px-3 py-1 font-medium">
                {campaign.tone}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 font-medium text-muted-foreground">
                Target: {campaign.audience}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="gap-2 self-start text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs for different content types */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-1">
          <TabsList className="bg-secondary/50 p-1 rounded-xl inline-flex h-auto w-max min-w-full sm:flex sm:flex-wrap sm:w-full justify-start">
            {CAMPAIGN_TABS.map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-lg whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
          {/* Campaign Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Campaign Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaign.campaignStartDate && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                    <p className="text-lg font-semibold">{new Date(campaign.campaignStartDate).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              )}
              {campaign.campaignEndDate && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">End Date</p>
                    <p className="text-lg font-semibold">{new Date(campaign.campaignEndDate).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              )}
              {campaign.budget && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-semibold">{campaign.budget}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Competitors */}
          {campaign.competitors && campaign.competitors.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Competitors</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {campaign.competitors.map((competitor: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-sm px-3 py-2">
                        {competitor}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Slogans */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Hash className="w-5 h-5" />
              </span>
              Slogans & Headlines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content?.slogans?.map((slogan: string, i: number) => (
                <div key={i} className="bg-card p-4 rounded-xl border border-border/60 flex justify-between items-center group hover:border-primary/40 transition-colors">
                  <p className="font-medium text-lg leading-snug">"{slogan}"</p>
                  <div className="sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <CopyButton text={slogan} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Selling Points */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Key Selling Points</h2>
            <div className="bg-card rounded-xl border border-border/60 p-6 shadow-sm">
              <ul className="space-y-3">
                {content?.sellingPoints?.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="social" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content?.socialMediaPosts?.map((post: any, i: number) => (
              <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant={post.platform === 'Twitter' ? 'default' : 'secondary'} className="capitalize">
                      {post.platform}
                    </Badge>
                    <CopyButton text={post.content} />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  <div className="text-sm text-primary font-medium">
                    {post.hashtags?.join(" ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
          <Card className="max-w-3xl mx-auto border-t-4 border-t-primary shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Subject Line</h3>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {content?.emailDraft?.subject}
                    <CopyButton text={content?.emailDraft?.subject || ""} />
                  </div>
                </div>
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-lg leading-relaxed font-body">
                  {content?.emailDraft?.body}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <CopyBodyButton text={content?.emailDraft?.body || ""} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.mediaVendorRecommendations || content.mediaVendorRecommendations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No media vendor recommendations available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see vendor recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
            <AiEstimateNote />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.mediaVendorRecommendations.map((vendor: any, i: number) => (
                <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">{vendor.platform}</h3>
                          {vendor.vendor && <Badge variant="outline" className="text-xs">{vendor.vendor}</Badge>}
                          {vendor.category && <Badge variant="secondary" className="text-xs">{vendor.category}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{vendor.rationale}</p>
                        {vendor.marqueeUnits && vendor.marqueeUnits.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Ad Formats:</p>
                            <div className="flex flex-wrap gap-1">
                              {vendor.marqueeUnits.map((unit: string, j: number) => (
                                <Badge key={j} variant="outline" className="text-xs bg-primary/5">
                                  {unit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Badge className="text-base px-3 py-1 bg-primary/20 text-primary border-0 flex-shrink-0">
                        {vendor.recommendedBudgetPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.competitorAnalysis || content.competitorAnalysis.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No competitor analysis available</p>
                <p className="text-sm text-muted-foreground mt-2">Add competitors to your campaign for detailed competitive analysis.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <AiEstimateNote />
              {content.competitorAnalysis.map((comp: any, i: number) => (
                <Card key={i} className="border-t-4 border-t-amber-500/70 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{comp.competitor}</h3>
                        {comp.estimatedMonthlySpend && (
                          <p className="text-sm text-muted-foreground mt-2">Estimated Monthly Spend: <span className="font-semibold text-foreground">{comp.estimatedMonthlySpend}</span></p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {comp.strongChannels && comp.strongChannels.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Strong Channels:</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.strongChannels.map((channel: string, j: number) => (
                            <Badge key={j} variant="secondary">{channel}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {comp.positioningGap && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Differentiation Opportunity:</p>
                        <p className="text-foreground">{comp.positioningGap}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="budget" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.budgetRecommendation ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No budget recommendation available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see budget recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <AiEstimateNote />
              <Card className="border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Budget Recommendation</h3>
                      <p className="text-sm text-muted-foreground">{content.budgetRecommendation.recommendedTotal}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(content.budgetRecommendation.breakdown || {}).map(([channel, percentage]: [string, any]) => (
                      <div key={channel} className="bg-muted/50 p-4 rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground capitalize">{channel.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-2xl font-bold mt-2">{percentage}</p>
                      </div>
                    ))}
                  </div>
                  {content.budgetRecommendation.estimatedReachPercentage && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-muted-foreground">Estimated Reach</p>
                      <p className="text-3xl font-bold text-primary mt-2">{content.budgetRecommendation.estimatedReachPercentage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="creative" className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.creativeMocks || content.creativeMocks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No creative mocks available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see creative mockups.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.creativeMocks.map((mock: any, i: number) => (
                <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">{mock.platform}</Badge>
                        <h3 className="text-lg font-bold">{mock.headline}</h3>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Palette className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Visual Design</p>
                      <p className="text-foreground">{mock.visualDescription}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Call to Action</p>
                      <p className="font-medium">{mock.callToAction}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.estimatedMetrics ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No estimated metrics available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see performance metrics.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
            <AiEstimateNote />
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">Estimated Performance Metrics</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Monthly Reach", value: content.estimatedMetrics.expectedReachMonthly, icon: "👥" },
                    { label: "Conversion Rate", value: content.estimatedMetrics.expectedConversionRate, icon: "✓" },
                    { label: "ROI", value: content.estimatedMetrics.expectedROI, icon: "📈" },
                    { label: "Cost Per Acquisition", value: content.estimatedMetrics.estimatedCPA, icon: "💰" },
                    { label: "Engagement Rate", value: content.estimatedMetrics.expectedEngagementRate, icon: "💬" },
                  ].map((metric, i) => (
                    <div key={i} className="bg-muted/50 p-6 rounded-lg border border-border/40">
                      <p className="text-sm font-medium text-muted-foreground mb-3">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bigidea" className="animate-in slide-in-from-bottom-2 fade-in duration-500">
          {!content?.bigIdea ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No big idea campaign available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see big idea recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-t-4 border-t-yellow-500/70">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold">Campaign Stunt Concept</h3>
                      </div>
                      <h2 className="text-3xl font-bold mt-3">{content.bigIdea.headline}</h2>
                      {content.bigIdea.tentPoleEvent && (
                        <p className="text-sm text-muted-foreground mt-2">Tied to: <span className="font-semibold text-foreground">{content.bigIdea.tentPoleEvent}</span></p>
                      )}
                    </div>
                    <Sparkles className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6 pt-6">
                  {content.bigIdea.concept && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">The Concept</h4>
                      <p className="text-muted-foreground leading-relaxed">{content.bigIdea.concept}</p>
                    </div>
                  )}
                  
                  {content.bigIdea.executionChannels && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Execution Channels</h4>
                      <div className="flex flex-wrap gap-2">
                        {content.bigIdea.executionChannels.map((channel: string, i: number) => (
                          <Badge key={i} variant="default">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {content.bigIdea.creativeTease && (
                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-foreground mb-2">Creative Tease</h4>
                      <p className="italic text-foreground">"{content.bigIdea.creativeTease}"</p>
                    </div>
                  )}

                  {content.bigIdea.estimatedReachAmplification && (
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                      <h4 className="font-semibold text-foreground mb-2">Expected Impact</h4>
                      <p className="text-foreground font-semibold">{content.bigIdea.estimatedReachAmplification}</p>
                      <p className="text-sm text-muted-foreground mt-1">Reach amplification through earned media and organic sharing</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charts" className="animate-in slide-in-from-bottom-2 fade-in duration-500 space-y-8">
          {!content?.mediaVendorRecommendations || content.mediaVendorRecommendations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-muted-foreground">No chart data available</p>
                <p className="text-sm text-muted-foreground mt-2">This campaign was created with an earlier version. Create a new campaign to see charts.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <AiEstimateNote />
              {/* Budget Allocation Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <CardTitle>Monthly Budget Allocation by Platform</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={content.mediaVendorRecommendations.map((vendor: any) => ({
                        name: vendor.platform,
                        budget: vendor.monthlyBudget || 0,
                        color: getColorForPlatform(vendor.platform)
                      }))}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis label={{ value: 'Budget ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                      />
                      <Bar dataKey="budget" fill="url(#colorGradient)" radius={[8, 8, 0, 0]}>
                        {content.mediaVendorRecommendations.map((vendor: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getColorForPlatform(vendor.platform)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Impressions Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <CardTitle>Estimated Monthly Impressions by Platform</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={content.mediaVendorRecommendations.map((vendor: any) => ({
                        name: vendor.platform,
                        impressions: vendor.estimatedMonthlyImpressions || 0,
                        color: getColorForPlatform(vendor.platform)
                      }))}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis label={{ value: 'Impressions', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => value.toLocaleString()}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                      />
                      <Bar dataKey="impressions" radius={[8, 8, 0, 0]}>
                        {content.mediaVendorRecommendations.map((vendor: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getColorForPlatform(vendor.platform)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <CardTitle>Budget Distribution Across Channels</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={content.mediaVendorRecommendations.map((vendor: any) => ({
                          name: vendor.platform,
                          value: vendor.monthlyBudget || 0,
                          fill: getColorForPlatform(vendor.platform)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {content.mediaVendorRecommendations.map((vendor: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getColorForPlatform(vendor.platform)} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* CPM Comparison */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <CardTitle>Cost Per Thousand Impressions (CPM)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={content.mediaVendorRecommendations.map((vendor: any) => ({
                        name: vendor.platform,
                        cpm: vendor.estimatedMonthlyImpressions ? (vendor.monthlyBudget / (vendor.estimatedMonthlyImpressions / 1000)).toFixed(2) : 0,
                        color: getColorForPlatform(vendor.platform)
                      }))}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis label={{ value: 'CPM ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => `$${value}`}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                      />
                      <Bar dataKey="cpm" radius={[8, 8, 0, 0]}>
                        {content.mediaVendorRecommendations.map((vendor: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getColorForPlatform(vendor.platform)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Color palette for each platform
function getColorForPlatform(platform: string): string {
  const colors: Record<string, string> = {
    "Google Ads": "#4285F4",
    "Meta Ads": "#1877F2",
    "TikTok Ads": "#000000",
    "LinkedIn Ads": "#0A66C2",
    "Spotify Audio Ads": "#1DB954",
    "Programmatic Display": "#FF6B35",
    "Out-of-Home (OOH)": "#8B5CF6",
    "Influencer Partnerships": "#EC4899",
    "Retail Media": "#F59E0B"
  };
  return colors[platform] || "#6366F1";
}
