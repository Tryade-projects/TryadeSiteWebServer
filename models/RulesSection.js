const mongoose = require('mongoose');
const { v4 } = require('uuid');

const ruleSchema = new mongoose.Schema({
  id: String,
  textBackground: String,
  title: String,
  text: String,
});

const rulesSectionSchema = new mongoose.Schema({
  id: String,
  sectionTitle: String,
  urlBanner: String,
  colorLine: String,
  rules: [ruleSchema], // Tableau d'objets de règles
});

// Middleware pour générer les id se section et des rules pour les fixtures, et les _id des objets du tableau "rules" pour les nouveaux documents
rulesSectionSchema.pre('save', function (next) {
  // ajouter un id uuid a la section si elle n'en a pas
  if (!this.id) {
    this.id = v4();
  }
  // Parcourir les règles
  for (const rule of this.rules) {
    if (!rule._id) {
      rule._id = new mongoose.Types.ObjectId();
    }
    if (!rule.id) {
      rule.id = v4();
    }
  }
  next();
});

module.exports = mongoose.model('RulesSection', rulesSectionSchema);
