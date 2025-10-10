import bcrypt from 'bcryptjs';

const HASH_SALT = 10;

const hash = (data: string) => bcrypt.hash(data, HASH_SALT);
const compare = (data: string, hash: string) => bcrypt.compare(data, hash);

export { hash, compare };
