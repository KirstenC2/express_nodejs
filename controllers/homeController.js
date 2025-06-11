const db = require('../service/db');
const userModel = require('../models/userModel');

exports.index = (req, res) => {
  res.render('home', { title: 'Home Page' });
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.usersUI = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.render('users', { users });
  } catch (err) {
    res.render('users', { users: [], error: err.message });
  }
};

exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await userModel.addUser(name, email);
    res.redirect('/users/ui');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    await userModel.deleteUser(id);
    res.redirect('/users/ui');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
