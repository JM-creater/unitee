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
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import cartEventEmitter from "../../helpers/EventEmitter"

function Main() {

    interface Customer {
        image: string;
    }

    const [customer, setCustomer] = useState<Customer | null>(null); 
    const [, setCart] = useState([]);
    const { userId } = useParams();
    const [totalItems, setTotalItems] = useState<number | null>(null);

    useEffect(() => {
        axios.get(`https://localhost:7017/Users/${userId}`)
        .then(response => {
            setCustomer(response.data);
        })
        .catch(error => {
            console.error(error);
        })
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
        }
        cartEventEmitter.on("itemAddedToCart", updateCartCount);
    
        updateCartCount();
    
        return () => {
            cartEventEmitter.off("itemAddedToCart", updateCartCount);
        };
    }, [userId]);
    

    return <div className="main">
            <header className="header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Link to='' className="col-md-2">
                    <img className="logo" src={ logo }/>
                </Link>

                <div className="col-md-6 header-button-container">
                    <Link className="customer-nav-link" to=''>
                        <img className="nav-icon" src={ homeIcon }/>
                    </Link>
                    <Link className="customer-nav-link" to='cart'>
                        <div className="cart-icon-container"> 
                            <img className="nav-icon" src={ carts }/>
                            {totalItems !== null && totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                        </div>
                    </Link>
                    
                    <Link className="customer-nav-link" to='shop'>
                        <img className="nav-icon" src={ notification }/>
                    </Link>
                    
                    <div className="col-md-1 dropdown">
                    {customer ? (
                        <>
                            <img 
                                src={`https://localhost:7017/${customer.image}`} 
                                style={{ width:'90%', borderStyle:'solid', borderRadius:'50%', height: '50px' ,borderColor:'#D3D3D3' }} 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false" 
                            />
                        </>
                    ) : null}
                    <ul className="dropdown-menu dropdown-menu-dark" style={{ width:'300px'}}>
                        <Link className="customer-nav-droplink" to='user_profile'>
                            <li><a className="dropdown-item">
                            <img className="dropdown-icon"  src={ profIcon } />VIEW PROFILE</a></li></Link>

                        <Link className="customer-nav-droplink" to='orders'>
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