import { Outlet } from "react-router"
import { Link } from "react-router-dom"
import logo from "../../assets/images/unitee.png"
import dashboardAdminIcon from "../../assets/images/icons/dashboard.png"
import adminIcon from "../../assets/images/icons/software-engineer.png"
import './admin_main.css'
import usersIcon from "../../assets/images/icons/profile.png"
import adminReportsIcon from "../../assets/images/icons/reports.png"
import productsIcon from "../../assets/images/icons/product.png"
import logoutAdminIcon from "../../assets/images/icons/logout-4.png"


function Admin_Main() {
    return <div className="admin-main-container">
        <header className="admin-header">
            <Link to='' className="col-md-12 admin-home-btn">
                <div className="adminLogo-container">
                    <img className="adminIcon" src={ adminIcon }/>
                    <img className="unitee-logo-admin" src={ logo }/>
                </div>
            </Link>

            <div className="admin-nav-bar">
                <Link to='' className="admin-nav-link">
                    <img className="admin-nav-icon" src={ dashboardAdminIcon }/>
                    <span className="admin-nav-text">Dashboard</span>
                </Link>

                <Link className="admin-nav-link" to=''>
                <img className="admin-nav-icon" src={ productsIcon }/>
                    <span className="admin-nav-text">Products</span>
                </Link>

                <div className="admin-nav-link"
                data-bs-toggle="collapse"
                href="#usersTypeCollapse" 
                role="button" aria-expanded="false" 
                aria-controls="usersTypeCollapse">
                    <img className="admin-nav-icon" src={ usersIcon } alt="" />
                    <span className="users-type-collapse">
                    Users
                    </span>
                </div>

                <div className="collapse" id="usersTypeCollapse">
                    <div className="users-collapse-container" 
                    style={{ backgroundColor:'#020654' }}>
                        <Link className="admin-collapse-users-link" to='view_customers'>
                            <span className="admin-nav-text-collapse">Customers</span>
                        </Link>
                        <Link className="admin-collapse-users-link" to='suppliers'>
                            <span className="admin-nav-text-collapse">Suppliers</span>
                        </Link>
                    </div>
                </div>
                

                <Link className="admin-nav-link" to=''>
                <img className="admin-nav-icon" src={ adminReportsIcon }/>
                    <span className="admin-nav-text">Reports</span>
                </Link>
            </div>
        </header>

        <div style={{ minHeight:'100%' }}>
            <div className="admin-second-nav-container">

                <div className="search-container-admin">
                    <span className="fa fa-search form-control-feedback search-icon"></span>
                    <input className="Supplier-SearchBar" type="text" placeholder="Search" />
                </div>

                <div>
                    <Link to='/'>
                        <button className="admin-logout-btn">
                            <img className="logout-admin-icon" src={ logoutAdminIcon } alt="" />
                            logout
                        </button>
                    </Link>
                </div>
            </div>
            <Outlet/>
        </div>
    </div>
}

export default Admin_Main