const mongoose = require("mongoose");
const { Schema } = mongoose;

const PremiumUserSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isPremium: {
      type: Boolean,
      required: true,
      default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Premium", PremiumUserSchema);