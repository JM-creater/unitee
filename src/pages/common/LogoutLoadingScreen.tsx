import '../common/LoadingScreen.css'
import LoadingGif from '../../assets/images/icons/loadingscreen2.svg'
import SuccessfulGif from '../../assets/images/icons/successfulLogin.svg'
import logo from "../../assets/images/unitee.png"
import { useEffect, useState } from 'react';

function LogoutLoadingScreen(){

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowSuccess(true);
            setTimeout(() => {
                const loadingScreenElement = document.querySelector(".loading-screen") as HTMLElement;
                if (loadingScreenElement) {
                    loadingScreenElement.style.opacity = '0';
                }
            }, 3000); 
        }, 5000); 
    }, []);

    return (
        <div className="loading-screen">
            <div className='loading-logo'>
                <img src={logo} alt="logo" />
            </div>
            {!showSuccess ? (
                <>
                    <img className='loading-bar' src={LoadingGif} />
                    <p className='loading-message-logginIn'>Logging Out...</p>
                </>
            ) : (
                <>
                    <img className='gif-size' src={SuccessfulGif} />
                    <p className='loading-message-successful'>Successfully Logged Out</p>
                </>
            )}
        </div>
    )
}

export default LogoutLoadingScreen