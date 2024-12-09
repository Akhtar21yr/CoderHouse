const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: { type: String, required: true },
    name: { type: String, required: false },
    avatar: { 
      type: String, 
      required: false,
      get: function(avatar) {
        return avatar ? `${process.env.BASE_URL}${avatar}` : null;
      }
    },
    activated: { type: Boolean, default: false, required: true },
  },
  { 
    timestamps: true,
    toJSON: { getters: true }, 
  }
);

module.exports = mongoose.model('User', userSchema, 'users');
