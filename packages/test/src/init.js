import { getConfigInWorkDir } from '../../../config';
import config from './config';

async function init() {
  const configData = await getConfigInWorkDir('test.toml')
  config.env = configData.env;
}

export default init;
