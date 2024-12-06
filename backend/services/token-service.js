const jwt = require("jsonwebtoken");
const acessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
const refreshModel = require("../model/refresh-model");
const { default: mongoose } = require("mongoose");

class TokenService {
  genrateTokens(user) {
    const payload = {
      id: user._id.toString(),
      phone: user.phone,
    };
    const accessToken = jwt.sign(payload, acessTokenSecret, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });
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
    return await refreshModel.findOne({ userId: userId, token: refreshToken });
  }

  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );
  }

  async removeToken(refreshToken) {
    console.log(refreshToken)
    const dbResponse =  await refreshModel.deleteOne({ token: refreshToken });
    console.log(dbResponse)
    return dbResponse
  }
}

module.exports = new TokenService();
