import fs from 'fs';
import path from 'path';
import config from '../config.js';

function getData(filename) {
  return fs.promises.readFile(filename, 'utf8');
}

function setData(filename, json) {
  return fs.promises.writeFile(filename, JSON.stringify(json), 'utf8');
}
function getStorageDir() {
  return process.env.STORAGE_DIR;
}

function getCoursesPath() {
  return config.COURSES_PATH;
}

function storage() {}

storage.getUsers = async () => {
  let users;
  let error;
  try {
    users = await config.sql`
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
    roles = await config.sql`
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
    [user] = await config.sql`
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
    userRoles = await config.sql`
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
    permissions = await config.sql`
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
    const { count } = await config.sql`
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
    const { count } = await config.sql`
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
    const { count } = await config.sql`
      UPDATE ONLY all_user SET password=${password}, salt=${salt} WHERE name=${name}
    `;
    if (count === 1) isSuccess = true;
    else isSuccess = false;
  } catch (err) {
    error = err;
  }
  return { isSuccess, error };
};

storage.getSecretKey = () => config.secretKey;

storage.readCourseFile = async (name) => storage.getDataByKey(`${getCoursesPath()}${name}`);

storage.getDownloadRootDir = () => process.env.DOWNLOAD_ROOT_DIR;

storage.getDataByKey = (key) => getData(path.join(getStorageDir(), `${key}`));

storage.setDataByKey = (key, json) => setData(path.join(getStorageDir(), `${key}`), json);

storage.listFiles = async (dirName) => {
  const dir = path.join(getStorageDir(), dirName);
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
  const files = await storage.listFiles(getCoursesPath());
  return files;
};

storage.uploadToTempDownloadServer = async (filename, buffer) => {
  const tempFilename = `${process.env.TEMP_DOWNLOAD_DIR}${filename}`;
  await fs.promises.writeFile(path.join(storage.getDownloadRootDir(), tempFilename), buffer);
  return tempFilename;
};

export default storage;
