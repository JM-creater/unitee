import { Outlet } from "react-router"
import { Link } from "react-router-dom"
import logo from "../../assets/images/unitee.png"
import './admin_main.css'


function Admin_Main() {
    return <div className="admin-main">
        <div className="admin-header-container row">
            <header className="admin-header row">
            <Link to='' className="col-md-6">
                    <img className="logo" style={{ paddingLeft:'20px' }} src={ logo }/>
                </Link>
                <div className="col-md-6 admin-header-button-container">
                    <a className="admin-dropdown-nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false">Users</a>
                    <ul className="admin-dropdown-menu dropdown-menu">
                    <li><Link className="admin-nav-link" to='add_supplier' >
                    <span className="admin-nav-btn">Suppliers</span>
                    </Link></li>
                    <li><Link className="admin-nav-link" to='view_customers'>
                    <span className="admin-nav-btn">Customers</span>
                    </Link></li>
                    </ul>
                    
                    <Link className="admin-nav-link" to='orders'>
                    <span className="admin-nav-btn">Orders</span>
                    </Link>
                    <Link className="admin-nav-link" to='shop'>
                    <span className="admin-nav-btn">Report</span>
                    </Link>
                    <Link className="admin-nav-link" to='/'>
                    <span className="admin-nav-btn">Logout</span>
                    </Link>
                </div>
            </header>
            <div style={{ minHeight: '100%' }}>
                <Outlet/>
            </div>

        </div>

    </div>
}

export default Admin_Main