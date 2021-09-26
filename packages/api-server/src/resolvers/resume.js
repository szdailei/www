import storage from '../lib/storage';

export default {
  resume: async () => {
    const key = storage.getResumeFile();
    const content = await storage.getDataByKey(key);
    if (!content) throw new Error('null result');
    return content;
  },
};
