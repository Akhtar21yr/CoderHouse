const otpService = require('../services/otp-service')

class AuthController {
    async sendOtp(req,res) {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({'msg' : "phone no. is required"})
        }
        const otp = await otpService.genrateOtp()
        res.send(`Your Otp is ${otp}`)
    }


}


module.exports = new AuthController() ;