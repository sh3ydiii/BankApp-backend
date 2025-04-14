const UserModule = require('../models/user-module')
const CardModule = require('../models/card-module')

function generateCardNumber() {
    const prefix = '400000';
    let cardNumber = prefix;
  
    for (let i = 0; i < 9; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
  
    cardNumber += getLuhnCheckDigit(cardNumber);
    return cardNumber;
  }
  function getLuhnCheckDigit(number) {
    let sum = 0;
    let shouldDouble = true;
  
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
  
    return (10 - (sum % 10)) % 10;
  }
  
  function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString(); 
  }
  
  function generateExpiryDate() {
    const now = new Date();
    const year = now.getFullYear() + 10; 
    const month = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2); // от 01 до 12
    return `${month}/${year.toString().slice(-2)}`; // формат MM/YY
  }
  

class CardService {
    async CardCreate(name, surname, patronymic, number) {
      console.log(number)
      const CardNumber = generateCardNumber()
        const CardCVV = generateCVV()
        const ExpiryDate = generateExpiryDate()

        const user = await UserModule.findOne({number: number})
        const card = await CardModule.create({name: name,surname: surname, patronymic: patronymic, owner: user._id, user_number: user.number, card_number: CardNumber, card_cvv: CardCVV, card_dob: ExpiryDate})
        return card
    }
}

module.exports = new CardService();