// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import './styles_home.css';
import './styles_home2.css';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="main-header">
        <h1>Welcome to Fantasy Cricket League</h1>
        <br />
        <nav className="main-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><Link to="/players">Players</Link></li>
            <li><Link to="/select-team">Select Your Team</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><a href="#contactus">Contact Us</a></li>
            <li className="login-btn"><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="slideshow-container">
          <div className="mySlides fade">
            <img src="/image1.jpeg" alt="Slide 1" style={{ width: '100%' }} />
          </div>
          <div className="mySlides fade">
            <img src="/image2.jpeg" alt="Slide 2" style={{ width: '100%' }} />
          </div>
          <div className="mySlides fade">
            <img src="/image3.jpeg" alt="Slide 3" style={{ width: '100%' }} />
          </div>
        </div>

        <br />
        <div style={{ textAlign: 'center' }}>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <section id="players" className="players-section">
          <br />
          <h2>Build Your Dream Cricket Team & Compete for Glory!</h2>
          <br />
          <div id="player-list"></div>
        </section>

        <div className="container2"></div>
        <br /><br />

        <section className="game-features">
          <h2>Key Features of the Game</h2>

          <div className="features-grid">
            <div className="feature-box">
              <h3>How the Game Works</h3>
              <p>Fantasy Cricket League lets you create your own dream team with real players from the tournament.
                Your team earns points based on the real-life performances of the players in actual matches.</p>
            </div>

            <div className="feature-box">
              <h3>Points System</h3>
              <ul className="points-list">
                <li>Runs Scored: <b>1 point per run</b></li>
                <li>Wickets Taken: <b>25 points per wicket</b></li>
                <li>Catches: <b>10 points per catch</b></li>
                <li>Bonus for Centuries: <b>50 points</b></li>
              </ul>
            </div>

            <div className="feature-box">
              <h3>Budget for Team Selection</h3>
              <p>Each player has a value based on their real-life performance. You get a total budget of
                <b> Rs. 9,000,000</b> to build your 11-player team.</p>
            </div>

            <div className="feature-box steps">
              <h3>Steps to Play</h3>
              <ol className="steps-list">
                <li><b>Sign Up/Login:</b> Create an account to start playing.</li>
                <li><b>Select Players:</b> Pick 11 players within your budget.</li>
                <li><b>Earn Points:</b> Your team earns points based on real-match performance.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Play?</h2>
          <p>Join thousands of cricket fans and test your team building skills!</p>
          <Link to="/login" className="cta-button">Login to Start</Link>
          <Link to="/register" className="cta-button secondary">New User? Register</Link>
        </section>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 Spirit11. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;