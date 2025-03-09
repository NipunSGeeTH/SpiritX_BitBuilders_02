// components/BudgetView.js
import React from 'react';
import { Link } from 'react-router-dom';

const BudgetView = ({ user }) => {
  // Calculate spent budget
  const spentBudget = 9000000 - user.budget;
  const spentPercentage = (spentBudget / 9000000) * 100;

  // Function to calculate player value
  const calculatePlayerValue = (player) => {
    const battingStrikeRate = player.ballsFaced > 0 ? (player.totalRuns / player.ballsFaced) * 100 : 0;
    const battingAverage = player.inningsPlayed > 0 ? (player.totalRuns / player.inningsPlayed) : 0;
    const bowlingStrikeRate = player.wickets > 0 ? ((player.oversBowled * 6) / player.wickets) : 1;
    const economyRate = player.oversBowled > 0 ? ((player.runsConceded / (player.oversBowled * 6)) * 6) : 1;

    const playerPoints = (battingStrikeRate / 5 + battingAverage * 0.8) + (500 / bowlingStrikeRate + 140 / economyRate);
    const playerValue = (9 * playerPoints + 100) * 1000;
    return Math.round(playerValue / 50000) * 50000;
  };

  return (
    <div className="budget-view-container">
      <h2>Budget Overview</h2>
      
      <div className="budget-summary">
        <div className="budget-card total">
          <h3>Total Budget</h3>
          <p className="budget-value">Rs.9,000,000</p>
        </div>
        
        <div className="budget-card spent">
          <h3>Spent</h3>
          <p className="budget-value">Rs.{spentBudget.toLocaleString()}</p>
          <p className="budget-percentage">{spentPercentage.toFixed(1)}%</p>
        </div>
        
        <div className="budget-card remaining">
          <h3>Remaining</h3>
          <p className="budget-value">Rs.{user.budget.toLocaleString()}</p>
          <p className="budget-percentage">{(100 - spentPercentage).toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="budget-progress">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${spentPercentage}%` }}></div>
        </div>
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="budget-details">
        <h3>Player Investment Breakdown</h3>
        
        {user.players.length === 0 ? (
          <div className="empty-team">
            <p>You haven't selected any players yet.</p>
            <Link to="/select-team" className="btn btn-primary">Select Players</Link>
          </div>
        ) : (
          <div className="player-budget-list">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Value</th>
                  <th>Points</th>
                  <th>Value/Point</th>
                </tr>
              </thead>
              <tbody>
                {user.players
                  .sort((a, b) => calculatePlayerValue(b) - calculatePlayerValue(a)) // Sort players by their value
                  .map(player => {
                    const playerValue = calculatePlayerValue(player);
                    const playerPoints = (player.ballsFaced > 0 ? (player.totalRuns / player.ballsFaced) * 100 : 0) / 5 + 
                                         (player.totalRuns / player.inningsPlayed) * 0.8 + 
                                         (500 / (player.wickets > 0 ? (player.oversBowled * 6) / player.wickets : 1)) + 
                                         (140 / (player.oversBowled > 0 ? (player.runsConceded / (player.oversBowled * 6)) * 6 : 1));
                    return (
                      <tr key={player._id}>
                        <td>{player.name}</td>
                        <td>{player.role}</td>
                        <td>{player.team}</td>
                        <td>Rs.{playerValue.toLocaleString()}</td>
                        <td>{playerPoints.toFixed(1)}</td>
                        <td>Rs.{(playerValue / playerPoints).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    );
                  })}
                <tr className="total-row">
                  <td colSpan="3"><strong>Total</strong></td>
                  <td>
                    <strong>
                     Rs.{user.players.reduce((sum, p) => sum + calculatePlayerValue(p), 0).toLocaleString()}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {user.players.reduce((sum, p) => sum + (p.ballsFaced > 0 ? (p.totalRuns / p.ballsFaced) * 100 : 0) / 5 + 
                                         (p.totalRuns / p.inningsPlayed) * 0.8 + 
                                         (500 / (p.wickets > 0 ? (p.oversBowled * 6) / p.wickets : 1)) + 
                                         (140 / (p.oversBowled > 0 ? (p.runsConceded / (p.oversBowled * 6)) * 6 : 1)), 0).toFixed(1)}
                    </strong>
                  </td>
                  <td>
                    <strong>
                     Rs.{(user.players.reduce((sum, p) => sum + calculatePlayerValue(p), 0) / 
                         user.players.reduce((sum, p) => sum + (p.ballsFaced > 0 ? (p.totalRuns / p.ballsFaced) * 100 : 0) / 5 + 
                                         (p.totalRuns / p.inningsPlayed) * 0.8 + 
                                         (500 / (p.wickets > 0 ? (p.oversBowled * 6) / p.wickets : 1)) + 
                                         (140 / (p.oversBowled > 0 ? (p.runsConceded / (p.oversBowled * 6)) * 6 : 1)), 0)).toLocaleString(undefined, {
                        maximumFractionDigits: 0
                      })}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="budget-advice">
        <h3>Budget Recommendations</h3>
        <ul>
          <li>Try to balance your team with players from different price ranges</li>
          <li>Look for value players (high points to cost ratio)</li>
          <li>Consider having at least 3-4 all-rounders for better point potential</li>
          <li>Don't spend your entire budget - keep some reserve for replacements</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetView;
