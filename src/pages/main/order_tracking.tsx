import './order_tracking.css'
import trackImg from "../../assets/images/trackImg2.png"
import pendingIcon from "../../assets/images/icons/pendingOrder.png"
import approvedIcon from "../../assets/images/icons/approvedOrder.png"
import cancelledIcon from "../../assets/images/icons/cancelledOrder.png"
import claimedIcon from "../../assets/images/icons/claimedOrder.png"

function Order_Tracking () {
    return <div className='orderPage-main-container'>
        {/* ORDER STATUS NAVBAR */}
            <div className="col-3 order-nav-pills-container">
            {/* <h1 className='customer-orderPage-title'>Order List</h1> */}
                <nav id="orders-navbar" className="orders-nav-container flex-column">
                    <div className='col-md-12 pill-container'>
                        <a className="orders-nav-link" href="#pending-orders">
                            <img src={ pendingIcon } className='nav-pills-icon'/>
                        PENDING</a>
                    </div>

                    <div className='col-md-12 pill-container'>
                        <a className="orders-nav-link" href="#approved-orders">
                            <img src={ approvedIcon } className='nav-pills-icon'/>
                        APPROVED</a>
                    </div>

                    <div className='col-md-12 pill-container'>
                        <a className="orders-nav-link" href="#canceled-orders">
                            <img src={ cancelledIcon } className='nav-pills-icon'/>
                        CANCELLED</a>
                    </div>

                    <div className='col-md-12 pill-container'>
                        <a className="orders-nav-link" href="#claimed-orders">
                            <img src={ claimedIcon } className='nav-pills-icon'/>
                        CLAIMED</a>
                    </div>
                    <img className='trackImg' src={ trackImg }/>
                </nav>
            </div>

            {/* TABLES OF ORDERS CONTAINER */}
            <div className="orders-customer-container">
                <div data-bs-spy="scroll" data-bs-target="#orders-navbar" data-bs-smooth-scroll="true" className="odersScrollspy" tabIndex={0}>
                
                    {/* PENDING ORDERS ANCHOR CONTAINER */}
                    <div id="pending-orders">
                        <h4 className="order-status-text">
                        <img src={ pendingIcon } className='nav-pills-icon'/>
                        Pending Orders</h4>
                        <div className='col-md-11 pending-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
                            <table className="table table-hover align-middle caption-bot table-xxl">
                                <caption>end of list of pending orders</caption>
                                <thead className='table align-middle'>
                                    <tr className='thead-row'>
                                        <th scope="col">Date</th>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Number of Items</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Pending</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                
                    {/* APPROVED ORDERS */}
                    <div id="approved-orders">
                        <h4 className="order-status-text">
                            <img src={ approvedIcon } className='nav-pills-icon'/>
                            Approved Orders</h4>
                        <div className='col-md-11 approved-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
                            <table className="table table-hover align-middle caption-bot table-xxl">
                                <caption>end of list of approved orders</caption>
                                <thead className='table align-middle'>
                                    <tr className='thead-row'>
                                        <th scope="col">Date</th>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Number of Items</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Approved</td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CANCELLED ORDERS */}
                    <div id="canceled-orders">
                        <h4 className="order-status-text">
                            <img src={ cancelledIcon } className='nav-pills-icon'/>
                            CancelLed Orders</h4>
                        <div className='col-md-11 admin-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
                            <table className="table table-hover align-middle caption-bot table-xxl">
                                <caption>end of list of cancelled orders</caption>
                                <thead className='table align-middle'>
                                    <tr className='thead-row'>
                                    <th scope="col">Date</th>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Number of Items</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Canceled</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                {/* CLAIMED ORDERS */}
                    <div id="claimed-orders">
                        <h4 className="order-status-text">
                        <img src={ claimedIcon } className='nav-pills-icon'/>
                            Claimed Orders</h4>
                        <div className='col-md-11 admin-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
                            <table className="table table-hover align-middle caption-bot table-xxl">
                                <caption>end of list of claimed orders</caption>
                                <thead className='table align-middle'>
                                    <tr className='thead-row'>
                                    <th scope="col">Date</th>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Number of Items</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">08/28/2023</th>
                                        <td>2583792</td>
                                        <td>5</td>
                                        <td>PHP 1000</td>
                                        <td>Claimed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
    </div>

}

export default Order_Tracking