const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user-module');
const Card = require('../models/card-module');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Card.deleteMany({});

    const user = await User.create({ number: '+79991234567' });
    await Card.create({
        owner: user._id,
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        user_number: user.number,
        card_number: '4000000000000001',
        card_cvv: 123,
        card_dob: '12/34',
        balance: 10000
    });

    console.log('Тестовые данные добавлены');
    process.exit();
}

seed();
