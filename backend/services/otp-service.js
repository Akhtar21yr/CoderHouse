const crypto = require("crypto");
const hashService = require('./hash-service')

const smsSid = process.env.SMS_SID;
const smsToken = process.env.SMS_TOKEN;
const smsNo = process.env.SMS_NO;
const twilio = require("twilio")(smsSid, smsToken, {
  lazyLoading: true,
});

class OtpService {
  async genrateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBysms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: smsNo,
      body: `Your Coders House Otp Is ${otp}`,
    });
  }

  verifyOtp(hashOtp, data) {
    return hashOtp === hashService.hashOtp(data)
  }
}

module.exports = new OtpService();
