function getWebToken() {
  return window.webToken;
}

function storageWebToken(token) {
  window.webToken = token;
}

export { getWebToken, storageWebToken };
