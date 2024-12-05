const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const UserService = require("../services/user-service");
const TokenService = require("../services/token-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ msg: "phone no. is required" });
    }
    const otp = await otpService.genrateOtp();
    const ttl = 1000 * 60 * 20;
    const expire = Date.now() + ttl;
    const data = `${phone}.${otp}.${expire}`;
    const hashOtp = hashService.hashOtp(data);

    try {
      // await otpService.sendBysms(phone, otp);
      return res.json({
        hash: `${hashOtp}.${expire}`,
        phone,
        otp,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: `erro occured ${error}` });
    }

    res.send(`Your Otp is ${hashOtp}`);
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;

    if (!otp || !hash || !phone) {
      return res.status(400).json({ error: "All field requred" });
    }

    const [hashOtp, expire] = hash.split(".");
    if (Date.now() > +expire) {
      return res.status(400).json({ error: "Token Expired" });
    }

    const data = `${phone}.${otp}.${expire}`;

    const isValidOtp = otpService.verifyOtp(hashOtp, data);

    if (!isValidOtp) {
      return res.status(400).json({ erro: "Invalid Otp" });
    }

    let user;

    try {
      user = await UserService.findUser({ phone: phone });
      if (!user) {
        user = await UserService.createUser({ phone });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }

    const { accessToken, refreshToken } = tokenService.genrateTokens(user);
    await tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshtoken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDto(user);

    res.json({ user: userDto, auth: true });
  }
}

module.exports = new AuthController();
