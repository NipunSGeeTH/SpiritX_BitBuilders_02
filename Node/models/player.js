// models/player.js
const mongoose = require('mongoose');

// Define the schema for player data
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  category: { type: String, required: true },
  totalRuns: { type: Number, required: true },
  ballsFaced: { type: Number, required: true },
  inningsPlayed: { type: Number, required: true },
  wickets: { type: Number, required: true },
  oversBowled: { type: Number, required: true },
  runsConceded: { type: Number, required: true },
});

// Create a model from the schema
const Player = mongoose.model('Player', playerSchema);

module.exports = Player; // Export the model
