import '../common/LoadingScreen.css'
import LoadingGif from '../../assets/images/icons/loadingscreen.svg'
//import logo from "../../assets/images/unitee.png"

function LoadingScreen() {
    return (
        <div className="loading-screen">
            {/* <div className='loading-logo'>
                <img src={logo} alt="logo" />
            </div> */}
            <img className='loading-bar' src={LoadingGif} alt="loading..." />
        </div>
    )
}

export default LoadingScreen