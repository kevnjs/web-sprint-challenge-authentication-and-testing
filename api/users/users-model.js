const db = require('../../data/dbConfig')

function getAll () {
    return db('users')
}

function getBy(filter) {
    return db('users').where(filter)
}

function getById(id) {
    return db('users').where({id: id})
}

function add(newUser) {
    return db('users')
    .insert(newUser)
    .then(([id]) => getById(id))
}




module.exports = {
    getAll,
    getBy,
    add
}