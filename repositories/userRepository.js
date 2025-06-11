const userModel = require('../models/userModel');

exports.getAllUsers = async () => {
  return await userModel.getAllUsers();
};

exports.addUser = async (name, email) => {
  return await userModel.addUser(name, email);
};

exports.deleteUser = async (id) => {
  return await userModel.deleteUser(id);
};
