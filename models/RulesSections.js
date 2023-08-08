const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  textBackground: String,
  title: String,
  text: String,
});

const rulesSectionSchema = new mongoose.Schema({
  sectionTitle: String,
  urlBanner: String,
  colorLine: String,
  rules: [ruleSchema], // Tableau d'objets de règles
});

// Middleware pour générer les _id des objets du tableau "rules"
rulesSectionSchema.pre('save', function (next) {
  // Parcourir les règles
  for (const rule of this.rules) {
    if (!rule._id) {
      rule._id = new mongoose.Types.ObjectId();
    }
  }
  next();
});

module.exports = mongoose.model('RulesSections', rulesSectionSchema);
