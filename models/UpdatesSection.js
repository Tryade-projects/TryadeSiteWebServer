const mongoose = require('mongoose');
const { v4 } = require('uuid');

const detailSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
});

const updatesSectionSchema = new mongoose.Schema({
  id: String,
  sectionTitle: String,
  version: String,
  urlBanner: String,
  colorLine: String,
  details: [detailSchema], // Tableau d'objets des détails
});

// Middleware pour générer les _id des objets du tableau "rules"
updatesSectionSchema.pre('save', function (next) {
  // ajouter un id uuid a la section si elle n'en a pas
  if (!this.id) {
    this.id = v4();
  }
  // Parcourir les details
  for (const detail of this.details) {
    if (!detail._id) {
      detail._id = new mongoose.Types.ObjectId();
    }
    if (!detail.id) {
      detail.id = v4();
    }
  }
  next();
});

module.exports = mongoose.model('UpdatesSection', updatesSectionSchema);
