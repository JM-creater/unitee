import './forgot_password.css'
import studentImg from '../../src/assets/images/forgot-pass-student-img.png'
import submitIcon from "../../src/assets/images/icons/arrow.png"
import backIcon from "../../src/assets/images/icons/back-2.png"
import uniteeLogo from "../../src/assets/images/unitee.png"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import React from 'react'
import LoadingGif from '../assets/images/icons/loadingscreen.svg'

function Forgot_Password () {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        setResetToken(token);
    }, [location]);

    // * Reset Password 
    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch('https://localhost:7017/Users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Token: resetToken, NewPassword: newPassword }),
            });
        
            if (response.ok) {
                toast.success("Successfully updated the password");
                await sleep(10000);
                navigate('/');
            } else {
                toast.error("Failed to update the password");
            }
        } catch (error) {
            toast.error("An error occurred");
            console.error(error);
        }
        setIsLoading(false);
    };


    return (
        <React.Fragment>
        {isLoading ? (
            <div className="mainloading-screen">
                <img className='mainloading-bar' src={LoadingGif} alt="loading..." />
            </div>
        ) : (
            <div className="forgot-pwd-main-container">
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
    
                    {/* NEW PASSWORD */}
                    <label htmlFor="forgot-password">New Password</label>
                    <input 
                        className='forgot-form-input' 
                        placeholder='Enter your new password' 
                        type="password" 
                        name="forgot-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
    
                    {/* CONFIRM PASSWORD */}
                    <label htmlFor="forgot-password">Confirm Password</label>
                    <input 
                        className='forgot-form-input' 
                        placeholder='Enter your confirm password' 
                        type="password" 
                        name="forgot-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
    
                    <div className='col-md-7 forgot-form-btn-container'>
                        <Link className='forgot-to-login' to="/">
                            <button className='forgot-form-cancel-btn'>
                                <img className='forgot-btn-icons' src={ backIcon }/>
                                Back</button>
                        </Link>
                        <button className='forgot-form-submit-btn' onClick={handleSubmit}>
                            <img className='forgot-btn-icon-submit' src={ submitIcon }/>
                            Submit
                        </button>
                    </div>
            </div>
            <img className='studentImg' src={ studentImg }/>
        </div>
        )}
        </React.Fragment>
    )
}

export default Forgot_Password