import NodeCache from "node-cache";

abstract class CacheAbstract {
  abstract getData<T>(key: string): T | null;
  abstract setData<T>(key: string, value: T, ttl?: number): boolean;
  abstract hasData(key: string): boolean;
  abstract deleteData(key: string): boolean;
  abstract clearCache(): void;
}

export class CacheService extends CacheAbstract {
  private readonly cache: NodeCache;

  constructor(ttlSeconds: number = 3600) {
    super();
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  getData<T>(key: string): T | null {
    return this.cache.get<T>(key) ?? null;
  }

  setData<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl as number);
  }

  hasData(key: string): boolean {
    return this.cache.has(key);
  }

  deleteData(key: string): boolean {
    return this.cache.del(key) > 0;
  }

  clearCache(): void {
    return this.cache.flushAll();
  }
}


// this.cacheService = new CacheService();
// const find_userId = this.cacheService.getData<string>(payload.otp);