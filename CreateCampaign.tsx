import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignInputSchema } from "@shared/campaign";
import { useCreateCampaign } from "@/hooks/use-campaigns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ArrowLeft, KeyRound } from "lucide-react";
import { Label } from "@/components/ui/label";
import { loadCredential } from "@/lib/credential";
import { z } from "zod";
import { Link } from "wouter";

// Infer type from schema
type FormValues = z.infer<typeof campaignInputSchema>;

const labelClass = "text-base font-semibold";
const fieldClass = "h-12 bg-background/50";

function Required() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

function parseList(text: string): string[] {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

// Keeps the raw text locally so commas and spaces can be typed freely,
// while the form value stays a string[] exactly as before.
function CommaListInput({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  placeholder,
  multiline = false,
  ...aria
}: {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  onBlur: () => void;
  name: string;
  inputRef: React.Ref<any>;
  placeholder: string;
  multiline?: boolean;
} & React.AriaAttributes & { id?: string }) {
  const [text, setText] = useState(() => (value ?? []).join(", "));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
    onChange(parseList(e.target.value));
  };

  return multiline ? (
    <Textarea
      name={name}
      ref={inputRef}
      value={text}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className="min-h-[80px] text-base resize-none bg-background/50"
      {...aria}
    />
  ) : (
    <Input
      name={name}
      ref={inputRef}
      value={text}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={fieldClass}
      {...aria}
    />
  );
}

export default function CreateCampaign() {
  const { mutate, isPending } = useCreateCampaign();
  const [credential, setCredential] = useState(() => loadCredential());
  const [credentialError, setCredentialError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(campaignInputSchema),
    defaultValues: {
      productName: "",
      description: "",
      audience: "",
      tone: "Friendly",
      budget: "",
      kpis: [],
      campaignStartDate: "",
      campaignEndDate: "",
      competitors: [],
    },
  });

  function onSubmit(data: FormValues) {
    if (
      data.campaignStartDate &&
      data.campaignEndDate &&
      data.campaignEndDate < data.campaignStartDate
    ) {
      form.setError("campaignEndDate", {
        message: "End date can't be before the start date",
      });
      return;
    }
    if (!credential.trim()) {
      setCredentialError("Enter an access code or your OpenAI API key.");
      document.getElementById("credential")?.focus();
      return;
    }
    setCredentialError("");
    mutate(data, credential.trim());
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 pl-0 hover:bg-transparent hover:text-primary transition-colors"
        >
          <Link href="/campaigns">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to My Campaigns
          </Link>
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">New Campaign</h1>
        <p className="text-muted-foreground text-lg">
          Tell us about your product, and our AI will generate a complete marketing kit.
        </p>
      </div>

      <div className="bg-card border border-border/60 shadow-xl shadow-black/5 rounded-2xl p-5 sm:p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate aria-busy={isPending}>
            <fieldset disabled={isPending} className="space-y-10 min-w-0">
              {/* Section 1: required */}
              <section aria-labelledby="basics-heading" className="space-y-6">
                <div>
                  <h2 id="basics-heading" className="text-xl font-bold font-display">
                    About your product
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fields marked <span aria-hidden="true" className="text-destructive">*</span>
                    <span className="sr-only">with “required”</span> are required.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Product Name
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. EcoBottle 3000"
                          className="h-12 text-lg bg-background/50"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Product Description
                        <Required />
                      </FormLabel>
                      <FormDescription>
                        Highlight key features, benefits, and what makes it unique.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. A self-cleaning water bottle made from recycled ocean plastic. Keeps water cold for 24 hours..."
                          className="min-h-[120px] text-base resize-y bg-background/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>
                          Target Audience
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Fitness enthusiasts, Eco-conscious millennials"
                            className={fieldClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>
                          Tone of Voice
                          <Required />
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={fieldClass}>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Professional">Professional & Trustworthy</SelectItem>
                            <SelectItem value="Friendly">Friendly & Approachable</SelectItem>
                            <SelectItem value="Witty">Witty & Humorous</SelectItem>
                            <SelectItem value="Urgent">Urgent & Sales-driven</SelectItem>
                            <SelectItem value="Luxury">Luxury & Sophisticated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Section 2: optional */}
              <section
                aria-labelledby="optional-heading"
                className="space-y-6 pt-8 border-t border-border/60"
              >
                <div>
                  <h2 id="optional-heading" className="text-xl font-bold font-display">
                    Campaign details{" "}
                    <span className="text-sm font-medium text-muted-foreground">(optional)</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add what you know to make the media plan and competitor analysis more specific.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Budget</FormLabel>
                        <FormDescription>e.g. $5,000, €10,000, or any currency</FormDescription>
                        <FormControl>
                          <Input placeholder="e.g. $50,000" className={fieldClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kpis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>KPIs</FormLabel>
                        <FormDescription>Separate with commas</FormDescription>
                        <FormControl>
                          <CommaListInput
                            name={field.name}
                            inputRef={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="e.g. Click-through rate, Conversion rate, Brand awareness"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="campaignStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Campaign Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" className={fieldClass} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaignEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Campaign End Date</FormLabel>
                        <FormControl>
                          <Input type="date" className={fieldClass} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="competitors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Competitors</FormLabel>
                      <FormDescription>
                        Separate with commas. If you add fewer than three, CampaignGen will suggest more.
                      </FormDescription>
                      <FormControl>
                        <CommaListInput
                          multiline
                          name={field.name}
                          inputRef={field.ref}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="e.g. Brand X, Brand Y, Brand Z"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Section 3: access */}
              <section
                aria-labelledby="access-heading"
                className="space-y-3 pt-8 border-t border-border/60"
              >
                <div>
                  <h2 id="access-heading" className="text-xl font-bold font-display flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" aria-hidden="true" />
                    Access
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the access code you were given, or paste your own OpenAI API key
                    (it starts with <span className="font-mono">sk-</span>). A key you paste is
                    only used for this request and is never saved on our servers.
                  </p>
                </div>
                <Label htmlFor="credential" className={labelClass}>
                  Access code or OpenAI API key
                  <Required />
                </Label>
                <Input
                  id="credential"
                  type="password"
                  autoComplete="off"
                  value={credential}
                  onChange={(e) => {
                    setCredential(e.target.value);
                    if (credentialError) setCredentialError("");
                  }}
                  aria-invalid={!!credentialError}
                  aria-describedby={credentialError ? "credential-error" : undefined}
                  className={fieldClass}
                />
                {credentialError && (
                  <p id="credential-error" role="alert" className="text-sm font-medium text-destructive">
                    {credentialError}
                  </p>
                )}
              </section>

              <div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Generating your campaign…
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" aria-hidden="true" />
                      Generate Campaign
                    </>
                  )}
                </Button>
                <p role="status" aria-live="polite" className="mt-3 text-center text-sm text-muted-foreground min-h-5">
                  {isPending
                    ? "This can take a while because the full campaign is built in one go. Please keep this page open."
                    : "Your campaign is saved in this browser when it's ready."}
                </p>
              </div>
            </fieldset>
          </form>
        </Form>
      </div>
    </div>
  );
}
