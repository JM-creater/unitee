import "./supplier_orders.css"

function Supplier_Orders () {
    return <div className="manage-orders-main-container">
    <nav id="orders-nav" className="navbar px-3 mb-3" style={{ display:'flex', justifyContent:'end' }}>
        <ul className="nav nav-pills">
            <li className="nav-item supplier-nav-items">
                <a className="nav-link" href="#supplier-pending-order">Pending</a>
            </li>
            <li className="nav-item supplier-nav-items">
                <a className="nav-link" href="#supplier-approved-order">Approved</a>
            </li>

            <li className="nav-item supplier-nav-items">
                <a className="nav-link" href="#supplier-cancelled-order">Cancelled</a>
            </li>

            <li className="nav-item supplier-nav-items">
                <a className="nav-link" href="#supplier-claimed-order">Claimed</a>
            </li>

        </ul>
    </nav>

    <div className="orders-supplier-container">
        <div data-bs-spy="scroll" data-bs-target="#orders-nav" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example p-3 rounded-2" tabIndex={-1}>
            <h4 id="supplier-pending-order">Pending Orders</h4>
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
                                        <tr data-bs-toggle="modal" data-bs-target="#pendingOrderModal">
                                            <th scope="row">08/28/2023</th>
                                            <td>2583792</td>
                                            <td>5</td>
                                            <td>PHP 1000</td>
                                            <td>Pending</td>
                                        </tr>
                                        <tr data-bs-toggle="modal" data-bs-target="#pendingOrderModal">
                                            <th scope="row">08/28/2023</th>
                                            <td>2583792</td>
                                            <td>5</td>
                                            <td>PHP 1000</td>
                                            <td>Pending</td>
                                        </tr>
                                        <tr data-bs-toggle="modal" data-bs-target="#pendingOrderModal">
                                            <th scope="row">08/28/2023</th>
                                            <td>2583792</td>
                                            <td>5</td>
                                            <td>PHP 1000</td>
                                            <td>Pending</td>
                                        </tr>
                                        <tr data-bs-toggle="modal" data-bs-target="#pendingOrderModal">
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
            <h4 className="order-status-label" id="supplier-approved-order">Approved Orders</h4>
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
            <h4 className="order-status-label" id="supplier-cancelled-order">Cancelled Orders</h4>
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
            <h4 className="order-status-label" id="supplier-claimed-order">Claimed Orders</h4>
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

    {/* ORDER DETAILS MODAL */}
    <div className="modal fade" id="pendingOrderModal" tabIndex={-1} aria-labelledby="pendingOrderModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content" style={{ padding:'20px' }}>
                <div className="pending-header">
                    <h1 className="modal-title" id="exampleModalLabel">Pending Order</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-basta-container">
                    <span>Check pending order details</span>
                    <div className="modal-btns-container">
                        <button type="button" className="cancel-btn-modal">Deny</button>
                        <button type="button" className="save-prod-btn">Approve</button>
                    </div>
                </div>
                    <div className="modal-body" style={{ display:'flex', flexFlow:'row', gap:'20px' }}>
                        {/* CUSTOMER DETAILS */}
                        <div>
                            <div className="order-details-customer">
                                <h3 className="order-details-subtitle">Customer</h3>
                                <div className="customer-details-container">
                                    <div className="modal-details-label">
                                        <span className="modal-label">ID Number</span>
                                        <span className="modal-label">First Name</span>
                                        <span className="modal-label">Last Name</span>
                                        <span className="modal-label">Department</span>
                                        <span className="modal-label">Gender</span>
                                    </div>
                                    <div className="modal-details-info">
                                        <span className="modal-info">123456</span>
                                        <span className="modal-info">First Name</span>
                                        <span className="modal-info">Last Name</span>
                                        <span className="modal-info">College of Computer Studies</span>
                                        <span className="modal-info">Gender</span>
                                    </div>
                                </div>
                            </div>

                            {/* ORDER DETAILS */}
                            <div className="modal-order-details-container">
                                <h3 className="order-details-subtitle">Order Details</h3>
                                <div className="order-details-container">
                                    <div className="modal-details-label">
                                        <span className="modal-label">Date</span>
                                        <span className="modal-label">Order Number</span>
                                        <span className="modal-label">Number of Items</span>
                                        <span className="modal-label">Total Amount</span>
                                        <span className="modal-label">Proof of Payment</span>
                                    </div>
                                    <div className="modal-details-info">
                                    <span className="modal-info">Date</span>
                                        <span className="modal-info">Order Number</span>
                                        <span className="modal-info">Number of Items</span>
                                        <span className="modal-info">Total Amount</span>
                                        <a className="modal-info" href="">proof of payment</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* ITEM LIST */}
                        <div className="modal-item-list">
                            <h3 className="order-details-subtitle">Item List</h3>
                            <div className="modal-item-list-table-wrapper">
                                <table className="table">
                                        <thead className="table-primary">
                                            <tr>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Product Type</th>
                                            <th scope="col">Gender</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>4324</td>
                                            <td>12345</td>
                                            </tr>
                                            <tr>
                                            <th scope="row">2</th>
                                            <td>Jacob</td>
                                            <td>Thornton</td>
                                            <td>532</td>
                                            <td>12355</td>
                                            </tr>
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</div>
}

export default Supplier_Orders