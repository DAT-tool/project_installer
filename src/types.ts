export type CommandName = 'install' | 'stop' | 'log';
export type CommandArgvName = 'skip-remove-unused-images' | 'skip-clone-projects' | 'skip-build-projects' | 'remove-containers' | 'environment' | 'services' | 'follow' | 'service' | 'skip-caching-build' | 'skip-updating-server-log';

export type ConfigVariableKey = 'git_username' | 'git_password' | 'docker_registery' | 'backend_project_docker_image' | 'frontend_project_docker_image' | 'env_path' | 'dist_path' | 'domain_name' | 'ssl_enabled' | 'databases' | 'domain_name' | 'sub_domains' | 'variables' | 'ssl_path' | 'docker_compose_command' | 'project_name' | 'dockerfiles_path';
export type ConfigsObject = { [k in ConfigVariableKey]: any };

export type ConfigMode = 'dev' | 'prod';

export interface SubDomain {
    subdomain: string;
    cloneUrl: string;
    /**
     * @default master
     */
    branch?: string;
    name: string;
    volumes?: string[];
    /**
     * @default 80
     */
    port: number;
    envs?: { [k: string]: any };
    depends?: string[];
    disabled?: boolean;
    healthcheck?: AppHealthCheck;
    locations?: AppLocation[];
    /**
     * in default same as port
     */
    exposePort?: number;

    __hasEnvs?: boolean;
}

export interface AppLocation {
    url: string;
    modifier?: string;
    alias?: string;
    internal?: boolean;
}

export interface AppHealthCheck {
    test: string[];
    timeout?: number;
    retries?: number;
    _test_str?: string;
}

export interface Database {
    type: "mysql" | "mongo" | "redis";
    port: number;
    dbname?: string;
    mysql_db_names: string[];
    name: string;
    root_password?: string;
    allow_public_db?: boolean;
    /**
     * @default UTC
     */
    timezone?: string;
    /**
     * auto filled
     */
    command?: string;
    image?: string;
    realPort?: number;
    volumes?: string[];
    envs?: object;
    __has_envs?: boolean;
    healthcheck?: {
        test: string;
        timeout: number;
        retries: number;
    };
}