import { getApiGatewayEndPoint } from './network.js';

async function createErrorByRes(res) {
  const resBody = await res.text();
  return new Error(`${res.status}: ${res.statusText}: ${resBody}`);
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

async function request(query, origResType, origEndPoint, origMethod) {
  const resType = origResType || 'json';
  const endPoint = origEndPoint || getApiGatewayEndPoint();
  const options = {
    method: origMethod || 'POST',
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

export default request;
