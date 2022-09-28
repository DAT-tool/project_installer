import { ConfigMode, ConfigsObject, ConfigVariableKey, SubDomain } from "./types";
import * as ENV from '@dat/lib/env';
import * as LOG from '@dat/lib/log';
import * as fs from 'fs';
import * as path from 'path';
import * as OS from '@dat/lib/os';
import * as TEM from '@dat/lib/template';

export async function loadAllConfig(mode: ConfigMode = 'prod'): Promise<ConfigsObject> {
    let configs = await ENV.loadAll() as ConfigsObject;
    // =>read .env.json file
    let envPath = path.join(await OS.cwd(), '.env.' + mode + '.json');
    try {
        let envFile = JSON.parse(fs.readFileSync(envPath).toString()) as ConfigsObject;
        // =>merge env contents to configs
        for (const key of Object.keys(envFile)) {
            configs[key] = envFile[key];
        }
    } catch (e) {
        LOG.errorStatus(`fix '.env.${mode}.json' file`);
        console.error(e);
        process.exit(1);
    }

    let ConfigVariables: { name: ConfigVariableKey; default?: any }[] = [
        // {
        //     name: 'backend_project_docker_image',
        //     default: `${projectEnv.project_name}_backend:production`,
        // },
        // {
        //     name: 'frontend_project_docker_image',
        //     default: `${projectEnv.project_name}_frontend:production`,
        // },


        {
            name: 'docker_registery',
            default: 'dockerhub.ir',//'docker.io',
        },
    ];
    // =>set default configs, if not set
    for (const conf of ConfigVariables) {
        if (!await ENV.has(conf.name) && conf.default !== undefined) {
            await ENV.save(conf.name, conf.default);
            configs[conf.name] = conf.default;
        }
    }

    configs.dist_path = path.join(await OS.cwd(), '.dist');
    configs.env_path = path.join(await OS.cwd(), 'env');
    configs.ssl_path = path.join(await OS.cwd(), 'env', 'ssl');
    fs.mkdirSync(configs.ssl_path, { recursive: true });
    configs.dockerfiles_path = path.join(configs.dist_path, 'dockerfiles');
    fs.mkdirSync(configs.dockerfiles_path, { recursive: true });
    configs.docker_compose_command = `sudo docker-compose -f ${path.join(configs.dist_path, 'docker-compose.yml')} --project-name ${configs.project_name}`;
    // =>replace variables

    configs = await advancedLoadConfigs(configs, envPath) as any;
    // console.log('configs:', configs)
    return configs;
}

async function advancedLoadConfigs(configs: object, envPath: string) {
    let newConfigs = await TEM.renderString(fs.readFileSync(envPath).toString(), { data: configs });

    let newConfigsJson = JSON.parse(newConfigs.data);
    for (const key of Object.keys(newConfigsJson)) {
        configs[key] = newConfigsJson[key];
    }

    return configs;
}

export function loadSubDomains(configs: ConfigsObject): SubDomain[] {
    return configs.sub_domains ?? [] as SubDomain[];
}


export async function stopContainers(names?: string[], isRemove = false, configs?: ConfigsObject) {
    // =>load all configs
    if (!configs) {
        configs = await loadAllConfig();
    }
    if (names) {
        //TODO:
    } else {
        LOG.info('Stopping Services...');
        // =>if remove container
        if (isRemove && await OS.shell(`${configs.docker_compose_command} down --remove-orphans`, configs.dist_path) !== 0) {
            return false;
        }
        // =>if just stop
        else {
            if (!isRemove && await OS.shell(`${configs.docker_compose_command} stop `, configs.dist_path) !== 0) return false;
        }

        return true;
    }
}