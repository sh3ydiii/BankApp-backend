const dotenv = require('dotenv')
dotenv.config()

const axios = require('axios');
const crypto = require("crypto");

const CodeSchema = require('../models/code-module')

function generateCode() {
    const buffer = crypto.randomBytes(3); 
    const code = buffer.readUIntBE(0, 3) % 1000000;
    return code.toString().padStart(6, "0"); 
}

class NumberService {
    async sendCodeSMS(phoneNumber) {
        const code = generateCode();
        const codeData = await CodeSchema.create({number: phoneNumber, code: code})
        return codeData
      //   try {
      //     const response = await axios.get('https://sms.ru/sms/send', {
      //       params: {
      //         api_id: process.env.SMS_API_KEY,
      //         to: phoneNumber,
      //         msg: `Ваш код подтверждения: ${code}`,
      //         json: 1,
      //       },
      //     });
      
      //     const data = response.data;
      
      //     if (data.status !== 'OK') {
      //       console.error('Общая ошибка:', data.status_text);
      //       return;
      //     }
      
      //     const phoneResult = data.sms[phoneNumber];
      //     if (phoneResult.status === 'OK') {
      //       console.log(`✅ Код ${code} отправлен на ${phoneNumber}`);
      //     } else {
      //       console.error(`❌ Ошибка для ${phoneNumber}:`, phoneResult.status_text);
      //     }
      
      //   } catch (error) {
      //     console.error('Ошибка при запросе:', error.message);
      //   }
      }
}

module.exports = new NumberService()