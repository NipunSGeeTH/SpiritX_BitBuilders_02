// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());

// MongoDB connection URL
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => { console.log("Connected to Database"); })
  .catch((e) => console.log(e));

// Models


// Player model
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']
  },
  totalRuns: { type: Number, default: 0 },
  totalBallsFaced: { type: Number, default: 0 },
  inningsPlayed: { type: Number, default: 0 },
  totalBallsBowled: { type: Number, default: 0 },
  totalWicketsTaken: { type: Number, default: 0 },
  totalRunsConceded: { type: Number, default: 0 },
  battingStrikeRate: { type: Number, default: 0 },
  battingAverage: { type: Number, default: 0 },
  bowlingStrikeRate: { type: Number, default: 0 },
  economyRate: { type: Number, default: 0 },
  playerPoints: { type: Number, default: 0 },
  playerValue: { type: Number, default: 0 },
  image: { type: String, default: 'default-player.jpg' }
});

// Calculate cricket stats when player data is saved or updated
playerSchema.pre('save', function(next) {
  if (this.totalBallsFaced > 0) {
    this.battingStrikeRate = calculateBattingStrikeRate(this.totalRuns, this.totalBallsFaced);
  }
  
  if (this.inningsPlayed > 0) {
    this.battingAverage = calculateBattingAverage(this.totalRuns, this.inningsPlayed);
  }
  
  if (this.totalWicketsTaken > 0) {
    this.bowlingStrikeRate = calculateBowlingStrikeRate(this.totalBallsBowled, this.totalWicketsTaken);
  } else {
    this.bowlingStrikeRate = 999; // High default value for non-bowlers
  }
  
  if (this.totalBallsBowled > 0) {
    this.economyRate = calculateEconomyRate(this.totalRunsConceded, this.totalBallsBowled);
  } else {
    this.economyRate = 12; // High default value for non-bowlers
  }
  
  this.playerPoints = calculatePlayerPoints(
    this.battingStrikeRate || 0, 
    this.battingAverage || 0, 
    this.bowlingStrikeRate || 999, 
    this.economyRate || 12
  );
  
  this.playerValue = calculatePlayerValue(this.playerPoints);
  
  next();
});

const Player = mongoose.model("Player", playerSchema);

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budget: { type: Number, default: 9000000 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  accountType: { type: String, default: 'user', enum: ['user', 'admin'] },
  teamName: { type: String, default: 'My Team' },
  totalPoints: { type: Number, default: 0 }
});

const User = mongoose.model("UserInfo", userSchema);

// Helper functions
function calculatePlayerPoints(battingStrikeRate, battingAverage, bowlingStrikeRate, economyRate) {
  // Player Points = (Batting Strike Rate / 5 + Batting Average * 0.8) + (500 / Bowling Strike Rate + 140 / Economy Rate)
  return (battingStrikeRate / 5 + battingAverage * 0.8) + (500 / bowlingStrikeRate + 140 / economyRate);
}

function calculateBattingStrikeRate(totalRuns, totalBallsFaced) {
  // Batting Strike Rate = (Total Runs / Total Balls Faced) * 100
  return (totalRuns / totalBallsFaced) * 100;
}

function calculateBattingAverage(totalRuns, inningsPlayed) {
  // Batting Average = Total Runs / Innings Played
  return totalRuns / inningsPlayed;
}

function calculateBowlingStrikeRate(totalBallsBowled, totalWicketsTaken) {
  // Bowling Strike Rate = Total Balls Bowled / Total Wickets Taken
  return totalBallsBowled / totalWicketsTaken;
}

function calculateEconomyRate(totalRunsConceded, totalBallsBowled) {
  // Economy Rate = (Total Runs Conceded / Total Balls Bowled) * 6
  return (totalRunsConceded / totalBallsBowled) * 6;
}

function calculatePlayerValue(playerPoints) {
  // Value in Rupees = (9 * Points + 100) * 1000
  let value = (9 * playerPoints + 100) * 1000;
  // Round to the nearest multiple of 50,000
  return Math.round(value / 50000) * 50000;
}

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Please authenticate" });
  }
};

// Routes
// Register route
app.post('/register', async (req, res) => {
  let { username, password, teamName } = req.body;
  username = username.toLowerCase(); // Convert username to lowercase
  const encryptedPassword = await bcrypt.hash(password, 10);
  
  try {
    const oldUser = await User.findOne({ username });
    
    if (oldUser) {
      return res.json({ status: "error", error: "Username already exists" });
    }
    
    await User.create({
      username,
      password: encryptedPassword,
      budget: 9000000,
      players: [],
      accountType: 'user',
      teamName: teamName || `${username}'s Team`
    });
    
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", message: "Server error" });
  }
});

// Login route
app.post('/login-user', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.json({ status: "error", error: "Username not found" });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({ status: "error", error: "Incorrect password" });
    }
    
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      status: "ok",
      token: token,
      accountType: user.accountType
    });
  } catch (error) {
    res.json({ status: "error", message: "Server error" });
  }
});

// User data route
app.get('/userData', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('players');
    
    res.json({
      status: "ok",
      data: {
        username: user.username,
        budget: user.budget,
        teamName: user.teamName,
        accountType: user.accountType,
        players: user.players,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    res.json({ status: "error", message: "Server error" });
  }
});

// Update user team name
app.patch('/updateTeamName', auth, async (req, res) => {
  const { teamName } = req.body;
  
  try {
    await User.findByIdAndUpdate(req.user._id, { teamName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", message: "Server error" });
  }
});

// API to get all players
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// API to get player by ID
app.get("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// API to select a player for user's team
app.post("/api/selectPlayer", auth, async (req, res) => {
  const { playerId } = req.body;
  
  try {
    const user = await User.findById(req.user._id).populate('players');
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    
    // Check if user already has 11 players
    if (user.players.length >= 11) {
      return res.status(400).json({ 
        status: "error", 
        message: "You can select a maximum of 11 players" 
      });
    }
    
    // Check if player is already in team
    if (user.players.some(p => p._id.toString() === playerId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Player already in your team" 
      });
    }
    
    // Check if user has enough budget
    if (user.budget < player.playerValue) {
      return res.status(400).json({ 
        status: "error", 
        message: "Insufficient budget to select this player" 
      });
    }
    
    // Add player to user's team and update budget
    user.players.push(player._id);
    user.budget -= player.playerValue;
    
    // Calculate total team points
    user.totalPoints = user.players.reduce((total, p) => {
      return total + (p.playerPoints || 0);
    }, player.playerPoints);
    
    await user.save();
    
    res.json({ 
      status: "ok", 
      message: "Player added to your team",
      updatedBudget: user.budget,
      teamSize: user.players.length
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// API to remove a player from user's team
app.post("/api/removePlayer", auth, async (req, res) => {
  const { playerId } = req.body;
  
  try {
    const user = await User.findById(req.user._id).populate('players');
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    
    // Check if player is in team
    if (!user.players.some(p => p._id.toString() === playerId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Player not in your team" 
      });
    }
    
    // Remove player from user's team and refund budget
    user.players = user.players.filter(p => p._id.toString() !== playerId);
    user.budget += player.playerValue;
    
    // Recalculate total team points
    user.totalPoints = user.players.reduce((total, p) => {
      return total + (p.playerPoints || 0);
    }, 0);
    
    await user.save();
    
    res.json({ 
      status: "ok", 
      message: "Player removed from your team",
      updatedBudget: user.budget,
      teamSize: user.players.length
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// API to get leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find({ accountType: 'user' })
      .select('username teamName totalPoints')
      .sort({ totalPoints: -1 });
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      teamName: user.username,
      totalPoints: user.totalPoints
    }));
    
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin routes
// Add a new player (admin only)
app.post("/api/admin/addPlayer", auth, async (req, res) => {
  if (req.user.accountType !== 'admin') {
    return res.status(403).json({ status: "error", message: "Admin access required" });
  }
  
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.json({ status: "ok", player: newPlayer });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update a player (admin only)
app.put("/api/admin/updatePlayer/:id", auth, async (req, res) => {
  if (req.user.accountType !== 'admin') {
    return res.status(403).json({ status: "error", message: "Admin access required" });
  }
  
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPlayer) {
      return res.status(404).json({ status: "error", message: "Player not found" });
    }
    
    res.json({ status: "ok", player: updatedPlayer });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete a player (admin only)
app.delete("/api/admin/deletePlayer/:id", auth, async (req, res) => {
  if (req.user.accountType !== 'admin') {
    return res.status(403).json({ status: "error", message: "Admin access required" });
  }
  
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    
    if (!deletedPlayer) {
      return res.status(404).json({ status: "error", message: "Player not found" });
    }
    
    // Remove player from all user teams and refund their value
    await User.updateMany(
      { players: req.params.id },
      { 
        $pull: { players: req.params.id },
        $inc: { budget: deletedPlayer.playerValue }
      }
    );
    
    // Recalculate total points for affected users
    const affectedUsers = await User.find({ players: req.params.id }).populate('players');
    for (const user of affectedUsers) {
      user.totalPoints = user.players.reduce((total, p) => total + p.playerPoints, 0);
      await user.save();
    }
    
    res.json({ status: "ok", message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Start the server
app.listen(4000, () => {
  console.log("Server Started on http://localhost:4000");
});