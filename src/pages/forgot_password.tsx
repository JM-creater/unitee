import './forgot_password.css'
import studentImg from '../../src/assets/images/forgot-pass-student-img.png'
import submitIcon from "../../src/assets/images/icons/arrow.png"
import backIcon from "../../src/assets/images/icons/back-2.png"
import uniteeLogo from "../../src/assets/images/unitee.png"
import { Link, useNavigate } from 'react-router-dom';

function Forgot_Password () {
    return <div className="forgot-pwd-main-container">
        <div className="forgot-pwd-subContainer">
            <div className='col-md-12 logo-container-forgotPage'>
                <img className='webLogo' src={ uniteeLogo }/>
            </div>
            <div className='col-md-12 instruction-container'>
                <h1 className='instruction-title'>Don't Worry</h1>
                <span className='forgot-pwd-instruction'>We are here to help you to recover your password.
                </span>
                <span>Enter the ID Number and Email address you used when you registered.</span>
            </div>
            <div className="forgot-pwd-form">
                {/* ID NUMBER */}
                <label htmlFor="forgot-id-num">ID Number</label>
                <input className='forgot-form-input' type="text" placeholder='Enter your ID Number' name='forgot-id-num'/>

                {/* PASSWORD */}
                <label htmlFor="forgot-password">Password</label>
                <input className='forgot-form-input' placeholder='Password must be at least 6 characters long.' type="password" name="forgot-password"/>

                {/* EMAIL */}
                <label htmlFor="forgot-email">Email</label>
                <input className='forgot-form-input' type="email" placeholder='Enter email' name="forgot-email"/>
            </div>
             {/* BUTTONS */}
             <div className='col-md-7 forgot-form-btn-container'>

                    {/* RETURNS THE USER TO THE LOGIN PAGE */}
                    <Link className='forgot-to-login' to="/">
                        <button className='forgot-form-cancel-btn'>
                            <img className='forgot-btn-icons' src={ backIcon }/>
                            Back</button>
                    </Link>
                        {/* SUBMIT BUTTON */}
                    <button className='forgot-form-submit-btn'>
                        <img className='forgot-btn-icon-submit' src={ submitIcon }/>
                        Submit</button>
                </div>
        </div>
        <img className='studentImg' src={ studentImg }/>
    </div>
}

export default Forgot_Password