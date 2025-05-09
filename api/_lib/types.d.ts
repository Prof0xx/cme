declare module 'postgres' {
  interface PostgresOptions {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean | object | string;
    max?: number;
    idle_timeout?: number;
    connect_timeout?: number;
    prepare?: boolean;
    types?: object;
    debug?: boolean;
    transform?: object;
    connection?: {
      application_name?: string;
    };
  }

  interface PostgresFunction {
    (connectionString: string, options?: PostgresOptions): any;
    (options: PostgresOptions): any;
    (strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
  }

  const postgres: PostgresFunction;
  export default postgres;
} 