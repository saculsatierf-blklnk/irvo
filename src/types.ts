import { LucideIcon } from 'lucide-react';

export type UserRole = 'client_pf' | 'client_pj' | 'provider_pf' | 'provider_pj';

export type AppState = 'splash' | 'auth' | 'cockpit';

export type OperationMode = 'home' | 'site' | 'online';

export type ServiceTier = 'standard' | 'plus' | 'prime';

export interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  modes: OperationMode[];
  certifications: string[];
  checklist: string[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  services: ServiceItem[];
}

export interface ActiveMission {
  id: string;
  serviceName: string;
  categoryLabel: string;
  mode: OperationMode;
  tier: ServiceTier;
  price: number;
  region: string;
  operativeName: string;
  operativeBadge: string;
  operativeRating: number;
  operativeCerts: string[];
  etaMinutes: number;
  status: 'dispatching' | 'en_route' | 'on_site' | 'executing' | 'completed';
  createdAt: string;
}
