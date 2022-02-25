const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const restrict = require('./middleware/restricted.js');
const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const server = express();
const Users = require('../api/users/users-model')


server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.get('/api/users', (req, res) => {
    Users.getAll()
    .then(allUsers => res.status(200).json(allUsers))
})


module.exports = server;
