import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import storage from '../lib/storage.js';

function getHashPassword(password, salt) {
  const saltPassword = `${password}${salt}`;
  const hash = crypto.createHash('sha256');
  const hashPassword = hash.update(saltPassword).digest('hex');
  return hashPassword;
}

function getRoleIdByUserId(userRoles, userId) {
  if (!userRoles) {
    return null;
  }
  for (let i = 0; i < userRoles.length; i += 1) {
    if (userRoles[i].id === userId) {
      return userRoles[i].role_id;
    }
  }
  return null;
}

function getRoleAttrById(roles, id) {
  if (!roles) {
    return null;
  }
  for (let i = 0; i < roles.length; i += 1) {
    if (roles[i].id === id) {
      const attr = {
        name: roles[i].name,
        permissionIds: roles[i].permission_ids,
      };
      return attr;
    }
  }
  return null;
}

function getPermissionById(permissions, id) {
  if (!permissions) {
    return null;
  }
  for (let i = 0; i < permissions.length; i += 1) {
    if (permissions[i].id === id) {
      return permissions[i].function_name;
    }
  }
  return null;
}

export default {
  getUsers: async () => {
    const results = [];
    const { users, error } = await storage.getUsers();
    if (error) throw new Error(error);

    const { userRoles } = await storage.getUserRoles();
    const { roles } = await storage.getRoles();
    const { permissions } = await storage.getPermissions();

    users.forEach((user) => {
      const roleId = getRoleIdByUserId(userRoles, user.id);
      let roleAttr = {
        name: '',
        permissionIds: [],
      };
      let functionNames = '';
      if (roleId) {
        roleAttr = getRoleAttrById(roles, roleId);
        roleAttr.permissionIds.forEach((id) => {
          const functionName = getPermissionById(permissions, id);
          functionNames += `${functionName},`;
        });
      }
      const userInfo = {
        id: user.id,
        name: user.name,
        role: roleAttr.name,
        permission: functionNames,
      };
      results.push(JSON.stringify(userInfo));
    });
    return results;
  },
  getRoles: async () => {
    const results = [];
    const { roles, error } = await storage.getRoles();
    if (error) throw new Error(error);

    roles.forEach((role) => {
      results.push(JSON.stringify(role));
    });
    return results;
  },
  getUserRoles: async () => {
    const results = [];
    const { userRoles, error } = await storage.getUserRoles();
    if (error) throw new Error(error);

    userRoles.forEach((role) => {
      results.push(JSON.stringify(role));
    });
    return results;
  },
  getPermissions: async () => {
    const results = [];
    const { permissions, error } = await storage.getPermissions();
    if (error) throw new Error(error);

    permissions.forEach((permission) => {
      results.push(JSON.stringify(permission));
    });
    return results;
  },
  createUser: async ({ name, password }) => {
    const { user, error } = await storage.getUserByName(name);
    if (error) throw new Error(error);
    if (user) throw new Error(`${name} aleady exist`);

    const salt = crypto.randomBytes(16).toString('hex');
    const hashPassword = getHashPassword(password, salt);
    const res = await storage.createUser(name, hashPassword, salt);
    if (res.error) throw new Error(res.error);
    return res.isSuccess;
  },
  changePassword: async ({ name, password }) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashPassword = getHashPassword(password, salt);
    const { isSuccess, error } = await storage.changePassword(name, hashPassword, salt);
    if (error) throw new Error(error);
    return isSuccess;
  },
  deleteUser: async ({ name }) => {
    const { isSuccess, error } = await storage.deleteUserByName(name);
    if (error) throw new Error(error);
    return isSuccess;
  },
  getWebToken: async ({ name, password }) => {
    const { user, error } = await storage.getUserByName(name);
    if (error) throw new Error(error);
    if (!user) throw new Error(`${name} doesn't exist`);

    const hashPassword = getHashPassword(password, user.salt);
    if (user.password !== hashPassword) {
      throw new Error(`Wrong password of ${name}`);
    }
    const content = { user: name };
    const secretKey = storage.getSecretKey();
    const token = jwt.sign(content, secretKey, { expiresIn: 60 * 60 * 24 });
    return token;
  },
};
