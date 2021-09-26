import log from '../lib/log';

export default {
  log: (args, req) => {
    // eslint-disable-next-line no-underscore-dangle
    const clientLogMsg = `CLIENT_LOG ${new Date().toUTCString()} ${req.socket._peername.address} ${args.data}`;
    log.warn(clientLogMsg);
    return true;
  },
};
