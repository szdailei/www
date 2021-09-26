// You must call rules.init() before use

const rules = {};
rules.init = (endpoint) => {
  rules.map = new Map(
    Object.entries({
      '/': endpoint,
    })
  );
};

rules.match = (url) => rules.map.get(url);

export default rules;
