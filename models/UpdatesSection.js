const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const updatesSectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sectionTitle: { type: String, required: true },
  version: { type: String, required: true },
  urlBanner: { type: String, required: true },
  colorLine: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  details: [detailSchema], // Tableau d'objets des détails
});

module.exports = mongoose.model('UpdatesSection', updatesSectionSchema);
