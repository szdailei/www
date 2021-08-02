import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import config from '../config.js';

async function fetchData(url, type) {
  const options = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Cache-control': 'no-cache',
    },
  };
  let res;
  try {
    res = await fetch(url, options);
  } catch (error) {
    return { error };
  }

  let data;
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
  }
  return { data };
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

async function request(queryOrMutation) {
  const endpoint = getApiGatewayEndPoint();
  const client = new GraphQLClient(endpoint, {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Cache-control': 'no-cache',
    },
  });

  let data;
  let error;
  try {
    data = await client.request(queryOrMutation);
  } catch (err) {
    error = err;
  }
  return { data, error };
}

function useRemoteConfig() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let isMounted = true;
    async function getRemoteConfig() {
      const result = await fetchData(getServerConfigUrl(), 'text');
      if (!isMounted) return;
      if (result.data) {
        const json = JSON.parse(result.data);
        setApiGatewayEndPoint(json);
        setDownloadServerUrl(json);
        setReady(true);
      }
      if (result.error) {
        setError(result.error);
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
  const [data, setData] = useState();
  const [error, setError] = useState();

  function reFetch() {
    setData(null);
  }

  useEffect(() => {
    let isMounted = true;
    async function getRemoteData() {
      const result = await request(query);
      if (!isMounted) return;
      if (result.data) {
        setData(result.data);
      }
      if (result.error) {
        setError(result.error);
      }
    }
    if (query && !data) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [data, error, query]);

  return { data, error, reFetch };
}

export { fetchData, getDownloadFileUrl, request, useRemoteConfig, useRemoteData };
