import path from 'path';

import { addAlias } from 'module-alias';

import { srcDir } from '../shared.config';

addAlias('@', path.join(__dirname, '..', srcDir));
