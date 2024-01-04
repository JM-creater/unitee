import './supplier_main.css'
import { Outlet, useNavigate } from "react-router"
import logo from "../../assets/images/unitee.png"
import { Link } from "react-router-dom"
import ordersSupplierIcon from "../../assets/images/icons/orders.png"
import dashboardSupplierIcon from "../../assets/images/icons/dashboard.png"
import supplierReportsIcon from "../../assets/images/icons/reports.png"
import shopIcon from "../../assets/images/icons/store-2.png"
import editprof from "../../assets/images/icons/user-avatar.png"
import logoutIcon from "../../assets/images/icons/logout-4.png"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import notifEventEmitter from '../../helpers/NotifEventEmitter'
import React from 'react'
import LogoutLoadingScreen from '../common/LogoutLoadingScreen'
import { useAuth } from '../../utils/AuthContext'

function Supplier_Main (){

    interface Supplier {
        image: string;
    }

    const [notifItem, setNotifItem] = useState([]);
    const [supplier, setSupplier] = useState<Supplier | null>(null); 
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { id } = useParams();
    const { setLogout } = useAuth();
    const navigate = useNavigate();

     // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // * Handle Logout Modal
    const HandleLogoutModal = async () => {
        setIsLoggingOut(true);
        setShowLogoutModal(!showLogoutModal);
        await sleep(10000);
        setLogout();
        navigate('/');
    };

    // * Get Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Users/${id}`);
                setSupplier(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers();
    }, [id]);

    // * Update Notification
    const updateNotification = useCallback(() => {
        const fetchNotification = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Notification/supplierUnread/${id}`);
                setNotifItem(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchNotification();
    }, [id]);

    // * Event Emitter for notification
    useEffect(() => {  
        notifEventEmitter.on("notifNewOrderAdded", updateNotification);
        updateNotification();
    
        return () => {
            notifEventEmitter.off("notifNewOrderAdded", updateNotification);
        };
    }, [id, updateNotification]);

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`https://localhost:7017/Notification/supplierUnread/${id}`);
            setNotifItem(response.data);
        } catch (error) {
            console.error('Network error or server not responding');
        }
        };

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [id]); 

    // * Mark as Read Supplier in Notification
    const handleNotificationClick = () => {
        const fetchNotificationClick = async () => {
            try {
                await axios.post(`https://localhost:7017/Notification/markReadSupplier/${id}`);
                updateNotification();
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotificationClick();
    };

    return (
        <React.Fragment>
            {isLoggingOut ? (
                <React.Fragment>
                    <LogoutLoadingScreen/>
                </React.Fragment>
            ) : (
            <div className="supplier-main">
                <header className="supplier-header">
                    <Link to='' className="col-md-12 supplier-home-btn">
                            <img className="Supplierlogo" src={ logo }/>
                    </Link>


                    <div className="supplier-nav-bar">
                        <Link to='' className="supplier-nav-link">
                            <img className="supplier-nav-icon" src={ dashboardSupplierIcon }/>
                            <span className="supplier-nav-text">Dashboard</span>
                        </Link>
                        <Link to='supplier_orders' className="supplier-nav-link" onClick={handleNotificationClick}>
                            <img className="supplier-nav-icon" src={ ordersSupplierIcon }/>
                            <span className="supplier-nav-text">Orders {notifItem.length > 0 && <span className='notifOrder-count'>{notifItem.length}</span>}</span>
                        </Link>
                        <Link to='manage_shop' className="supplier-nav-link">
                            <img className="supplier-nav-icon" src={ shopIcon }/>
                            <span className="supplier-nav-text">Shop</span>
                        </Link>
                        <Link to='reports' className="supplier-nav-link">
                            <img className="supplier-nav-icon" src={ supplierReportsIcon }/>
                            <span className="supplier-nav-text">Reports</span>
                        </Link>
                    </div>
                </header>
                <div style={{ minHeight: '100%' }}>
                    
                    <div className="second-nav-container">

                        <div className="search-container"></div>
                        {supplier && (
                            <React.Fragment>
                                <img 
                                    className="seller-profile" 
                                    src={ `https://localhost:7017/${supplier.image}` } 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false"
                                />
                            </React.Fragment>
                        )}

                        <ul className="dropdown-menu" style={{ padding:'10px', width:'15rem' }}>
                            <Link to={`supplier_viewProf/${id}`}>
                                <li className="drop-list">
                                    <a className="dropdown-item supplier-drop-item" style={{ fontSize:'15px' }}>
                                        <img className="drop-icon" src={ editprof }/>
                                        View Profile
                                    </a>
                                </li>
                            </Link>
                            
                            <li className="drop-list">
                                <a className="dropdown-item supplier-drop-item" data-bs-toggle="modal" data-bs-target="#logoutModal" style={{ fontWeight:'600', fontSize:'15px' }}>
                                    <img className="drop-icon-logout" src={ logoutIcon }/>
                                    Log Out
                                </a>
                            </li>  
                        </ul>
                    </div>

                    <div className='modal fade' id="logoutModal" tabIndex={1} aria-labelledby="logoutModalLabel" aria-hidden={!showLogoutModal}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="logout-confirmation-modalBody">
                                    <h3>Are you sure you want to logout?</h3>
                                    <div className="col-md-12 logout-btn-container">
                                        <button className="logout-btn" data-bs-dismiss="modal" onClick={HandleLogoutModal}>Log Out</button>
                                        <button className="cancel-logout-btn" data-bs-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Outlet/>
                </div>
            </div>
            )}
        </React.Fragment>
    )
}

export default Supplier_Main