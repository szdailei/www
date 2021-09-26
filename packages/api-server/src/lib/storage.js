import fs from 'fs';
import path from 'path';

const storageConfig = {
  sql: undefined,
  secretKey: undefined,
  root: null,
  coursesPath: null,
  resumeFile: null,
};

function storage() {}

storage.getSql = () => storageConfig.sql;

storage.setSql = (sql) => {
  storageConfig.sql = sql;
};

storage.setSecretKey = (secretKey) => {
  storageConfig.secretKey = secretKey;
};

storage.setCoursesPath = (coursesPath) => {
  storageConfig.coursesPath = coursesPath;
};

storage.getStorageRoot = () => storageConfig.root;

storage.setStorageRoot = (root) => {
  storageConfig.root = root;
};

storage.getResumeFile = () => storageConfig.resumeFile;

storage.setResumeFile = (resumeFile) => {
  storageConfig.resumeFile = resumeFile;
};

storage.getUsers = async () => {
  let users;
  let error;
  try {
    users = await storageConfig.sql`
      SELECT * from all_user
    `;
  } catch (err) {
    error = err;
  }
  return { users, error };
};

storage.getRoles = async () => {
  let roles;
  let error;
  try {
    roles = await storageConfig.sql`
      SELECT * from role
    `;
  } catch (err) {
    error = err;
  }
  return { roles, error };
};

storage.getUserByName = async (name) => {
  let user;
  let error;
  try {
    [user] = await storageConfig.sql`
      SELECT * from all_user WHERE name=${name}
    `;
  } catch (err) {
    error = err;
  }
  return { user, error };
};

storage.getUserRoles = async () => {
  let userRoles;
  let error;
  try {
    userRoles = await storageConfig.sql`
      SELECT * from user_role
    `;
  } catch (err) {
    error = err;
  }
  return { userRoles, error };
};

storage.getPermissions = async () => {
  let permissions;
  let error;
  try {
    permissions = await storageConfig.sql`
      SELECT * from permission
    `;
  } catch (err) {
    error = err;
  }
  return { permissions, error };
};

storage.createUser = async (name, password, salt) => {
  let isSuccess;
  let error;
  try {
    const { count } = await storageConfig.sql`
      INSERT INTO all_user (name,  password, salt) VALUES(${name}, ${password}, ${salt})
    `;
    if (count === 1) isSuccess = true;
    else isSuccess = false;
  } catch (err) {
    error = err;
  }
  return { isSuccess, error };
};

storage.deleteUserByName = async (name) => {
  let isSuccess;
  let error;
  try {
    const { count } = await storageConfig.sql`
      DELETE FROM ONLY all_user WHERE name=${name}
    `;
    if (count === 1) isSuccess = true;
    else isSuccess = false;
  } catch (err) {
    error = err;
  }
  return { isSuccess, error };
};

storage.changePassword = async (name, password, salt) => {
  let isSuccess;
  let error;
  try {
    const { count } = await storageConfig.sql`
      UPDATE ONLY all_user SET password=${password}, salt=${salt} WHERE name=${name}
    `;
    if (count === 1) isSuccess = true;
    else isSuccess = false;
  } catch (err) {
    error = err;
  }
  return { isSuccess, error };
};

storage.getSecretKey = () => storageConfig.secretKey;

storage.readCourseFile = async (name) => {
  const key = path.join(storageConfig.coursesPath, name);
  return storage.getDataByKey(key);
};

storage.getDataByKey = async (key) => {
  const filename = path.join(storageConfig.root, key);
  return fs.promises.readFile(filename, 'utf8');
};

storage.listFiles = async (dirName) => {
  const dir = path.join(storageConfig.root, dirName);
  const files = await fs.promises.readdir(dir);
  const fileNames = [];
  for (let i = 0; i < files.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const stats = await fs.promises.stat(path.join(dir, files[i]));
    if (stats.isFile()) {
      fileNames.push(files[i]);
    }
  }
  return fileNames;
};

storage.listCourseFiles = async () => {
  const files = await storage.listFiles(storageConfig.coursesPath);
  return files;
};

export default storage;
