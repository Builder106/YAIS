import 'dotenv/config';
import { getDb } from './index.js';

const { raw } = await getDb();
const result = await raw.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log('[migrate] tables:', result.rows.map(r => r.name).join(', '));
console.log('[migrate] done.');
raw.close();
