import { cbicGstSource } from "./cbicGst.js";
import { championsSource } from "./champions.js";
import { dorSource } from "./dor.js";
import { gstCouncilSource } from "./gstCouncil.js";
import { heavyIndustriesSource } from "./heavyIndustries.js";
import { midcSource } from "./midc.js";
import { mnreSource } from "./mnre.js";
import { nicdcSource } from "./nicdc.js";
import { pibSource } from "./pib.js";
import { rbiSource } from "./rbi.js";
import { riicoSource } from "./riico.js";
import { sidbiSource } from "./sidbi.js";
import { steelSource } from "./steel.js";
import type { SourceDefinition } from "./types.js";
import { upeidaSource } from "./upeida.js";

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
  sidbiSource,
  riicoSource,
  upeidaSource,
  nicdcSource,
  midcSource,
];
