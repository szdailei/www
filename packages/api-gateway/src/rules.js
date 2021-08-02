// You must call rules.init() before use

const rules = {};
rules.init = () => {
  rules.map = new Map(
    Object.entries({
      '/': process.env.RULE_OF_END_POINT_API,
    })
  );
};

rules.match = (url) => rules.map.get(url);

export default rules;
