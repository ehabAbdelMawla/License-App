import React, { Component } from 'react';
import Firebase from "./fireBaseConfiquration/config";
import Login from "./Components/login/login"
import Programs from "./Components//programs/programs"
import ProgramDetails from "./Components//ProgramDetails/Programdetails"
import PreLoader from './Components/preloader/PreLoader'
import './style/light.scss';
import { connect } from 'react-redux'
import {
  HashRouter as BrowserRouter,
  Route, withRouter
} from "react-router-dom";
import { getSoftwares, getTokens } from './operations'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastDesign from './Components/Toast'
// Android (Capacitor) 
import { Plugins } from '@capacitor/core';
import { FCM } from '@capacitor-community/fcm';
const { PushNotifications, App } = Plugins;


class AppComponent extends Component {

  componentWillMount = () => {
    //  Listner to Authentication
    toast.configure()
    Firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.props.history.push('/programs');
        this.props.setUser(user);
         await Firebase.database().ref().child("/").on('value', async () => { this.props.loadSoftwares(await getSoftwares()) });
        
   
          this.messageSetUpForAndroid();
          // this.messageSetUPForWeb();
       
      } else {
        this.props.setUser(null);
      }
    });
  }
  showToast = (data, positionText) => {
    toast.dark(data, {
      position: positionText,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      pauseOnFocusLoss: false,
    });
  }

  messageSetUpForAndroid() {
    const fcm = new FCM();
    PushNotifications.register()
      .then(() => {
        //
        // Get FCM token instead the APN one returned by Capacitor
        fcm
          .getToken()
          .then(async (result) => {
                const tokens=await getTokens();
                let userTokens=[result.token];
                if(tokens&&tokens[Firebase.auth().currentUser.uid]){
                  userTokens.push(...tokens[Firebase.auth().currentUser.uid])
                }
                const newTokens=[...new Set(userTokens)]          
                this.props.setToken(result.token);
                Firebase.database().ref(`/tokens/${Firebase.auth().currentUser.uid}`).set(newTokens);

          })
          .catch((err) => console.log(err));

      })
      .catch((err) => alert(JSON.stringify(err)));

    PushNotifications.addListener('pushNotificationReceived', (notification) => {

      this.showToast(<ToastDesign notification={notification} />, "top-right")
    })

  }




  messageSetUPForWeb = () => {
    // Notification parts
    const messaging = Firebase.messaging();
    messaging.requestPermission().then(_ => {
      return messaging.getToken({ vapidKey: `BIzDAOBDxiS8uENrGgu-5hLP3ZZReGhttgQR4VrAvXnFAd61wAaADNs08qBhOjlNicbRuGMWAv3QGMnFFoVpvIU` });
    }).then(async token => {
      const tokens=await getTokens();
      let userTokens=[token];
      if(tokens&&tokens[Firebase.auth().currentUser.uid]){
        userTokens.push(...tokens[Firebase.auth().currentUser.uid])
      }
     
    const newTokens=[...new Set(userTokens)]
   
      Firebase.database().ref(`/tokens/${Firebase.auth().currentUser.uid}`).set(newTokens);
      this.props.setToken(token);
      messaging.onMessage((payload) => {
        this.showToast(<ToastDesign {...payload} />, "bottom-right")
      });
    }).catch((error) => {
      console.log("User didn't git a Permision :( ", error)
    });
  }


  render() {
    // Android (Capacitor) 
    document.addEventListener("backbutton", async function (e) {
      const path = window.location.hash;
      if (path === "#/" || path === "#/login" || path === "#/programs") {
        App.exitApp();
      }
      else {
        window.history.back();
      }
    });
    try {
    
      PushNotifications.removeAllDeliveredNotifications();
    
    }
    catch (error) {
      //no thing
    }
    // ==============================================================


    return (

      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={PreLoader} />
          <Route path="/login" component={Login} />
          <Route path="/programs" component={Programs} />
          <Route path="/programDetails/:softwareName" component={ProgramDetails} />
        </div>
      </BrowserRouter>
    );
  }

}
const mapDispatchTpProps = (dispatch) => {
  return {
    setUser: (user) => dispatch({ type: "SET_USER", currentUser: user }),
    setToken: (token) => dispatch({ type: "SET_TOKEN", token })
    , loadSoftwares: (softwares) => dispatch({ type: "SET_SOFTWARES", softwares: softwares })
  }

}


export default withRouter(connect(null, mapDispatchTpProps)(AppComponent));