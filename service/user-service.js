const mongoose = require('mongoose')

const ApiError = require('../exceptions/api-error')

const UserModule = require('../models/user-module')
const CardModule = require('../models/card-module')
const CodeModule = require('../models/code-module')
const CheckModule = require('../models/check-module')
const UserDto = require('../dtos/user-dto')

const NumberService = require('../service/number-servce')
const CardService = require('../service/card-service')
const TokenService = require('../service/token-service')

function generateTicket() {
    return Math.floor(Math.random() * 1000000)
}
class UserService {
    async home(userId) {
        const user = await UserModule.findById(userId)
        const card = await CardModule.findOne({owner: userId})
        return {user, card}
    }

    async login(number, code) {
        const user = await UserModule.findOne({number})
        if (!user) throw ApiError.badRequest('Пользователя не существует')
        
        const codeData = await CodeModule.findOne({code})
        if (!codeData || codeData.number != number) throw ApiError.badRequest('Неверный код')
        
        const userDto = new UserDto(user)
        const tokens = await TokenService.generateToken({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        await CodeModule.findOneAndDelete({code})
        return tokens
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await TokenService.findToken(refreshToken)
        console.log(userData, tokenFromDB)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModule.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = await TokenService.generateToken({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
    async registration(number) {
        const user1 = await UserModule.findOne({ number });
        if (user1) throw new Error('Пользователь уже зарегистрирован');
        
        const result = await NumberService.sendCodeSMS(number);
        
        return result;
    }

    async verifyCode(number, code) {
        const codeData = await CodeModule.findOne({code})
        if (!code && codeData.number.toString() != number.toString()) throw new Error('Неверный код')
        
        const user = await UserModule.create({number})
        const userDto = new UserDto(user)
        
        const tokens = await TokenService.generateToken({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return tokens
    }

    async paymentNumber(amount, number, userId) {
        try {
            const ticket = await generateTicket()
            let card = await CardModule.findOne({ owner: userId })
            if (!card) throw ApiError.badRequest('У вас нет карты!');
    
            let cardRecipient = await CardModule.findOne({ user_number: number })
            if (!cardRecipient) throw ApiError.badRequest('Пользователь не найден');
    
            if (card.balance < amount) throw ApiError.badRequest('Недостаточно денег на балансе!');
    
            card.balance -= amount;
            cardRecipient.balance += amount;
    
            await card.save();
            await cardRecipient.save();
            
            const check = await CheckModule.create({ticket: ticket, sender: card.user_number, beneficiary: cardRecipient.user_number, amount: amount})
    
            return { check };
    
        } catch (error) {
            throw error;
        }
    }

    async paymentCard(cardNumber, amount, userId) {
        try {
            const ticket = await generateTicket()
            let card = await CardModule.findOne({ owner: userId })
            if (!card) throw ApiError.badRequest('У вас нет карты!');
    
            let cardRecipient = await CardModule.findOne({ card_number: cardNumber })
            console.log(cardNumber)
            if (!cardRecipient) throw ApiError.badRequest('Пользователь не найден');
    
            if (card.balance < amount) throw ApiError.badRequest('Недостаточно денег на балансе!');
    
            card.balance -= amount;
            cardRecipient.balance += amount;
    
            await card.save();
            await cardRecipient.save();

            const check = await CheckModule.create({ticket: ticket, sender: card.card_number, beneficiary: cardRecipient.card_number, amount: amount})
    
            return { check };
    
        } catch(err) {
            console.log(err)
            throw ApiError.badRequest('Ошибка при переводе!')
        }
    }

    async sendCode(number) {
        const resultSend = await NumberService.sendCodeSMS(number)
        return resultSend
    }

    async getCard(userId) {
        const card = await CardModule.findOne({owner: userId})
        if (!card) throw ApiError.badRequest('Карта не найдена')

        return card
    }

    async blockCard(userId) {
        const card = await CardModule.findOne({owner: userId})

        if (!card) throw ApiError.badRequest('У вас нету карты!')

        if (card.balance > 0) throw ApiError.badRequest('Вы не можете заблокировать карту, если на ней есть деньги.')

        let user = await UserModule.findById(userId)

        user.card = null

        await user.save()
        await card.deleteOne()
        return {message: 'Карта удалена!'}
    }

    async createCard(name, surname, patronymic, number) {
        console.log(number)
        const card = await CardService.CardCreate(name, surname, patronymic, number)

        return card
    }

    async findChecks(userId) {
        const user = await UserModule.findById(userId)
        const card = await CardModule.findOne({ owner: userId })
    
        if (!user || !card) throw ApiError.badRequest('Пользователь или карта не найдены')
    
        const number = user.number
        const cardNumber = card.card_number
    
        const checks = await CheckModule.find({
            $or: [
                { sender: number },
                { sender: cardNumber },
                { beneficiary: number },
                { beneficiary: cardNumber }
            ]
        }).sort({ date: -1 })
    
        if (!checks) throw ApiError.badRequest('Чеки не найдены')
        return checks
    }

    async getCheck(ticket) {
        const check = await CheckModule.findOne({ticket})
        if (!check) throw ApiError.badRequest('Чек не найден')

        return check
    }
    
}

module.exports = new UserService()