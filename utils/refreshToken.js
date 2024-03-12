const jwt = require('jsonwebtoken');


const refreshToken = (id)=>{

    return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '1d'});

}

module.exports = refreshToken;