import Crypto from 'crypto';

export function createHash(value: any): string {
    return Crypto.createHash('md5').update(value.toString()).digest('hex');
}
