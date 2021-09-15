import { useEffect, useState } from 'react';
import { setApiGatewayEndPoint, getServerConfigUrl, setDownloadServerUrl } from './network.js';
import request from './client.js';

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

export { useRemoteConfig, useRemoteData };
