import type { SchemeCategory } from "../types.js";

const KEYWORD_RULES: [SchemeCategory, RegExp][] = [
  ["GST", /\bgst\b|goods and services tax/i],
  ["MSME Schemes", /\bmsme\b|udyam|micro,? small|champions portal/i],
  [
    "Customs Schemes",
    /\bcustoms?\b|\bcbic\b|\bdgft\b|export promotion|duty drawback|epcg|rodtep|moowr|foreign trade policy|advance authorisation/i,
  ],
  ["Production Incentives", /\bpli\b|production[- ]linked incentive/i],
  [
    "Gov. Investment Schemes",
    /sovereign gold bond|\bnps\b|\bppf\b|investment scheme|atal pension|sukanya samriddhi|kisan vikas patra|senior citizens savings|fund of funds|invest india|fdi\b|foreign investment/i,
  ],
  ["Taxation", /income tax|\bcbdt\b|direct tax|\bitr\b|tax rebate|tax regime/i],
  ["Gov. Subsidies", /subsid(y|ies)/i],
  ["Central & State Gov. Schemes", /\byojana\b|scheme launch|cabinet approv/i],
];

export function categorize(title: string): SchemeCategory | "General" {
  for (const [category, pattern] of KEYWORD_RULES) {
    if (pattern.test(title)) return category;
  }
  return "General";
}
