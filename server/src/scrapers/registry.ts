import { championsSource } from "./champions.js";
import { gstCouncilSource } from "./gstCouncil.js";
import { pibSource } from "./pib.js";
import { rbiSource } from "./rbi.js";
import type { SourceDefinition } from "./types.js";

export const sources: SourceDefinition[] = [
  pibSource,
  gstCouncilSource,
  championsSource,
  rbiSource,
];
