import storage from '../lib/storage.js';

export default {
  getCourses: async () => {
    const courses = await storage.listCourseFiles();
    return courses;
  },
  getCourse: async ({ name }) => {
    const courseContent = await storage.readCourseFile(`${name}`);
    return courseContent;
  },
};
