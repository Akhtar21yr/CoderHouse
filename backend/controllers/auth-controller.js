const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const UserService = require("../services/user-service");
const TokenService = require("../services/token-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
const userService = require("../services/user-service");

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
      return res.json({
        hash: `${hashOtp}.${expire}`,
        phone,
        otp,
      });
    } catch (error) {
      return res.status(500).json({ error: `error occurred ${error}` });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;

    if (!otp || !hash || !phone) {
      return res.status(400).json({ error: "All fields required" });
    }

    const [hashOtp, expire] = hash.split(".");
    if (Date.now() > +expire) {
      return res.status(400).json({ error: "Token Expired" });
    }

    const data = `${phone}.${otp}.${expire}`;

    const isValidOtp = otpService.verifyOtp(hashOtp, data);

    if (!isValidOtp) {
      return res.status(400).json({ error: "Invalid Otp" });
    }

    let user;

    try {
      user = await UserService.findUser({ phone: phone });
      if (!user) {
        user = await UserService.createUser({ phone });
      }
    } catch (error) {
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

  async refresh(req, res) {
    const { refreshtoken: refreshTokenFromCookie } = req.cookies;

    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      return res.status(401).json({ msg: "Invalid Refresh Token" });
    }

    let token;
    try {
      token = await tokenService.findRefreshToken(
        userData.id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({ msg: "Invalid Refresh Token" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Internal error" });
    }

    let user;
    try {
      user = await userService.findUser({ _id: userData.id });
      if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error" });
    }

    let refreshToken, accessToken;
    try {
      const tokens = tokenService.genrateTokens(user);
      refreshToken = tokens.refreshToken;
      accessToken = tokens.accessToken;
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal error while generating tokens" });
    }

    try {
      await tokenService.updateRefreshToken(userData.id, refreshToken);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal error updating refresh token" });
    }

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

  async logout(req, res) {
    const { refreshtoken } = req.cookies;
    await tokenService.removeToken(refreshtoken);
    res.clearCookie("refreshtoken");
    res.clearCookie("accesstoken");
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
