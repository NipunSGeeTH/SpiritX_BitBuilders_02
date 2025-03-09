import React, { Component } from "react";
import './userDetails.css';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,  // Initially null, will be populated after fetching
      loading: true,   // Loading state to show until data is fetched
      error: "",       // To handle any errors during the fetch
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "./sign-in";
    } else {
      fetch("http://localhost:4000/userData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            this.setState({ userData: data.data, loading: false });
          } else {
            this.setState({ error: data.message, loading: false });
            window.location.href = "./sign-in"; // Redirect to login on invalid token
          }
        })
        .catch((error) => {
          this.setState({ error: "Error fetching user data", loading: false });
        });
    }
  }
  

  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  render() {
    const { userData, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <span>
        <h1> Hello ! </h1>
        </span>
        <div className="username">
           {userData.username}
        </div>
        <br />
        <button onClick={this.logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    );
  }
}
