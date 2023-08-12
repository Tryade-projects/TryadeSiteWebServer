require('dotenv').config();
const mongoose = require('mongoose');

const RulesSections = require('./models/RulesSection');
const RulesSectionsData = require('./rules.json');

const UpdatesSections = require('./models/UpdatesSection');
const UpdatesSectionsData = require('./updates.json');

const StreamersSections = require('./models/StreamersSection');
const StreamersSectionsData = require('./streamers.json');

const cleAPI = process.env.MONGODB_URI || '';

/**
 * It connects to the MongoDB database, then it loops through the data and adds each element to the database
 * @param {Object} Model - the model you want to use to create the new elements.
 * @param {object} data - the data to be inserted into the database.
 * @returns {Promise} - a promise that resolves when the data is inserted.
 */
async function start(Model, data) {
  /* Connecting to the MongoDB database. */
  try {
    await mongoose.connect(cleAPI, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à MongoDB réussie !');
    for (const fixture in data) {
      console.log(fixture);
      const newElm = new Model(data[fixture]);
      await newElm.save();
      console.log('New element added successfully');
    }
  } catch (error) {
    console.log(error);
  }
}

// start(RulesSections, RulesSectionsData);
// start(UpdatesSections, UpdatesSectionsData);
start(StreamersSections, StreamersSectionsData);
