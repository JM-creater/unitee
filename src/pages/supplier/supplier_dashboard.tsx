import './supplier_dashboard.css'
import totalSalesIcon from "../../assets/images/icons/dollar.png"
import totalOrdersIcon from "../../assets/images/icons/checkout.png"
import totalProducts from "../../assets/images/icons/products.png"
import noProdsImg from "../../assets/images/icons/empty-box.png"
import noOder from "../../assets/images/icons/no-order.png"
import LoadingGif from "../../assets/images/icons/loadingscreen.svg";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import React from 'react'

function Supplier (){

    const Status = {
        OrderPlaced: 'OrderPlaced',
        Pending: 'Pending',
        Approved: 'Approved',
        ForPickUp: 'ForPickUp',
        Completed: 'Completed',
        Canceled: 'Canceled',
        Denied: 'Denied'
    };

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalSales, setTotalSales] = useState(0);
    const [topRated, setTopRated] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        const fetchOrderBySupplier = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Order/BySupplier/${id}`);
                setOrders(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
        fetchOrderBySupplier();
    }, [id]);

    useEffect(() => {
        const fetchShopByProduct = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Product/ByShopProduct/${id}`);
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchShopByProduct();
    }, [id])

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Order/totalSales/${id}`);
                setTotalSales(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTotalSales();
    }, [id]);

    useEffect(() => {
        const fetchTopRatedProducts = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Rating/top3/${id}`);
                setTopRated(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTopRatedProducts();
    }, [id]);

    return (
        <React.Fragment>
            {isLoading ? (
                <div className="mainloading-screen">
                    <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
                </div>
            ) : (
                <div className='orders-supplier-main-container'>    
                <div className='col-md-7'>
                <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Dashboard</h3>
                
                    <div  className='dash-supplier-container'>
                        <div className='card-content-container'>
                            <div className='col-md-9 dash-card'>
                                <span>Total Sales</span>
                                <h1 className='col-md-11 number-dash'>{totalSales.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'PHP',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,})}</h1>
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
                            <React.Fragment>
                                {products.slice(0, 3).map((productItem, index) => (
                                    <div  key={index}  className='top-prods-container'>
                                        <img className='top-prod-img' src={ `https://localhost:7017/${productItem.image}` } />
                                        <span className='top-prod-name'>{productItem.productName}</span>
                                        <span className='top-prod-price'>
                                            {productItem.price
                                                ? productItem.price.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                                : "₱0.00"}
                                        </span>

                                    </div>
                                ))}
                                <Link to={`/supplier_dashboard/${id}/manage_shop`} className="no-underline-link">
                                    <button className='btn-dashboardProduct'>See More</button>
                                </Link>
                            </React.Fragment>
                        ) : (
                            <div className="no-productsDashboard-message">
                                <img src={ noProdsImg }/>
                                <p>No products available</p>
                            </div>
                        )}
                    </div>
                    {/* max-height: fit-content */}

                </div>
                <div className="pending-topRated-main-container">
                    <div className='col pending-orders-dash'>
                        <h3>Pending Orders</h3>
                        {orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Pending).slice(0, 3).length > 0 ? (
                                <Link to={`/supplier_dashboard/${id}/pending_orders`} className='no-underline-link'>
                                    {orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Pending).slice(0, 3).map((orderItem, orderIndex) => (
                                        <div key={orderIndex} className='dash-pending-ords-container'>
                                            {orderItem.cart.items.length > 0 && (
                                                <img className='cust-profile-pendOrder' 
                                                    src={`https://localhost:7017/${orderItem.cart.items[0].product.image}`} 
                                                    alt="Product" 
                                                />
                                            )}
                                            <div className='cust-details-container'>
                                                <span className='cust-name-dash'>{orderItem.user.firstName}</span>
                                                <span className='cust-name-dash total'>{orderItem.total ? orderItem.total.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "₱0.00"}
                                                </span>
                                            </div>
                                            <span className='cust-order-num-dash'>{orderItem.orderNumber}</span>
                                        </div>
                                    ))}
                                </Link>
                            ) : (
                            <div className='no-pending-orders'>
                                <img src={noOder} alt="No Pending Orders Icon" style={{ width: '100px', height: '100px', marginTop:'13em' }} />
                                <p>No pending orders available</p>
                            </div>
                        )}
                    </div>


                    <div className="top-rated-products-container">
                        <h3>Top 3 Rated Products </h3>
                        {topRated.slice(0, 3).map((rating, index) => (
                            <div key={index} className="top-rated-prod-container">
                                <img className='top-prod-img' src={ `https://localhost:7017/${rating.product.image}` } />
                                <span className='top-ratedProd-name'>{rating.product.productName}</span>
                                <span className='top-ratedProd-rating'>{rating.value}</span>
                            </div>
                        ))}
                        
                    </div>
                </div>
                
                </div>
            )}
        </React.Fragment>
        
    )
}

export default Supplier