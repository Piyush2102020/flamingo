const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

exports.MusicModel = mongoose.model('music', musicSchema);
