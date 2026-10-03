import { createDemoClient } from './local-backend.mjs';
import { coupleSeedRows } from './couple-fixtures.mjs';
export const createClient = () => createDemoClient('couple-sync', coupleSeedRows());
