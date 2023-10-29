import unauthorizedImg from "../../assets/images/error 401.png"
import './unauthorized_error.css'

function Unauthorized_Error () {
    return <div className="unauthorized-main-container">
        <img className="imgUnauthorized" src={ unauthorizedImg }/>
    </div>
}

export default Unauthorized_Error