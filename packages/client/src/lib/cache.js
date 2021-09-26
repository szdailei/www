import { useEffect, useState } from 'react';
import { setApiGatewayEndPoint, getServerConfigUrl, setDownloadServerUrl } from './network';
import request from './client';

function useRemoteData(query, resType, endPoint, method) {
  const [cache, setCache] = useState();

  function refetch() {
    setCache(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function getRemoteData() {
      const result = await request(query, resType, endPoint, method);
      if (isMounted) setCache(result);
    }

    if (!cache) getRemoteData();

    return () => {
      isMounted = false;
    };
  }, [cache, query, resType, endPoint, method]);

  const { data, error } = cache || { data: null, error: null };
  return { data, error, refetch };
}

function useRemoteConfig() {
  const { data, error } = useRemoteData(null, 'json', getServerConfigUrl(), 'GET');

  if (data) {
    setApiGatewayEndPoint(data);
    setDownloadServerUrl(data);
  }

  return { data, error };
}

export { useRemoteConfig, useRemoteData };
