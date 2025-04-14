module.exports = function (req, res, next) {
    const { number } = req.body;
    if (!/^\+7\d{10}$/.test(number)) {
        return res.status(400).json({ message: 'Неверный формат номера телефона' });
    }
    next();
}
