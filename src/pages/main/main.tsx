import { Outlet } from "react-router"
import { Link } from "react-router-dom"
import './main.css'
import logo from "../../assets/images/unitee.png"
import profIcon from "../../assets/images/icons/profile2.png"
import logout from "../../assets/images/icons/logout-3.png"
import homeIcon from "../../assets/images/icons/homeIcon.png"
import carts from "../../assets/images/icons/cartIcon.png"
import orders from "../../assets/images/icons/shopping-bag-4.png"
import notification from "../../assets/images/icons/notifIcon.png"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import cartEventEmitter from "../../helpers/EventEmitter"
import notifEventEmitter from "../../helpers/NotifEventEmitter"
import * as signalR from "@microsoft/signalr"
import { toast } from "react-toastify"
import navEmptyCartImg from "../../assets/images/icons/empty-cart.png"

function Main() {

    interface Customer {
        image: string;
    }
    
    const [customer, setCustomer] = useState<Customer | null>(null); 
    const [notifItem, setNotifItem] = useState([]);
    const [totalItems, setTotalItems] = useState<number | null>(null);
    const [cart, setCart] = useState([]);
    const { userId } = useParams();
    
    useEffect(() => {
        axios.get(`https://localhost:7017/Users/${userId}`)
        .then(response => {
            setCustomer(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [userId]);
    
    useEffect(() => {
        const updateCartCount = () => {
            axios.get(`https://localhost:7017/Cart/myCart/${userId}`)
                .then(res => {
                    setCart(res.data);
                    setTotalItems(res.data.reduce((acc, cartItems) => acc + cartItems.items.length, 0));
                })
                .catch(error => {
                    console.error(error);
                });
        };
    
        cartEventEmitter.on("itemAddedToCart", updateCartCount);
        cartEventEmitter.on("cartEmptied", updateCartCount);
        cartEventEmitter.on("cartUpdated", updateCartCount);
        updateCartCount();
    
        return () => {
            cartEventEmitter.off("itemAddedToCart", updateCartCount);
            cartEventEmitter.off("cartEmptied", updateCartCount);
            cartEventEmitter.off("cartUpdated", updateCartCount);
        };
    }, [userId]);
    
    const updateNotification = useCallback(() => {
        axios.get(`https://localhost:7017/Notification/unread/${userId}`)
        .then(response => {
            setNotifItem(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [userId]);
    
    useEffect(() => {  
        notifEventEmitter.on("notifAdded", updateNotification);
        updateNotification();
    
        return () => {
            notifEventEmitter.off("notifAdded", updateNotification);
        };
    }, [userId, updateNotification]);

    const handleNotificationClick = () => {
        axios.post(`https://localhost:7017/Notification/markRead/${userId}`)
        .then(() => {
            updateNotification();
        })
        .catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7017/notificationHub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    
        connection.start().then(() => {
            //console.log("Connected!");
        }).catch(err => console.error("SignalR Connection Error: ", err));
    
        connection.on("OrderStatusUpdated", (message) => {
            toast.success(`New Notification: ${message}`);
            updateNotification();
        });
    
    }, [updateNotification]);
    

    return <div className="main">
            <header className="header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Link to='' className="col-md-2">
                    <img className="logo" src={ logo }/>
                </Link>

                <div className="col-md-6 header-button-container">
                    <Link className="customer-nav-link" to=''>
                        <img className="nav-icon" src={ homeIcon }/>
                    </Link>

                    <div className="customer-nav-link">
                        <div className="cart-icon-container">
                            <Link to='cart'>
                                <img className="nav-icon" src={ carts }/>
                                {totalItems !== null && totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                            </Link>
                            
                            <div className="cart-dropdown">
                                {cart.length > 0 ? (
                                    cart.map((cartObj) => (
                                        cartObj.items.map((item, itemIndex) => (
                                            <Link to={`visit_shop/${cartObj.supplierId}`} key={itemIndex}>
                                                <div className="cart-dropdown-item">
                                                    <img 
                                                        className="dropdown-image"
                                                        src={`https://localhost:7017/${item.product.image}`}  
                                                        alt={item.product.productName} 
                                                        width="50" 
                                                        height="50"
                                                    />
                                                    <span className="dropdown-productName">{item.product.productName}</span>
                                                    <span className="dropdown-price">₱{item.product.price}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ))
                                ) : (
                                    <div className="pop-up-empty-cart-message">
                                        <img className="pop-up-empty-cart-img" src={ navEmptyCartImg }/>
                                        Your cart is empty.</div>
                                )}
                                <div className="cart-dropdown-footer">
                                    <div className="itemsTotal">
                                        {totalItems && totalItems > 0 ? `${totalItems} Products In Cart` : 'No Products In Cart'}
                                    </div>
                                    {/* <div className="hoverButton">
                                        <button onClick={() => navigate('cart')}>Go to Cart</button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link className="customer-nav-link" to='notif' onClick={handleNotificationClick}>
                        <div className="notif-icon-container">
                            <img className="nav-icon" src={notification} />
                            {notifItem.length > 0 && <span className="notif-count">{notifItem.length}</span>}
                        </div>
                    </Link>
                    
                    <div className="col-md-1 dropdown">
                    {customer ? (
                        <>
                            <img 
                                className="imageProfile"
                                src={`https://localhost:7017/${customer.image}`} 
                                style={{ width:'100%', maxWidth:'30px', borderStyle:'solid', borderRadius:'50%', maxHeight: '30px' ,borderColor:'#D3D3D3' }} 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false" 
                            />
                        </>
                    ) : null}
                    <ul className="dropdown-menu dropdown-menu-light" style={{ width:'300px'}}>
                        <Link className="customer-nav-droplink" to={`user_profile/${userId}`}>
                            <li><a className="dropdown-item">
                            <img className="dropdown-icon"  src={ profIcon } />VIEW PROFILE</a></li></Link>

                        <Link className="customer-nav-droplink" to='purchase_history'>
                            <li><a className="dropdown-item">
                            <img className="dropdown-icon" src={ orders } alt="" />PURCHASE HISTORY</a></li></Link>


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
}

export default Main