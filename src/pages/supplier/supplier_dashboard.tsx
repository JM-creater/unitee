import './supplier_dashboard.css'
import totalSalesIcon from "../../assets/images/icons/dollar.png"
import totalOrdersIcon from "../../assets/images/icons/checkout.png"
import totalProducts from "../../assets/images/icons/products.png"
import topProd from "../../assets/images/shop_products/college-uniform.jpg"
import pendingOrdersDash from "../../assets/images/imageprofile.jpeg"

function Supplier (){
    

    return (
        <div className='orders-supplier-main-container'>    
       <div className='col-md-7'>
       <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Dashboard</h3>
       <div className='dash-supplier-container'>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Total Sales</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon }/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Total Orders</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalOrdersIcon }/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Total Products</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalProducts }/>
            </div>
        </div>
        

        <div className='top-selling-prods-container'>
            <h3 className='top-selling-prods-title'>Top Selling Products</h3>
            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>
        </div>
       </div>

       <div className='col pending-orders-dash'>
        <h3 style={{ marginBottom:'20px' }}>Pending Orders</h3>
        <div className='dash-pending-ords-container'>
                <img className='cust-profile-pendOrder' src={ pendingOrdersDash }/>
                <span className='cust-name-dash'>Example Very Long Nam dasd asd asdas ase</span>
                <span className='cust-order-num-dash'>order no. 254654</span>
        </div>

        <div className='dash-pending-ords-container'>
                <img className='cust-profile-pendOrder' src={ pendingOrdersDash }/>
                <span className='cust-name-dash'>Example Very Long Nam dasd asd asdas ase</span>
                <span className='cust-order-num-dash'>order no. 254654</span>
        </div>

        <div className='dash-pending-ords-container'>
                <img className='cust-profile-pendOrder' src={ pendingOrdersDash }/>
                <span className='cust-name-dash'>Example Very Long Nam dasd asd asdas ase</span>
                <span className='cust-order-num-dash'>order no. 254654</span>
        </div>
       </div>

        </div>

    )
}

export default Supplier