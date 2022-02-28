import { getEnv } from './utils';

export default class config {
    static get DATABASE_URL(): string {
        return getEnv.String("DATABASE_URL");
    }

    static get API_PORT(): number {
        return getEnv.Number("API_PORT");
    }

    static get DEBUG(): boolean {
        return getEnv.Boolean("DEBUG",false);
    }

    static get AUTHTYPE(): string {
        return getEnv.String("AUTHTYPE");
    }

    static get AUTHDAYS(): number {
        return getEnv.Number("AUTHDAYS");
    }

    static get PAGELIMIT(): number {
        return getEnv.Number("PAGELIMIT");
    }
}
