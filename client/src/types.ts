export type SchemeCategory =
  | "Gov. Subsidies"
  | "Taxation"
  | "Production Incentives"
  | "Customs Schemes"
  | "Gov. Investment Schemes"
  | "Central & State Gov. Schemes"
  | "GST"
  | "MSME Schemes";

export type SchemeLevel = "Central" | "State" | "Central & State";

export type SchemeStatus = "Active" | "Upcoming" | "Closed";

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  level: SchemeLevel;
  state?: string;
  department: string;
  benefitType: string;
  description: string;
  eligibility: string;
  status: SchemeStatus;
  deadline: string;
  launchYear: number;
  website: string;
  tags: string[];
}

export interface CategoryCount {
  category: SchemeCategory;
  count: number;
}

export interface Stats {
  total: number;
  active: number;
  upcoming: number;
  closed: number;
  categories: number;
}
