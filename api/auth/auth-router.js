const router = require('express').Router();
const bscrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../users/users-model')
const mWare = require('../middleware/mWare')
const restricted = require('../middleware/restricted')
const config = require('../../config')


const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d'})
}

router.post('/register', mWare.registerCheck, async (req, res) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
      let { username, password } = req.body;
      const hash = bscrypt.hashSync(password, 8)
      password = hash;

      Users.add({username, password})
      .then(user => res.status(200).json(user))
})


router.post('/login', mWare.loginCheck, (req, res) => {
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  let { username } = req.body;
  Users.getBy({username: username})
  .then(user => {
    const token = generateToken(user)
    res.status(200).json({ message: `Welcome, ${user[0].username}`, token: token})
  })
  
});

module.exports = router;
