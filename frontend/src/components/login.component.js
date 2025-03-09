import React, { Component } from 'react';
import './login.component.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;

    fetch('http://localhost:4000/login-user', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          alert('Login successful');
          window.localStorage.setItem('token', data.token);
          window.localStorage.setItem('loggedIn', true);
          window.location.href = './userDetails';
        } else if (data.error === 'Incorrect password') {
          alert('Password is incorrect');
        } else if (data.error === 'Username not found') {
          alert('Username does not exist');
        } else {
          alert('Login failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Log In</h3>

        <div className="mb-3">
          <label>Username </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            onChange={(e) => this.setState({ username: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        {/* Remember Me checkbox aligned properly */}
        <div className="mb-3 remember-me">
          <input type="checkbox" id="customCheck1" />
          <label htmlFor="customCheck1">Remember me</label>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>

        <p className="signup-link">
          Don't have an account? <a href="./sign-up">Sign up here</a>
        </p>
      </form>
    );
  }
}
