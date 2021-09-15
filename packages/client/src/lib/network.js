import { useEffect, useState } from 'react';
import config from '../config.js';

async function createErrorByRes(res) {
  const resBody = await res.text();
  return new Error(`${res.status}: ${res.statusText}: ${resBody}`);
}

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

function createErrorByResult(result) {
  let msg = '';
  result.errors.forEach((resultError) => {
    let locationsMsg = '';
    resultError.locations.forEach((location) => {
      locationsMsg += `line:${location.line} column:${location.column}`;
    });
    msg += `${locationsMsg} ${resultError.message}\n`;
  });

  return new Error(msg);
}

async function request(query, origResType, origMethod, origEndPoint, origOptions) {
  const resType = origResType || 'json';
  const method = origMethod || 'POST';
  const endPoint = origEndPoint || getApiGatewayEndPoint();
  const options = origOptions || {
    method,
    mode: 'cors',
    credentials: 'omit',
    body: query ? JSON.stringify({ query }) : null,
  };

  let data;
  let error;
  try {
    const res = await fetch(endPoint, options);

    if (!res.ok) {
      error = await createErrorByRes(res); // Non-200 response.
      return { data, error };
    }

    let result;
    switch (resType) {
      case 'text':
        result = await res.text();
        break;
      case 'json':
        result = await res.json();
        break;
      default:
        break;
    }

    if (!result) error = new Error('resType wrong or response body format wrong');
    if (result.errors) error = createErrorByResult(result); // Server return error.

    if (result.data) {
      data = result.data;
    } else {
      data = result;
    }
  } catch (err) {
    error = err; // Http protocol error.
  }

  return { data, error };
}

function useRemoteData(query, resType, method, endPoint, options) {
  const [cache, setCache] = useState();

  function refetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function getRemoteData() {
      const result = await request(query, resType, method, endPoint, options);
      if (isMounted) setCache(result);
    }

    if (!cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, query, resType, method, endPoint, options]);

  const { data, error } = cache || { data: null, error: null };
  return { data, error, refetch };
}

function useRemoteConfig() {
  const { data, error } = useRemoteData(null, 'json', 'GET', getServerConfigUrl());

  if (data) {
    setApiGatewayEndPoint(data);
    setDownloadServerUrl(data);
  }

  return { data, error };
}

export { getDownloadFileUrl, request, useRemoteConfig, useRemoteData };
