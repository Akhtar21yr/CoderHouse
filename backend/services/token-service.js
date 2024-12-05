const jwt = require("jsonwebtoken");
const acessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
class TokenService {
  genrateTokens(user) {
    const payload = {
      id: user._id.toString(),
      phone: user.phone,
    };
    const accessToken = jwt.sign(payload, acessTokenSecret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );
    console.log("Access Token:", accessToken); // Debugging line
    console.log("Refresh Token:", refreshToken); // Debugging line
    return { accessToken, refreshToken };
  }
}

module.exports = new TokenService();
