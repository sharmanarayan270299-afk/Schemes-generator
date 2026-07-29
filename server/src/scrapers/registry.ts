import { cbicGstSource } from "./cbicGst.js";
import { championsSource } from "./champions.js";
import { dorSource } from "./dor.js";
import { gstCouncilSource } from "./gstCouncil.js";
import { heavyIndustriesSource } from "./heavyIndustries.js";
import { mnreSource } from "./mnre.js";
import { pibSource } from "./pib.js";
import { rbiSource } from "./rbi.js";
import { steelSource } from "./steel.js";
import type { SourceDefinition } from "./types.js";

export const sources: SourceDefinition[] = [
  pibSource,
  gstCouncilSource,
  championsSource,
  rbiSource,
  heavyIndustriesSource,
  steelSource,
  mnreSource,
  cbicGstSource,
  dorSource,
];
