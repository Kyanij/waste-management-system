import type { Route } from "./+types/ecologin";
import { EcoLogin } from "../components/EcoLogin/EcoLogin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoCampus Admin - Waste Management System" },
    { name: "description", content: "EcoCampus admin login for waste management and recycling system" },
  ];
}

export default function EcoLoginPage() {
  return <EcoLogin />;
}