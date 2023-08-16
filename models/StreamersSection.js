const mongoose = require('mongoose');
const { v4 } = require('uuid');

const streamersSectionSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  urlImageAvatar: { type: String, required: true },
  name: { type: String, required: true },
  nbOfFollowers: { type: Number, required: true },
  nbOfViewers: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  urlTwitch: { type: String, required: true },
  urlBackground: { type: String, required: true },
  channelLink: { type: String, required: true },
});

// Middleware pour générer les id se section pour les fixtures
streamersSectionSchema.pre('save', function (next) {
  // ajouter un id uuid a la section si elle n'en a pas
  if (!this.id) {
    this.id = v4();
  }
  next();
});

module.exports = mongoose.model('StreamersSection', streamersSectionSchema);
