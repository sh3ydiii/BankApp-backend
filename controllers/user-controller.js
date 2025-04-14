const UserModule = require('../models/user-module')
const UserService = require('../service/user-service')

class UserController {
    async home(req, res, next) {
        try {
            const userId = req.user.id
            const result = await UserService.home(userId)
            await res.json(result)            
        } catch (err) {
            next(err)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async registration(req, res, next) {
        try {
            const {number} = req.body
            const result = await UserService.registration(number)
            await res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const {number, code} = req.body;
            const result = await UserService.login(number, code);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24  * 60 * 60 * 1000
            })
            return res.json(result)
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const result = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async verifyCode(req, res, next) {
        try {
            const { number, code } = req.body;
            const result = await UserService.verifyCode(number, code)
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 5 * 24 * 60 * 60 * 1000
            })
            await res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async paymentNumber(req, res, next) {
        try {
            const { amount, number } = req.body;
            const userId = req.user.id;
            const paymentData = await UserService.paymentNumber(amount,number, userId)
            await res.json(paymentData)
        } catch(err) {
            next(err)
        }
    }

    async paymentCard(req, res, next) {
        try {
            const {number, amount} = req.body
            const userId = req.user.id
            const paymentData = await UserService.paymentCard(number, amount, userId)
            return res.json(paymentData)
        } catch(err) {
            next(err)
        }
    }

    async sendCode(req,res, next) {
        try {
            const {number} = req.body
            const sendCode = await UserService.sendCode(number)
            await res.json(sendCode)
        } catch (err) {
            next(err)
        }
    }

    async getCard(req, res, next) {
        try {
            const userId = req.user.id
            const card = await UserService.getCard(userId)
            await res.json(card)
        } catch(err) {
            next(err)
        }
    }

    async blockCard(req, res, next) {
        try {
            const userId = req.user.id
            const deleteData = await UserService.blockCard(userId)

            await res.json(deleteData)
        } catch (err) {
            next(err)
        }
    }

    async createCard(req, res, next) {
        try {
            const { name, surname, patronymic, number } = req.body;
            const card = await UserService.createCard(name, surname, patronymic, number)
            await res.json(card)
        } catch(err) {
            next(err)
        }
    }

    async findChecks(req, res, next) {
        try {
            const userId = req.user.id;
            const check = await UserService.findChecks(userId)
            return res.json(check)
        } catch(err) {
            next(err)
        }
    }

    async getCheck(req, res, next) {
        try {
            const ticket = req.params.ticket;
            const check = await UserService.getCheck(ticket)
            return res.json(check)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new UserController()