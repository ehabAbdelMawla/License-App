import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import logo from '../../images/logo.png'
class PreLoader extends Component {


    render() {
        if (this.props.user) {
            return <Redirect to={'/programs'} />

        } else if (this.props.user === null) {
            return <Redirect to={'/login'} />
        }

        else {
            return (
                <section className="loaderScreen">
                    <img src={logo} alt="code clinic logo" />
                    <Loader
                        type="ThreeDots"
                        color="#b79621"
                        height={100}
                        width={100}
                        timeout={100000000} //3 secs

                    />
                </section>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.currentUser,
    }
}
export default connect(mapStateToProps)(PreLoader);