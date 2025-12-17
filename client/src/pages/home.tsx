import { useTenant } from "@/context/TenantContext";
import HomeDemo from "./home-demo";
import HomeNPP from "./home-npp";

export default function Home() {
  const tenant = useTenant();
  
  if (tenant.id === "npp") {
    return <HomeNPP />;
  }
  
  return <HomeDemo />;
}
