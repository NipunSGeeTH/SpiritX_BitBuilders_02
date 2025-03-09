# SpiritX_BitBuilders_02

<h1>🏏 Fantasy Cricket League - BitBuilders</h1>
  <p>A full-stack web application built using <strong>MERN Stack (MongoDB, Express, React, Node.js)</strong> where users can build their fantasy cricket team, manage their budget, and compete on the leaderboard based on real player performance.</p>

  <h2>🚀 Features</h2>
  <ul>
    <li>User Registration and Login</li>
    <li>Admin and User Role Handling</li>
    <li>Player Selection with Budget Constraint</li>
    <li>Budget View and Management</li>
    <li>Leaderboard System</li>
    <li>Admin Dashboard</li>
    <li>Home Page with Slideshow and Info</li>
    <li>Fully Integrated Frontend and Backend</li>
  </ul>

  <h2>🧠 Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React.js (React Router, Context API)</li>
    <li><strong>Backend:</strong> Node.js + Express.js</li>
    <li><strong>Database:</strong> MongoDB (Mongoose)</li>
    <li><strong>Styling:</strong> CSS, Custom Stylesheets</li>
    <li><strong>Authentication:</strong> JWT Token Based Auth</li>
  </ul>

  <h2>📁 Folder Structure</h2>
  <pre>
/client             → React Frontend
/server             → Node.js + Express Backend
    /models         → Mongoose Schemas
    /routes         → Auth, Users, Players, Admin, etc.
    /controllers    → Business Logic
/public             → Static Files (images, index.html, etc.)
  </pre>

  <h2>⚙️ Installation Guide</h2>

  <h3>🔧 Backend Setup</h3>
  <pre>
cd server
npm install
  </pre>

  <p>Create a <code>.env</code> file inside <code>/server</code> with the following:</p>
  <pre>
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
  </pre>

  <h3>▶️ Start Backend Server</h3>
  <pre>
npm start
  </pre>

  <h3>💻 Frontend Setup</h3>
  <pre>
cd client
npm install
  </pre>

  <h3>▶️ Start Frontend Dev Server</h3>
  <pre>
npm start
  </pre>
  <p>React will run on <code>http://localhost:3000</code></p>

<h3> admin panel :
  username: sangeeth </br>
  password: 12345Aa@ </h3>
  <h2>🛡 Authentication Flow</h2>
  
  <ul>
    <li>JWT tokens stored in <code>localStorage</code></li>
    <li>Auto-login on page refresh if token is valid</li>
    <li>Role-based route redirection for Admin and User</li>
  </ul>

  <h2>📊 Points System (Game Logic)</h2>
  <table>
    <thead>
      <tr>
        <th>Action</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Run Scored</td>
        <td>1 point per run</td>
      </tr>
      <tr>
        <td>Wicket Taken</td>
        <td>25 points</td>
      </tr>
      <tr>
        <td>Catch Taken</td>
        <td>10 points</td>
      </tr>
      <tr>
        <td>Bonus (Century)</td>
        <td>50 points</td>
      </tr>
    </tbody>
  </table>

  <h2>📷 Home Page Overview</h2>
  <ul>
    <li>Welcome Message</li>
    <li>Slideshow of Match Images</li>
    <li>How to Play Guide</li>
    <li>Game Rules & Budget</li>
    <li>Navigation Links</li>
  </ul>

  <h2>✨ Future Enhancements</h2>
  <ul>
    <li>Real-time match integration using APIs</li>
    <li>Dynamic player statistics</li>
    <li>Mobile-friendly UI</li>
    <li>Email verification system</li>

    
  </ul>

 

  <h2>🤝 Contributing</h2>
  <ol>
    <li>Fork this repo</li>
    <li>Clone it: <code>git clone https://github.com/your-username/your-repo-name.git</code></li>
    <li>Create your branch: <code>git checkout -b feature/awesome-feature</code></li>
    <li>Commit and Push</li>
    <li>Open a Pull Request 🚀</li>
  </ol>

  <h2>📬 Contact</h2>
  <ul>
    <li>Email: <code>your-email@example.com</code></li>
    <li>GitHub: <a href="https://github.com/your-github-username" target="_blank">your-github-username</a></li>
  </ul>

  <h2>📄 License</h2>
  <p>This project is licensed under the MIT License.</p>

  <div class="footer">
    <p>Made with ❤️ by <strong>BitBuilders - University of Moratuwa</strong></p>
  </div>
