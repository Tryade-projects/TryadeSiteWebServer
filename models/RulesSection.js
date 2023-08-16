const mongoose = require('mongoose');
const { v4 } = require('uuid');

const ruleSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  textBackground: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const rulesSectionSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  sectionTitle: { type: String, required: true },
  urlBanner: { type: String, required: true },
  colorLine: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  rules: [ruleSchema], // Tableau d'objets de règles
});

module.exports = mongoose.model('RulesSection', rulesSectionSchema);
