import React from 'react'
import logo from '../images/logo.png'
const ToastDesign = ({ notification }) => {
   
    return (
        <div className="toast_container">
            <img src={logo} alt="program icon" />
            <div>
               <p>{notification.title}</p>
               <p>{notification.body}</p>
              
            </div>
        </div>
    )
}

export default ToastDesign