const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const TokenModule = require('../models/token-module')
const UserModule = require('../models/user-module')

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_JWT, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_JWT)
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_JWT)
            return userData;
        } catch (e) {
            return null;
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModule.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshtoken = refreshToken;
            return tokenData.save()
        }
        const token = await TokenModule.create({user: userId, refreshtoken: refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModule.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(token) {
        const tokenData = await TokenModule.findOne({refreshtoken: token})
        return tokenData;
    }
}

module.exports = new TokenService()