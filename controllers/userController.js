const userRepository = require('../repositories/userRepository');

exports.usersUI = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.render('users', { users });
  } catch (err) {
    res.render('users', { users: [], error: err.message });
  }
};

exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await userRepository.addUser(name, email);
    res.redirect('/users/ui');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    await userRepository.deleteUser(id);
    res.redirect('/users/ui');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
