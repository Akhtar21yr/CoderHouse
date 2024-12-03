const crypto = require('crypto')

class OtpService {
    async genrateOtp() {
        const otp = crypto.randomInt(1000,9999)
        return otp
    }

    sendBysms() {}

    verifyOtp() {}
}

module.exports = new OtpService();