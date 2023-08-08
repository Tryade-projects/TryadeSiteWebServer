const mongoose = require('mongoose');

/* This is creating a schema for the project model. */
const rulesSectionsSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  urlBanner: { type: String, required: true },
  colorLine: { type: String, required: true },
  rules: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RulesSections', rulesSectionsSchema);
