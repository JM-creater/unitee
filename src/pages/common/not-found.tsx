import notFoundImg from "../../assets/images/notFoundImg.png"
import './not-found.css'

function NotFound() {
    return <div className="not-found-main-container">
    <img className="notFound-img" src={ notFoundImg }/>
    <h1 className="notFound-text">Page Not Found</h1>
</div>
}

export default NotFound