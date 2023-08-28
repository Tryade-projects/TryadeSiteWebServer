const mongoose = require('mongoose');
const { v4 } = require('uuid');

const streamersSectionSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  urlTwitch: { type: String },
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
