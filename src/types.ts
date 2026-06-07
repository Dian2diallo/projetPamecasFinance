export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "épargne" | "crédit" | "services" | "all";
  iconName: "pig" | "handshake" | "smartphone" | "trending-up" | "wallet";
  advantages: string[];
  rates?: string;
  conditions?: string;
}

export interface Transaction {
  id: string;
  type: "dépôt" | "retrait" | "virement" | "facture";
  label: string;
  date: string;
  amount: number;
  status: "reçu" | "effectué" | "en_attente";
}

export interface AmortizationItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

export interface Agency {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  gps: {
    latPercent: number; // For styling on SVG map
    lngPercent: number;
    lat?: number;
    lng?: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Article {
  id: string;
  title: string;
  date: string;
  summary: string;
  image: string;
}

export interface Message {
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
}

export interface UserAccount {
  id: string; // e.g. PAM-2026-64192
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession?: string;
  monthlyIncome?: number;
  balance: number;
  outstandingCredit: number;
}

