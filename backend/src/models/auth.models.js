const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sponserId: String,
  sponserName : String,
  address: String,
  state: String,
  city: String,
  applicantName: String,
  gmail: String,
  bankName: String,
  branch: String,
  ifscCode: String,
  accountNumber: String,
  panCard: String,
  adharCard: Number,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
