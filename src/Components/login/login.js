import React, { Component } from 'react';
import Firebase from '../../fireBaseConfiquration/config'
import swal from "sweetalert"
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import logo from '../../images/logo.png'
class Login extends Component {

  state = {
    email: '',
    password: ''
  };
  setEmail = (event) => {
    this.setState({
      email: event.target.value
    });
  }
  setPassword = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  loginAction = async (event) => {
    event.preventDefault();

    if (this.state.email.trim() === "" || this.state.password.trim() === "") {
      swal("InComplete Data", {
        icon: "error",
      })
      return;
    }


    var emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(this.state.email.trim())) {
      swal("Invalid Email", {
        icon: "error",
      })
      return;
    }
    try {
       await Firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password.trim());
    }
    catch (error) {
      var errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        swal("You are not Authenticated", {
          icon: "error",
        })
      }
      else if (errorCode === "auth/wrong-password") {
        swal("Incorrect password", {
          icon: "error",
        })
      }
    }





  }

  render() {
    if (this.props.user) {
      return <Redirect to={'/programs'} />
    }

    return (
      <div className="login wow  fadeInUp">
        <div> <img src={logo} alt="code clinic logo" /></div>
        <form onSubmit={this.loginAction}>
          <input type="text" value={this.state.email} onChange={this.setEmail} placeholder="Email" />
          <article className="passwordAndButtonContainer">
            <input type="password" value={this.state.password} onChange={this.setPassword} placeholder="Password" />
            <button type="submit">Login</button>
          </article>
        </form>
      </div>
    );
  }
}

const mapSatteToProps = (state) => {

  return {
    user: state.currentUser
  }
}
export default connect(mapSatteToProps)(Login)