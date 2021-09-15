import config from '../config.js';

function getServerConfigUrl() {
  const serverConfigUrl = `${window.location.protocol}//${window.location.host}/${config.SERVER_CONFIG_FILE}`;
  return serverConfigUrl;
}

function getApiGatewayEndPoint() {
  return config.apiGatewayEndPoint;
}

function setApiGatewayEndPoint(json) {
  let hostname = json.apiGatewayHostName;
  if (!hostname || json.isApiGatewayOnStaticServer) {
    hostname = window.location.hostname;
  }
  config.apiGatewayEndPoint = `${json.apiGatewayProtocol}//${hostname}:${json.apiGatewayPort}`;
}

function getDownloadServerUrl() {
  return config.downloadServerUrl;
}

function getDownloadFileUrl(file) {
  const url = `${getDownloadServerUrl()}/${file}`;
  return url;
}

function setDownloadServerUrl(json) {
  let hostname = json.downloadServerHostName;
  if (!hostname || json.isDownloadServerOnStaticServer) {
    hostname = window.location.hostname;
  }
  config.downloadServerUrl = `${json.downloadProtocol}//${hostname}:${json.downloadServerPort}`;
}

export { getApiGatewayEndPoint, setApiGatewayEndPoint, getDownloadFileUrl, setDownloadServerUrl, getServerConfigUrl };
