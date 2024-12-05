const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const buffer = Buffer.from(
      avatar.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    try {
      const jimpRes = await Jimp.read(buffer)
      jimpRes
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (error) {
        console.log(error)
      return res.status(500).json({ msg: "Image format not valid" });
    }

    const userId = req.user.id;
    

    try {
      const user = await userService.findUser({ _id: userId });
      console.log(user)

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.activated = true;
      user.name = name;
      console.log(`/storage/${imagePath}`)      
      user.avatar = `/storage/${imagePath}`;
      await user.save();
      console.log(user)

      return res.json({ user: new UserDto(user), auth: true });
    } catch (error) {
        clg
      return res.status(500).json({ msg: "Database error" });
    }
  }
}

module.exports = new ActivateController();
