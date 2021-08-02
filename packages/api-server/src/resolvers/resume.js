import storage from '../lib/storage.js';

export default {
  resume: async () => {
    const content = await storage.getDataByKey('resume/resume.json');
    return content;
  },
};
