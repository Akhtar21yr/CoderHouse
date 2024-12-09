const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class RoomsController {
  async create(req, res) {
    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({ msg: "All fields are Required" });
    }

    console.log("Owner>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.user);

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user.id,
    });

    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const rooms = await roomService.getAllRooms(['open']);
    const allRooms = rooms.map(room => new RoomDto(room));

    return res.json(allRooms)
  }
}

module.exports = new RoomsController();
