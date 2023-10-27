import './internal_error.css'
import internalErrorImg from '../../assets/images/internal-error.png'

function Internal_Error () {
    return <div className='internal-error-main-container'>
        <img className='internalErrorImg' src={ internalErrorImg }/>
        <h1 className='error-title'>500 Internal Server Error</h1>
        <span className='int-error-message'>The server encountered an internal error or misconfiguration and was unable to complete your request.</span>
    </div>
}

export default Internal_Error