const mongoose = require('mongoose');
const { v4 } = require('uuid');

const streamersSectionSchema = new mongoose.Schema({
  id: String,
  urlImageAvatar: String,
  name: String,
  nbOfFollowers: Number,
  nbOfViewers: Number,
  date: String,
  urlTwitch: String,
  urlBackground: String,
  channelLink: String,
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
