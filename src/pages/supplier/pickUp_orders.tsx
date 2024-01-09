import uniteeLogo from '../../assets/images/unitee.png'
import './pickUp_orders.css'

function PickUp_Orders () {
    return <div className="pickUp-ordes-main-container">
        <header className='order-header'>
                <h1>For Pick Up Orders</h1>
                <input className="input-searchOrder" name="text" placeholder="Search..." type="search"></input>
            </header>
        <div className="pickUp-table-container">
            <table className='table table-hover'>
                <thead className='table-dark'>
                    <tr>
                        <th scope='col'>Date</th>
                        <th scope='col'>Order no.</th>
                        <th scope='col'>Number of Items</th>
                        <th scope='col'>Customer</th>
                        <th scope='col'>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-bs-toggle="modal" data-bs-target="#orderDetailsModal">
                        <th scope='row'>1/09/2024</th>
                        <td>123543</td>
                        <td>5</td>
                        <td>Racel Anne</td>
                        <td>1,235.00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* VIEW ORDER DETAILS MODAL */}
        <div className="modal fade" id="orderDetailsModal" tabIndex={-1} aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                <div className="modalHeader">
                    <img className='modal-logo' src={ uniteeLogo }/>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body orderDetails-modal">
                    <div className="order-detail-1">
                        <div>
                            <h1>Order Details</h1>
                            <div className="order-details-container">
                                <div className="ord-details-labels">
                                    <span className='details-label'>Status</span>
                                    <span className='details-label'>Order Number</span>
                                    <span className='details-label'>Date</span>
                                    <span className='details-label'>Number of Items</span>
                                    <span className='details-label'>Proof of Payment</span>
                                    <span className='details-label'>Reference no.</span>
                                    <span className='details-label-totalAmount'>Total Amount</span>
                                </div>
                                <div className="ord-details-data">
                                    <span className='details-data' style={{ color:'#0a028c' }}>For Pick Up</span>
                                    <span className='details-data'>57786</span>
                                    <span className='details-data'>01/09/2024</span>
                                    <span className='details-data'>5</span>
                                    <span className='details-data'><a href="/">sampleProof.png</a></span>
                                    <span className='details-data'>5353522</span>
                                    <span className='details-data-totalAmount'>5,332.00</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1>Customer Details</h1>
                            <div className="customer-details-container">
                                <div className="customer-details-labels">
                                    <span className='cust-details-label'>ID Number</span>
                                    <span className='cust-details-label'>First Name</span>
                                    <span className='cust-details-label'>Last Name</span>
                                    <span className='cust-details-label'>Department</span>
                                    <span className='cust-details-label'>Gender</span>
                                </div>
                                <div className="customer-details-data">
                                    <span className='details-data'>552445</span>
                                    <span className='details-data'>Racel Anne</span>
                                    <span className='details-data'>Pitogo</span>
                                    <span className='details-data'>College of Computer Studies</span>
                                    <span className='details-data'>Female</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-detail-2">
                        <h1>Item List</h1>
                        <div className="itemList-tableWrapper">
                            <table className='table' style={{ width:'65em' }}>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope='col'>Product Name</th>
                                        <th scope='col'>Type</th>
                                        <th scope='col'>Gender</th>
                                        <th scope='col'>Size</th>
                                        <th scope='col'>Quantity</th>
                                        <th scope='col'>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope='row'>CCS Department T-shirt</th>
                                        <td>Department Shirt</td>
                                        <td>Unisex</td>
                                        <td>S</td>
                                        <td>7</td>
                                        <td>1,235.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="orderModal-footer">
                    <button className='approve-btn'>Completed</button>
                </div>
                </div>
            </div>
        </div>
    </div>
}

export default PickUp_Orders