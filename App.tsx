import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CreateCampaign from "@/pages/CreateCampaign";
import CampaignDetails from "@/pages/CampaignDetails";

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/campaigns" component={Dashboard} />
        <Route path="/create" component={CreateCampaign} />
        <Route path="/campaigns/:id" component={CampaignDetails} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={AppRoutes} />
      </Switch>
    </>
  );
}
