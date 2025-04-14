const Router = require('express').Router
const router = new Router()

const validatePhone = require('../validation/number-validation.js');
const UserController = require('../controllers/user-controller')

const AuthMidleware = require('../middleware/auth-midleware.js')

router.post('/registration',validatePhone, UserController.registration) // Зарегистрироваться
router.post('/send-code',validatePhone, UserController.sendCode) // Отправить код подтверждения
router.post('/registration/verify-code',validatePhone, UserController.verifyCode) // Подтвердить код и залогиниться
router.post('/login', validatePhone, UserController.login) // Войти в аккаунт
router.post('/logout', UserController.logout) // Выйти из аккаунта
router.get('/home', AuthMidleware, UserController.home) // Главная страница с данными пользователя
router.post('/refresh', UserController.refreshToken) // Обновить токен

router.post('/home/payment/number',AuthMidleware, UserController.paymentNumber) // Перевести деньги пользователю по номеру телефона
router.post('/home/payment/card', AuthMidleware, UserController.paymentCard)

router.get('/card', AuthMidleware, UserController.getCard) // Получить карту пользователя 
router.delete('/card', AuthMidleware, UserController.blockCard) // Заблокировать карту
router.post('/card/create', AuthMidleware, UserController.createCard) // Создать карту

router.get('/check', AuthMidleware, UserController.findChecks) // Посмотреть чеки переводов
router.get('/check/:ticket', AuthMidleware, UserController.getCheck) // Посмотреть чек

module.exports = router;