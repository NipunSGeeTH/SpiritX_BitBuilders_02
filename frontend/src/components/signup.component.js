import React, { Component } from "react";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernameValid: false,
      usernameError: "",
      password: "",
      confirmPassword: "",
      passwordValid: false,
      passwordsMatch: true,
      passwordError: [],
      registrationSuccess: false,
    };
  }

  // ✅ Username Validation
  validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{8,}$/; // Only letters, numbers, and _
    if (!usernameRegex.test(username)) {
      return "Username must be at least 8 characters, no spaces, only letters, numbers, and '_'";
    }
    return "";
  };

  handleUsernameChange = (e) => {
    const username = e.target.value; // Convert to lowercase
    const errorMessage = this.validateUsername(username);
    this.setState({
      username,
      usernameValid: errorMessage === "",
      usernameError: errorMessage,
    });
  };

  // ✅ Password Validation
  validatePassword = (password) => {
    let errors = [];

    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[\W_]/.test(password)) errors.push("one special character");
    if (password.length < 8) errors.push("at least 8 characters");

    return errors;
  };

  handlePasswordChange = (e) => {
    const password = e.target.value;
    const errors = this.validatePassword(password);

    this.setState({
      password,
      passwordValid: errors.length === 0,
      passwordError: errors,
    });
  };

  handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    this.setState({
      confirmPassword,
      passwordsMatch: confirmPassword === this.state.password,
    });
  };

  // ✅ Handle Form Submit
  handleSubmit = (e) => {
    e.preventDefault();

    const { username, password,  passwordValid, passwordsMatch } = this.state;

    if (!passwordValid) return;
    if (!passwordsMatch) return;

    fetch("http://localhost:4000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ registrationSuccess: true });
          setTimeout(() => {
            window.location.href = "./sign-in";
          }, 2000);
        } else if (data.error === "Username already exists") {
          alert("Registration failed. Username already exists.");
        }
        
        else {
          alert("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  render() {
    const { password, confirmPassword, passwordValid, passwordsMatch, passwordError, usernameValid, usernameError } = this.state;

    return (
      <div>
        {/*screen success message */}
        {this.state.registrationSuccess ? (
          <div style={{
            position: "fixed",
          
            width: "30%",
            height: "30%",
            backgroundColor: "rgba(137, 255, 2, 0.93)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 9999
          }}>
            Successfully Registered! Redirecting...
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <h3>Sign Up</h3>

            {/* ✅ Username Field */}
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                onChange={this.handleUsernameChange}
              />
              {!usernameValid && this.state.username && (
                <div className="text-danger">{usernameError}</div>
              )}
            </div>

            {/* ✅ Password Field */}
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={this.handlePasswordChange}
              />
              {password && !passwordValid && (
                <div className="text-danger">
                  Password must include: {passwordError.join(", ")}
                </div>
              )}
            </div>

            {/* ✅ Confirm Password Field */}
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                onChange={this.handleConfirmPasswordChange}
              />
              {!passwordsMatch && confirmPassword && (
                <div className="text-danger">Passwords do not match</div>
              )}
            </div>

            {/* ✅ Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={!passwordValid || !passwordsMatch || !usernameValid}>
                Sign Up
              </button>
            </div>

            <p className="forgot-password text-right">
              Already registered? <a href="/sign-in">Sign in</a>
            </p>
          </form>
        )}
      </div>
    );
  }
}
