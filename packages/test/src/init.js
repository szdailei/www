import { getConfigInWorkingPath } from '../../../config';
import config from './config';

async function init() {
  config.env = (await getConfigInWorkingPath('test.toml')).env;
}

export default init;
