import storage from '../lib/storage';

export default {
  getResume: async () => {
    const key = storage.getResume();
    const content = await storage.getDataByKey(key);
    if (!content) throw new Error('null result');
    return content;
  },
  getResumeImage: async () => {
    const key = storage.getResumeImage();
    const base64data = await storage.getDataByKey(key, 'base64');
    if (!base64data) throw new Error('null result');
    return base64data;
  },
  getResumeWeChatImage: async () => {
    const key = storage.getResumeWeChatImage();
    const base64data = await storage.getDataByKey(key, 'base64');
    if (!base64data) throw new Error('null result');
    return base64data;
  },
};
