import { Outlet } from "react-router"
import { Link } from "react-router-dom"
import logo from "../../assets/images/unitee.png"
import profile from "../../assets/images/imageprofile.jpeg"
import logout from "../../assets/images/icons/logout-3.png"
import profIcon from "../../assets/images/icons/profile2.png"
import './supplier_main.css'

function Supplier_Main (){
    return <div className="supplier-main">
    <div className="supplier-nav-container">
        <header className="supplier-header">
            <Link to='' className="col-md-2">
                <img className="logo" src={ logo }/>
            </Link>
            <div className="col-md-6 header-button-container">
                <Link className="customer-nav-link" to='manage_prod'>
                    <span className="nav-btn">SHOP</span>
                </Link>
                <Link className="customer-nav-link" to='cart'>
                    <span className="nav-btn">ORDERS</span>
                </Link>

                <div className="col-md-1 dropdown">

                <img src={ profile } style={{ width:'90%', borderStyle:'solid', borderRadius:'50%', borderColor:'#D3D3D3' }} data-bs-toggle="dropdown" aria-expanded="false" />
                <ul className="dropdown-menu dropdown-menu-dark" style={{ width:'300px'}}>
                    <Link className="customer-nav-droplink" to='user_profile'>
                    <li><a className="dropdown-item">
                    <img className="dropdown-icon"  src={ profIcon } />VIEW PROFILE</a></li></Link>

                    <Link className="customer-nav-droplink" to='/'>
                    <li><a className="dropdown-item">
                    <span className="nav-btn" style={{ color:'#FFAA00' }}>
                        <img className="dropdown-icon" src={ logout } />
                        LOGOUT</span>
                </a></li></Link>
                    
                </ul>

                </div>
                
            </div>
        </header>
        <div style={{ minHeight: '100%' }}>
            <Outlet/>
        </div>

    </div>
    </div>
}

export default Supplier_Main