import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import Firebase from '../../fireBaseConfiquration/config'
import Loader from 'react-loader-spinner'
import {getTokens} from "../../operations"
// Android (Capacitor) 
import { Plugins } from '@capacitor/core';
const { PushNotifications } = Plugins;
class Programs extends Component {


    logout = async() => {
        /* Remove Token When Logout */
        let tokens= await getTokens();
        let userToken=tokens[Firebase.auth().currentUser.uid]
        userToken=userToken.filter(token=>token !=this.props.token )
        Firebase.database().ref(`/tokens/${Firebase.auth().currentUser.uid}`).set(userToken);



        Firebase.auth().signOut()
        this.props.resetToken();
    }
    render() {
        if (!this.props.user) {
            return <Redirect to={'/login'} />
        }
        // Android(Capacitor)
        try {
            PushNotifications.removeAllDeliveredNotifications();
        }
        catch (error) {
            //no thing
        }

        let isMobile = false;
        if (/Android/i.test(navigator.userAgent)) {
            console.log("Mobile")
            // isMobile = true;
        }

        return (
            <div className="Programs-Container ">
                <div className="imageContainer">
                    <img src={logo} alt="code clinic logo wow fadeIn" />
                </div>
                <h1>Code Clinic Softwares</h1>
                { this.props.softwares ? Object.keys(this.props.softwares).length > 0 ? <div className="programsBoxesContainer">
                    {
                        Object.keys(this.props.softwares).map(softwareName => {
                            return (
                                <Link key={softwareName} className="programName wow fadeInDown" to={`/programDetails/${softwareName}`} >
                                    {softwareName}
                                    <section className="wow fadeInDown" ><div><p>{Object.keys(this.props.softwares[softwareName]).length}</p></div></section>
                                </Link>
                            )
                        })
                    }
                </div> : <h1>No Softwares </h1> : <Loader
                    type="ThreeDots"
                    color="#b79621"
                    height={100}
                    width={100}
                    timeout={30000} //3 secs

                />}
                <a style={{ display: isMobile ? "inline-block" : "none" }} className="downloadApp" title="Download Android App" href="./app.apk" download><i className="fa fa-mobile"></i></a>
                <i onClick={this.logout} title="Logout" className="logoutIcon fa fa-sign-out"></i>
            </div >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.currentUser,
        token: state.token,
        softwares: state.softwares
    }
}
const mapDispatchTpProps = (dispatch) => {
    return {
      resetToken: () => dispatch({ type: "SET_TOKEN", token:'' })
    }
  }
export default connect(mapStateToProps,mapDispatchTpProps)(Programs);