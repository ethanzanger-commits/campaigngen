import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Hash,
  Share2,
  Mail,
  BarChart3,
  Swords,
  Lightbulb,
  PenLine,
  Wand2,
  Copy,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";

const features = [
  {
    icon: Hash,
    title: "Slogans & selling points",
    desc: "Headline options and key benefits written in the tone you choose, ready to copy.",
  },
  {
    icon: Share2,
    title: "Social media posts",
    desc: "Platform-specific posts with hashtags, tailored to your target audience.",
  },
  {
    icon: Mail,
    title: "Email draft",
    desc: "A subject line and full email body you can paste into your email tool and edit.",
  },
  {
    icon: BarChart3,
    title: "Media plan & budget",
    desc: "Suggested channels and ad formats, a budget split, and charts to compare them.",
  },
  {
    icon: Swords,
    title: "Competitor analysis",
    desc: "Add your competitors, or let CampaignGen suggest some, to spot positioning gaps.",
  },
  {
    icon: Lightbulb,
    title: "Creative concepts & big idea",
    desc: "Creative mock concepts and a campaign stunt idea to build the rest around.",
  },
];

const steps = [
  {
    icon: PenLine,
    title: "Describe your product",
    desc: "Add its name, what makes it unique, who it's for, and the tone of voice. Budget, KPIs, dates and competitors are optional.",
  },
  {
    icon: Wand2,
    title: "Generate your campaign",
    desc: "CampaignGen drafts your whole campaign from those inputs and saves it in your browser.",
  },
  {
    icon: Copy,
    title: "Review, copy and refine",
    desc: "Browse each section in tabs, copy what you like, and edit it to fit your brand.",
  },
];

export default function Landing() {
  const reduceMotion = useReducedMotion();

  // Scroll-reveal props; disabled when the user prefers reduced motion.
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5 },
      };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-clip relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
      />

      {/* Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tight">
            CampaignGen
          </span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex font-medium">
            <a href="#features">Features</a>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex font-medium">
            <a href="#how-it-works">How it works</a>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
<Link href="/campaigns">My Campaigns</Link>
</Button>
        </nav>
      </header>

      <main id="main" className="flex-1 relative z-10">
        {/* Hero */}
        <section
          aria-labelledby="hero-heading"
          className="px-4 sm:px-6 pt-10 sm:pt-16 pb-16 text-center"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium border border-primary/15">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>AI marketing campaign generator</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.08]"
            >
              Turn a product description into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-700">
                full campaign.
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell CampaignGen about your product, audience and brand voice. Get
              slogans, social posts, an email draft, a media plan and more, in
              one place.
            </p>

            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
                <Button asChild size="lg"
                  className="h-14 text-lg px-10 rounded-full font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                >
<Link href="/create">
                    Start Generating
                    <ArrowRight className="ml-1 w-5 h-5" aria-hidden="true" />
                  </Link>
</Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-14 text-base px-6 rounded-full font-medium"
                >
                  <a href="#preview">See what you get</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Fill in one short form. Use an access code or your own OpenAI key, and your campaign is saved in this browser.
              </p>
            </div>
          </motion.div>

          {/* Output preview */}
          <motion.figure
            id="preview"
            aria-labelledby="preview-caption"
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-16 sm:mt-20 text-left scroll-mt-8"
          >
            <div className="rounded-2xl border border-border/70 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-muted/50">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-border" />
                  <span className="w-3 h-3 rounded-full bg-border" />
                  <span className="w-3 h-3 rounded-full bg-border" />
                </div>
                <span className="text-sm font-medium text-muted-foreground truncate">
                  EcoBottle 3000 · Friendly tone · Eco-conscious millennials
                </span>
              </div>

              {/* Tab strip (static illustration of the campaign page) */}
              <div
                aria-hidden="true"
                className="flex gap-1 px-4 pt-3 overflow-x-auto text-sm border-b border-border/60"
              >
                {["Overview", "Social Media", "Email Marketing", "Media Vendors", "Budget Plan", "Big Idea"].map(
                  (tab, i) => (
                    <span
                      key={tab}
                      className={
                        i === 0
                          ? "px-3 py-2 font-semibold text-primary border-b-2 border-primary whitespace-nowrap"
                          : "px-3 py-2 text-muted-foreground whitespace-nowrap"
                      }
                    >
                      {tab}
                    </span>
                  ),
                )}
              </div>

              <div className="grid md:grid-cols-5 gap-6 p-5 sm:p-6">
                {/* Slogans */}
                <div className="md:col-span-3 space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" aria-hidden="true" />
                    Slogans & headlines
                  </h2>
                  {[
                    "Sip clean. Stay cold. Skip the plastic.",
                    "The bottle that cleans up after itself.",
                    "Hydration with a smaller footprint.",
                  ].map((s) => (
                    <p
                      key={s}
                      className="rounded-xl border border-border/60 bg-background px-4 py-3 font-medium leading-snug"
                    >
                      “{s}”
                    </p>
                  ))}
                </div>

                {/* Social + email */}
                <div className="md:col-span-2 space-y-4">
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                        Twitter
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Meet the bottle made from recycled ocean plastic that keeps
                      water cold for 24 hours. Your refill habit just got an
                      upgrade.
                    </p>
                    <p className="mt-2 text-sm font-medium text-primary">
                      #EcoBottle #RefillRevolution
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 border-t-4 border-t-primary bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Email subject line
                    </p>
                    <p className="font-semibold leading-snug">
                      Your water bottle called. It wants a glow-up.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <figcaption
              id="preview-caption"
              className="mt-4 text-center text-sm text-muted-foreground"
            >
              Illustrative example for a made-up product. Your results are generated from your own inputs.
            </figcaption>
          </motion.figure>
        </section>

        {/* Features */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="px-4 sm:px-6 py-16 sm:py-20 scroll-mt-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-12">
              <h2
                id="features-heading"
                className="text-3xl md:text-4xl font-display font-bold"
              >
                One form, a complete campaign kit
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every campaign includes copy you can use right away and
                planning material to help you decide what to do next.
              </p>
            </motion.div>

            <motion.ul
              {...reveal}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0"
            >
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="bg-card border border-border/60 p-7 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <feature.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </li>
              ))}
            </motion.ul>

            <p className="mt-8 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              Metrics, budgets and competitor details are AI-generated
              estimates. Review them before you rely on them.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="px-4 sm:px-6 py-16 sm:py-20 bg-muted/40 border-y border-border/50 scroll-mt-4"
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2
              {...reveal}
              id="how-heading"
              className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
            >
              How it works
            </motion.h2>
            <motion.ol
              {...reveal}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0"
            >
              {steps.map((step, i) => (
                <li key={step.title} className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-display font-bold flex items-center justify-center"
                    >
                      {i + 1}
                    </span>
                    <step.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-heading" className="px-4 sm:px-6 py-20">
          <motion.div
            {...reveal}
            className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-primary to-purple-700 text-primary-foreground px-6 py-14 shadow-2xl shadow-primary/25"
          >
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl font-display font-bold !text-primary-foreground"
            >
              Ready to draft your first campaign?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-xl mx-auto">
              Describe your product and get a first draft from one short form.
            </p>
            <Button asChild size="lg"
              variant="secondary"
              className="mt-8 h-14 text-lg px-10 rounded-full font-semibold !bg-white !text-primary hover:!bg-white/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
<Link href="/create">
                Start Generating
                <ArrowRight className="ml-1 w-5 h-5" aria-hidden="true" />
              </Link>
</Button>
          </motion.div>
        </section>
      </main>

      <footer className="px-4 sm:px-6 py-8 border-t border-border/50 text-center text-sm text-muted-foreground relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="font-display font-semibold text-foreground">CampaignGen</span>
        </div>
      </footer>
    </div>
  );
}
