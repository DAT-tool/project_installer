import * as LOG from "@dat/lib/log";
import * as ARG from "@dat/lib/argvs";
import * as IN from "@dat/lib/input";
import * as ENV from "@dat/lib/env";
import * as GIT from "@dat/lib/git";
import * as DOCKER from "@dat/lib/docker";
import * as OS from "@dat/lib/os";
import * as TEM from "@dat/lib/template";
import * as SET from "@dat/lib/settings";
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { InstallCommand } from "./src/commands/install";
import { loadAllConfig } from "./src/common";

/************************************* */
const VERSION = '0.40';

/************************************* */
export async function main(): Promise<number> {
   LOG.clear();
   let configs = await loadAllConfig();
   LOG.success(`*** ${configs.project_name} Installer - version ${VERSION} ***`);
   await SET.showStatistics();

   await ARG.cli();
   InstallCommand


   return 0;
}
/************************************* */
/************************************* */
