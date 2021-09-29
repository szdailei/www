import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import { transformSync } from '@babel/core';
import { exec } from 'pkg';

async function trans(origFile, targetFile) {
  const options = {
    compact: true,
    plugins: ['@babel/plugin-transform-modules-commonjs', 'babel-plugin-transform-import-meta'],
  };

  const source = await fs.promises.readFile(origFile, 'utf8');
  const { code } = transformSync(source, options);
  await fs.promises.writeFile(targetFile, code);
}

async function bundleServer(config, mjs, cjs, exe, dist) {
  await trans(mjs, cjs);
  await exec([cjs, '--target', 'linux-x64,win-x64', '--output', exe]);
  shell.cp(config, dist);
}

async function bundleServers(root, dist) {
  const scriptPathOfStaticServer = path.join(root, 'packages/static-server/dist');
  const mjsOfStaticServer = path.join(scriptPathOfStaticServer, 'index.js');
  const cjsOfStaticServer = path.join(scriptPathOfStaticServer, 'index.cjs');
  const configOfStaticServer = path.join(scriptPathOfStaticServer, 'static-server.toml');

  const scriptPathOfGateway = path.join(root, 'packages/gateway/dist/');
  const mjsOfGateway = path.join(scriptPathOfGateway, 'index.js');
  const cjsOfGateway = path.join(scriptPathOfGateway, 'index.cjs');
  const configOfGateway = path.join(scriptPathOfGateway, 'gateway.toml');

  const scriptPathOfApiServer = path.join(root, 'packages/api-server/dist');
  const mjsOfApiServer = path.join(scriptPathOfApiServer, 'index.js');
  const cjsOfApiServer = path.join(scriptPathOfApiServer, 'index.cjs');
  const configOfApiServer = path.join(scriptPathOfApiServer, 'api-server.toml');

  const distOfStaticServer = path.join(dist, 'static-server/');
  const exeOfStaticServer = path.join(distOfStaticServer, 'static-server');

  const distOfGateway = path.join(dist, 'gateway/');
  const exeOfGateway = path.join(distOfGateway, 'gateway');

  const distOfApiServer = path.join(dist, 'api-server/');
  const exeOfApiServer = path.join(distOfApiServer, 'api-server');

  shell.mkdir(distOfStaticServer, distOfGateway, distOfApiServer);

  await bundleServer(configOfStaticServer, mjsOfStaticServer, cjsOfStaticServer, exeOfStaticServer, distOfStaticServer);
  await bundleServer(configOfGateway, mjsOfGateway, cjsOfGateway, exeOfGateway, distOfGateway);
  await bundleServer(configOfApiServer, mjsOfApiServer, cjsOfApiServer, exeOfApiServer, distOfApiServer);
}

export default bundleServers;
