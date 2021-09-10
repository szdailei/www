import { useEffect, useState } from 'react';
import config from '../config.js';

async function getErrorByRes(res) {
  const resBody = await res.text();
  return new Error(`${res.status}: ${res.statusText}: ${resBody}`);
}

async function fetchData(endPoint, type) {
  const options = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
  };
  let res;
  let data;
  let error;
  try {
    res = await fetch(endPoint, options);
    if (res.ok) {
      switch (type) {
        case 'text':
          data = await res.text();
          break;
        case 'json':
          data = await res.json();
          break;
        default:
          break;
      }
    } else {
      error = await getErrorByRes(res);
    }
  } catch (err) {
    error = err;
  }

  return { data, error };
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

async function request(query, origEndPoint, origOptions) {
  const endPoint = origEndPoint || getApiGatewayEndPoint();
  const options = origOptions || {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify({ query }),
  };

  let res;
  let data;
  let error;
  try {
    res = await fetch(endPoint, options);
    if (res.ok) {
      const result = await res.json();
      if (!result) {
        error = new Error("The response body isn't json"); // body format error.
      } else if (result.errors) {
        error = new Error(result.errors[0].message); // wrong query.
      } else {
        data = result.data;
      }
    } else {
      error = await getErrorByRes(res); // non-200 response.
    }
  } catch (err) {
    error = err; // http error.
  }

  return { data, error };
}

function useRemoteConfig() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let isMounted = true;
    async function getRemoteConfig() {
      const endPoint = getServerConfigUrl();
      const result = await fetchData(endPoint, 'json');
      if (!isMounted) return;
      if (result.error) {
        setError(result.error);
      } else {
        setApiGatewayEndPoint(result.data);
        setDownloadServerUrl(result.data);
        setReady(true);
      }
    }

    if (!ready) getRemoteConfig();

    return () => {
      isMounted = false;
    };
  }, [ready, error]);

  return { ready, error };
}

function useRemoteData(query) {
  const [cache, setCache] = useState();

  function reFetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;
    async function getRemoteData() {
      if (!isMounted) return;
      setCache(await request(query));
    }
    if (query && !cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, query]);

  let data;
  let error;
  if (cache) {
    data = cache.data;
    error = cache.error;
  }

  return { data, error, reFetch };
}

export { getDownloadFileUrl, request, useRemoteConfig, useRemoteData };
