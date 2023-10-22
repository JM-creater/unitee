import './supplier_dashboard.css'
import totalSalesIcon from "../../assets/images/icons/dollar.png"
import totalOrdersIcon from "../../assets/images/icons/checkout.png"
import totalProducts from "../../assets/images/icons/products.png"
import noOder from "../../assets/images/icons/no-order.png"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

function Supplier (){

    const Status = {
        Pending: 'Pending'
    }

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://localhost:7017/Order/BySupplier/${id}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [id]);

    useEffect(() => {
        axios.get(`https://localhost:7017/Product/ByShopProduct/${id}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [id])


    return (
        <div className='orders-supplier-main-container'>    
        <div className='col-md-7'>
        <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Dashboard</h3>
        
            <div  className='dash-supplier-container'>
                <div className='card-content-container'>
                    <div className='col-md-9 dash-card'>
                        <span>Total Sales</span>
                        <h1 className='col-md-11 number-dash'>0</h1>
                    </div>
                    <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Sales Icon"/>
                </div>
                <div className='card-content-container'>
                {orders && (
                    <div className='col-md-9 dash-card'>
                        <span>Total Orders</span>
                        <h1 className='col-md-11 number-dash'>{orders ? orders.length : 0}</h1>
                    </div>
                )}
                    <img className='dash-card-icon' src={ totalOrdersIcon } alt="Total Orders Icon"/>
                </div>
                <div className='card-content-container'>
                    {products && (
                        <div className='col-md-9 dash-card'>
                            <span>Total Products</span>
                            <h1 className='col-md-11 number-dash'>{products.length}</h1>
                        </div>
                    )}
                    <img className='dash-card-icon' src={ totalProducts } alt="Total Products Icon"/>
                </div>
            </div>

            <div className='top-selling-prods-container'>
                <h3 className='top-selling-prods-title'>Recently Added Products</h3>
                {products.length > 0 ? ( 
                    <>
                        {products.slice(0, 3).map((productItem, index) => (
                            <div  key={index}  className='top-prods-container'>
                                <img className='top-prod-img' src={ `https://localhost:7017/${productItem.image}` } />
                                <span className='top-prod-name'>{productItem.productName}</span>
                                <span className='top-prod-price'>₱{productItem.price}</span>
                            </div>
                        ))}
                        <Link to={`/supplier_dashboard/${id}/manage_shop`} className="no-underline-link">
                            <button className='btn-dashboardProduct'>See More</button>
                        </Link>
                    </>
                ) : (
                    <div className="no-productsDashboard-message">
                        <i className="no-productsDashboard-icon fa fa-exclamation-circle"></i>
                        <p>No products available</p>
                    </div>
                )}
            </div>


        </div>
            <div className='col pending-orders-dash'>
                <h3 style={{ marginBottom: '20px' }}>Pending Orders</h3>
                {orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Pending).length > 0 ? (
                    <Link to={`/supplier_dashboard/${id}/supplier_orders`} className='no-underline-link'>
                        {orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Pending).map((orderItem, orderIndex) => (
                            orderItem.cart.items.map((item, itemIndex) => (
                                <div key={`${orderIndex}-${itemIndex}`} className='dash-pending-ords-container'>
                                    <img className='cust-profile-pendOrder' src={`https://localhost:7017/${item.product.image}`} alt="Product"/>
                                    <div className='cust-details-container'>
                                        <span className='cust-name-dash'>{orderItem.user.firstName}</span>
                                        <span className='cust-name-dash total'>₱{orderItem.total}</span>
                                    </div>
                                    <span className='cust-order-num-dash'>{orderItem.orderNumber}</span>
                                </div>
                            ))
                        ))}
                    </Link>
                ) : (
                    <div className='no-pending-orders'>
                        <img src={noOder} alt="No Pending Orders Icon"  style={{ width: '100px', height: '100px' }} />
                        <p>No pending orders available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Supplier