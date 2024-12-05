const jwt = require("jsonwebtoken");
const acessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
const refreshModel = require("../model/refresh-model");

class TokenService {
  genrateTokens(user) {
    const payload = {
      id: user._id.toString(),
      phone: user.phone,
    };
    const accessToken = jwt.sign(payload, acessTokenSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });
    console.log("Access Token:", accessToken); // Debugging line
    console.log("Refresh Token:", refreshToken); // Debugging line
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token, userId) {
    try {
      await refreshModel.create({
        token,
        userId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, acessTokenSecret);
  }

  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }

  async findRefreshToken(userId, refreshToken) {
    return await refreshModel.findOne({ _id: userId, token: refreshToken });
  }

  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );
  }
}

module.exports = new TokenService();
