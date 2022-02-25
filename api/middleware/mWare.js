const Users = require('../users/users-model')
const bscrypt = require('bcryptjs')

async function registerCheck (req, res, next) {
    try {
    let { username, password } = req.body
    const user = await Users.getBy({ username })
    if(!username || !password) return res.status(400).json({message: "username and password required"})
    if(user[0]?.username) return res.status(400).json({message: "username taken"})
    next()
    }
    catch {
        res.status(500).json({message: "An error occurred when creating the user"})
    }
}

async function loginCheck (req, res, next) {
    
        let { username, password } = req.body;
        const user = await Users.getBy({ username })
        console.log(user[0])
        if(!user[0]?.username) return res.status(400).json({message: "invalid credentials"}) //if user exists
        if(!username || !password) return res.status(400).json({message: "username and password required"}) //if username and password in body
        if(!bscrypt.compareSync(password, user[0].password)) return res.status(400).json({message: "invalid credentials"}) //if password is correct
        next()

    
    // catch {
    //     res.status(500).json({message: "An error occurred when logging in. Please try again"})
    // }
}
module.exports = {
    registerCheck,
    loginCheck
}