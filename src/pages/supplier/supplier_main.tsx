import './supplier_main.css'
import { Outlet } from "react-router"
import logo from "../../assets/images/unitee.png"
import { Link } from "react-router-dom"
import ordersSupplierIcon from "../../assets/images/icons/orders.png"
import dashboardSupplierIcon from "../../assets/images/icons/dashboard.png"
import shopIcon from "../../assets/images/icons/store-2.png"
import editprof from "../../assets/images/icons/user-avatar.png"
import logoutIcon from "../../assets/images/icons/logout-4.png"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import notifEventEmitter from '../../helpers/NotifEventEmitter'
// import * as signalR from "@microsoft/signalr"
// import { toast } from 'react-toastify'

function Supplier_Main (){

    interface Supplier {
        image: string;
    }

    const [notifItem, setNotifItem] = useState([]);
    const [supplier, setSupplier] = useState<Supplier | null>(null); 
    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://localhost:7017/Users/${id}`)
            .then(response => {
                setSupplier(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [id]);

    const updateNotification = useCallback(() => {
        axios.get(`https://localhost:7017/Notification/supplierUnread/${id}`)
        .then(response => {
            setNotifItem(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [id]);

    useEffect(() => {  
        notifEventEmitter.on("notifNewOrderAdded", updateNotification);
        updateNotification();
    
        return () => {
            notifEventEmitter.off("notifNewOrderAdded", updateNotification);
        };
    }, [id, updateNotification]);


    return <div className="supplier-main">
            <header className="supplier-header">
                <Link to='' className="col-md-12 supplier-home-btn">
                        <img className="Supplierlogo" src={ logo }/>
                </Link>


                <div className="supplier-nav-bar">
                    <Link to='' className="supplier-nav-link">
                        <img className="supplier-nav-icon" src={ dashboardSupplierIcon }/>
                        <span className="supplier-nav-text">Dashboard</span>
                    </Link>
                    <Link to='supplier_orders' className="supplier-nav-link">
                        <img className="supplier-nav-icon" src={ ordersSupplierIcon }/>
                        <span className="supplier-nav-text">Orders {notifItem.length > 0 && <span className='notifOrder-count'>{notifItem.length}</span>}</span>
                        
                    </Link>
                    <Link to='manage_shop' className="supplier-nav-link">
                        <img className="supplier-nav-icon" src={ shopIcon }/>
                        <span className="supplier-nav-text">Shop</span>
                    </Link>
                    <Link to='reports' className="supplier-nav-link">
                        <img className="supplier-nav-icon" src={ shopIcon }/>
                        <span className="supplier-nav-text">Reports</span>
                    </Link>
                </div>
            </header>
            <div style={{ minHeight: '100%' }}>
                
                <div className="second-nav-container">

                    <div className="search-container">
                    <span className="fa fa-search form-control-feedback search-icon"></span>
                        <input className="Supplier-SearchBar" type="text" placeholder="Search" />
                    </div>
                    {supplier && (
                        <>
                            <img 
                                className="seller-profile" 
                                src={ `https://localhost:7017/${supplier.image}` } 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            />
                        </>
                    )}

                    <ul className="dropdown-menu" style={{ padding:'10px', width:'15rem' }}>
                        <li className="drop-list">
                            <a className="dropdown-item supplier-drop-item" style={{ fontSize:'15px' }}>
                                <img className="drop-icon" src={ editprof }/>
                                Manage Profile
                            </a>
                        </li>
                        <Link className="drop-link-item" to="/">
                            <li className="drop-list">
                                <a className="dropdown-item supplier-drop-item" style={{ fontWeight:'600', fontSize:'15px' }}>
                                    <img className="drop-icon-logout" src={ logoutIcon }/>
                                    Log Out
                                </a>
                            </li>   
                        </Link>
                    </ul>
      
                </div>
                <Outlet/>
            </div>

            
        </div>
}

export default Supplier_Main