import storage from '../lib/storage';

export default {
  getCourses: async () => {
    const courses = await storage.listCourseFiles();
    return courses;
  },
  getCourse: async ({ name }) => {
    const content = await storage.readCourseFile(`${name}`);
    if (!content) throw new Error('null result');
    return content;
  },
};
