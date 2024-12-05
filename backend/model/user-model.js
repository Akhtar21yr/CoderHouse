const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    phone: { type: String, required: true },
    activated: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User',userSchema,'users')