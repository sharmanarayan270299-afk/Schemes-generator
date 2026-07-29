import { gstCouncilSource } from "./gstCouncil.js";
import { pibSource } from "./pib.js";
import type { SourceDefinition } from "./types.js";

export const sources: SourceDefinition[] = [pibSource, gstCouncilSource];
