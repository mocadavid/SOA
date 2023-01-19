import './App.css';
import React from 'react';
import LoginSection from './LoginSection';
import io from 'socket.io-client';

const FlightsSection = React.lazy(
  () => import('Flights/FlightsSection')
);

const error = 'Internal server error';
const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjV3TUFGa1c5Q19BeF9mLTF0dXZDQSJ9.eyJpc3MiOiJodHRwczovL2Rldi11azlvenAwNS51cy5hdXRoMC5jb20vIiwic3ViIjoiY3FUbTR6MmlqaGM0VjNEaGRnbFBOWXVpbE85RDUzSEFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLWdhdGV3YXk6ODA5NCIsImlhdCI6MTY3Mzk2NTE5NSwiZXhwIjoxNjc2NTU3MTk1LCJhenAiOiJjcVRtNHoyaWpoYzRWM0RoZGdsUE5ZdWlsTzlENTNIQSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Js57BDgp7Ppy4wI6nRo7RqkYFhsu04Ge0y_o5BUHYSC_XcxTKgluecioLv6G-0zICtwR2tOwBw8cLJCRFXBw5Ujp9Bj4ecnqYsr0nT_4frlf5giHdesicjD8ObFQf8P-r4Tf5zMlncAUYUOSghvmNJkHkTW_pT0zCYToVJWmYaUFpUcyXUBuXqPRob-ldBQTSVET9LV-aV3O1V_qvI_XpnDnga2mwf9QyH3KdbuqIdqmIrCzMWmbqhn2wxLD72Ju4VZXtdSD_pZVScx74oXn1dqhfOZbsjoDl_UBBByYVlVNvbEpFpdgxrCjceybyzpAEbizmP3oho8VkwrBjNEQPA';

const socket = io('http://localhost:8094');
socket.on('message',(message) => {
  console.log(message);
});
socket.on('numberOfUsers',(message) => {
  console.log(`Users currently using the app: ${message}`);
});

class App extends React.Component {
  state = {
    isLoggedIn: false
  };
  username = '';

  loginSuccess = () => {
    console.log('login success');
    this.setState({ isLoggedIn: true });
    console.log(this.state);
  }

  setCurrentUsername = (username) => {
    this.username = username;
    console.log(`username set to: ${this.username}`);
    console.log(this.state);
  }

  logout() {
    console.log('logout');
    const url_api = 'http://localhost:8094/access/logout';
    console.log(`sending request: ${url_api}`);

    fetch(url_api,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            "username": this.username
        })
    }).then(response => response.json())
    .then(data => {
        const api_error = data.error;
        if(typeof api_error == 'undefined'){
            console.log("Logout success.");
            this.username = '';
            this.setState({ isLoggedIn: false });
        } else {
            console.log(api_error);
            alert(api_error);
        }
    }).catch((err) => {
        console.log(`Error API call: ${err}`);
        alert(error);
    });
  }

  sendMail() {
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;

    if (email === '' || name === ''){
        alert('Invalid data.');
    } else {
        // perform fetch for login
        const url_api = 'http://localhost:8094/access/mail';
        console.log(`sending request: ${url_api}`);
        
        fetch(url_api,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                "email": email,
                "name": name
            })
        }).then(response => response.json())
        .then(data => {
            const api_error = data.error;
            if(typeof api_error == 'undefined'){
                console.log("Mail sent.");
                alert("The mail was sent.");
            } else {
                console.log(api_error);
                alert(api_error);
            }
        }).catch((err) => {
            console.log(`Error API call: ${err}`);
            alert(error);
        });
    }
  }

  render() {
    console.log("render() method");
    console.log(this.state);
    const { isLoggedIn } = this.state;
    let currentComponent;

    const loginDiv = {
      margin: "auto",
      width: "50%",
      border: ".3rem solid #345728",
      borderRadius: "1rem",
      padding: "10px"
    };
    const loginInputDiv = {
      margin: "auto",
      width: "60%"
    };
    const loginInput = {
      width: "100%",
      padding: "12px 20px",
      margin: "8px 0",
      display: "inline-block",
      border: "1px solid #63532a",
      borderRadius: "4px",
      boxSizing: "border-box"
   };
    const button = {
      width: "100%",
      backgroundColor: "#345728",
      color: "white",
      padding: "14px 20px",
      margin: "8px 0",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    };

    if (isLoggedIn) {
      currentComponent = 
      <div>
        <div style={loginDiv}>
          <div style={loginInputDiv}>
            <h1>The flight management section</h1>
          </div>
          <div style={loginInputDiv}>
            <p>Logged in user: {this.username}</p>
            <button style={button} onClick={() => this.logout()}>Logout</button>
          </div>
        </div>
        <div style={loginDiv}>
          <div style={loginInputDiv}>
            <h3>Enter the email address and a name to get a message.</h3>
          </div>
          <div style={loginInputDiv}>
            <label htmlFor="email">Email address:</label>
            <input id="email" type="text" style={loginInput}></input><br/>
          </div>
          <div style={loginInputDiv}>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" style={loginInput}></input><br/>
          </div>
          <div style={loginInputDiv}>
              <button  style={button} onClick={() => this.sendMail()}>Send mail</button>
            </div>
        </div>
        
        <React.Suspense 
        fallback='Loading Button'>
          <FlightsSection 
            username={this.username}
            token={token}/>
      </React.Suspense>
      </div>;

    } else {
      currentComponent = 
      <LoginSection 
        loginSuccess={this.loginSuccess} 
        setUser={this.setCurrentUsername}
        token={token}>
      </LoginSection>;
    }

    return (
      <div>
        {currentComponent}
      </div>
    );
  }
}

export default App;
