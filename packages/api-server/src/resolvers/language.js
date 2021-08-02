function getNameAndQualitys(localesString) {
  if (typeof localesString !== 'string') {
    return null;
  }
  const nameAndQualitys = [];
  const paramsStrings = localesString.split(',');
  for (let i = 0; i < paramsStrings.length; i += 1) {
    const nameAndQuality = paramsStrings[i].split(';');
    let quality;
    if (nameAndQuality.length === 1) {
      quality = 1;
    } else if (nameAndQuality.length === 2) {
      const fields = nameAndQuality[1].split('=');
      if (fields.length !== 2 || fields[0] !== 'q') {
        return null;
      }
      quality = Number(fields[1]);
    } else {
      return null;
    }
    nameAndQualitys.push({ [nameAndQuality[0]]: quality });
  }
  return nameAndQualitys;
}

export default {
  sortAcceptLanguage: (_, req) => {
    const nameAndQualitys = getNameAndQualitys(req.headers['accept-language']);
    if (!Array.isArray(nameAndQualitys)) {
      return null;
    }
    const sortedNameAndQualitys = nameAndQualitys.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
    return JSON.stringify(sortedNameAndQualitys);
  },
};
