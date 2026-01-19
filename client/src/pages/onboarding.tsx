import { TenantOnboardingWizard } from "@/components/tenant-onboarding-wizard";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleComplete = (tenantId: string) => {
    setLocation(`/onboarding/success?tenant=${tenantId}`);
  };

  return <TenantOnboardingWizard onComplete={handleComplete} />;
}
