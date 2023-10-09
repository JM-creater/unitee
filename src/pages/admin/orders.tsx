import product2 from "../../assets/images/shop_products/product2.png"
import './orders.css'


function Orders () {
    return <div className="orders-main-container">
        <div className="row">
          <div className="col-3">
            <nav id="orders-navbar" 
            className="orders-nav-container">
              <nav className="orders-nav nav nav-pills flex-column">

                <a className="orders-nav-link" href="#pending-orders">PENDING</a>

                <a className="orders-nav-link" href="#approved-orders">APPROVED</a>

                <a className="orders-nav-link" href="#canceled-orders">CANCELED</a>

              </nav>
        {/* 
              <img className="boxes-img" src={ shark } alt="" /> */}
            </nav>
          </div>

  <div className="orders-admin-container col-9">
    <div data-bs-spy="scroll" data-bs-target="#orders-navbar" data-bs-smooth-scroll="true" className="odersScrollspy" tabIndex={0}>
      <div id="pending-orders">
        <h4 className="order-status-text">Pending Orders</h4>
        <div className='col-md-10 pending-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
    <table className="table table-hover table-striped align-middle caption-bot table-xl">
    <caption>end of list of pending orders</caption>
    <thead className='table-dark align-middle'>
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
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">Pending</td>
            </tr>
    </tbody>
    </table>
    </div>
      </div>
      
      <div id="approved-orders">
        <h4 className="order-status-text">Approved Orders</h4>
        <div className='col-md-10 approved-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
    <table className="table table-hover table-striped align-middle caption-bot table-xl">
    <caption>end of list of approved orders</caption>
    <thead className='table-dark align-middle'>
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
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Approved</td>
            </tr>
    </tbody>
    </table>
    </div>
      </div>
      <div id="canceled-orders">
        <h4 className="order-status-text">Canceled Orders</h4>
        <div className='col-md-10 admin-orders-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
    <table className="table table-hover table-striped align-middle caption-bot table-xl">
    <caption>end of list of cancelled orders</caption>
    <thead className='table-dark align-middle'>
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
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">PHP 1000</td>
            <td data-bs-toggle="modal" data-bs-target="#canceledOrdersModal">Canceled</td>
            </tr>
    </tbody>
    </table>
    </div>
      </div>

    </div>
  
  </div>
</div>

<div className="pending-order-modal modal fade" id="pendingOrdersModal" tabIndex={-1} aria-labelledby="pendingOrderModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="orders-modal-content modal-content" style={{ backgroundColor:'#fff' }}>
    <div className="modal-header">
    <h3 className='modal-order-title'>Order Details</h3>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className='col-md-12 row' style={{ display:'flex', justifyContent:'space-between', padding:'15px' }}>
      <div className="modal-body">
        <div style={{ display:'flex', flexFlow:'row', gap:'50px' }}>
            <div className='col-md-3 product-details-container' >
            <div className='customer-details-content'>
            <h3 className='order-details-titles'>Customer Details</h3>
            <span className="customer-details-text">First Name: <p className="customer-details-input">Racel Anne</p></span>
            <span className="customer-details-text">Last Name: <p className="customer-details-input">Pitogo</p></span>
            <span className="customer-details-text">ID Number: <p className="customer-details-input">20168619</p></span>
            <span className="customer-details-text">Phone Number: <p className="customer-details-input">09161528419</p></span>
            </div>
            <div className='order-details-content'>
            <h3 className='order-details-titles'>Order Details</h3>
            <span className="order-details-text">Order Date: <p className="order-details-input">8/28/2023</p></span>
            <span className="order-details-text">Order ID: <p className="order-details-input">2583792</p></span>
            <span className="order-details-text">Number of Items: <p className="order-details-input">5</p></span>
            <span className="order-details-text">Payment option: <p className="order-details-input">GCash</p></span>
            </div>
            
            <div className='payment-details-content'>
            <h3 className='order-details-titles'>Payment Details</h3>
            <h4>Total Amount: <p className="order-details-input">PHP 1000</p></h4>
            <span className="order-details-text">Proof of payment:</span>
            <a href="" style={{ fontSize:'15px'}}>proofPayment.png</a>
            </div>
            </div>

            <div className='item-details-container'>
            <h3>Item Details:</h3>
            <div className='order-table-wrapper table-responsive-sm'>
        <table className="col-md-12 table table-hover align-middle caption-bot table-xl">
        <caption>end of list</caption>
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="order-table-header" scope="col">Product</th>
            <th className="order-table-header" scope="col">Size</th>
            <th className="order-table-header" scope="col">Quantity</th>
            <th className="order-table-header" scope="col">Price</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
        <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
        </tbody>
        </table>
        </div>
            </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
      <button className="proceed-Btn"data-bs-toggle="modal" data-bs-target="#cartModal">
            Approve Order
            </button>
      <button className="Btn" data-bs-toggle="modal" data-bs-target="#cancelOrderConfirmModal">
            Deny Order</button>
      </div>
    </div>
  </div>
</div>


<div className="approved-order-modal modal fade" id="approvedOrdersModal" tabIndex={-1} aria-labelledby="approvedOrderModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="orders-modal-content modal-content" style={{ backgroundColor:'#fff' }}>
    <div className="modal-header">
    <h3 className='modal-order-title'>Order Details</h3>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className='col-md-12 row' style={{ display:'flex', justifyContent:'space-between', padding:'15px' }}>
      <div className="modal-body">
        <div style={{ display:'flex', flexFlow:'row', gap:'50px' }}>
            <div className='col-md-3 product-details-container' >
            <div className='customer-details-content'>
            <h3 className='order-details-titles'>Customer Details</h3>
            <span className="customer-details-text">First Name: <p className="customer-details-input">Racel Anne</p></span>
            <span className="customer-details-text">Last Name: <p className="customer-details-input">Pitogo</p></span>
            <span className="customer-details-text">ID Number: <p className="customer-details-input">20168619</p></span>
            <span className="customer-details-text">Phone Number: <p className="customer-details-input">09161528419</p></span>
            </div>
            <div className='order-details-content'>
            <h3 className='order-details-titles'>Order Details</h3>
            <span className="order-details-text">Order Date: <p className="order-details-input">8/28/2023</p></span>
            <span className="order-details-text">Order ID: <p className="order-details-input">2583792</p></span>
            <span className="order-details-text">Number of Items: <p className="order-details-input">5</p></span>
            <span className="order-details-text">Payment option: <p className="order-details-input">GCash</p></span>
            </div>
            
            <div className='payment-details-content'>
            <h3 className='order-details-titles'>Payment Details</h3>
            <h4>Total Amount: <p className="order-total-input">PHP 1000</p></h4>
            <h3 className="order-details-titles">Proof of payment:</h3>
            <a href="" style={{ fontSize:'15px'}}>proofPayment.png</a>
            <button type="button" className="col-md-6 receipt-btn btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#receiptModal">View Order Receipt</button>
            </div>
            </div>

            <div className='item-details-container'>
            <h3>Item Details:</h3>
            <div className='order-table-wrapper table-responsive-sm'>
        <table className="col-md-12 table table-hover align-middle caption-bot table-xl">
        <caption>end of list</caption>
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="order-table-header" scope="col">Product</th>
            <th className="order-table-header" scope="col">Size</th>
            <th className="order-table-header" scope="col">Quantity</th>
            <th className="order-table-header" scope="col">Price</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
        <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
        </tbody>
        </table>

        </div>
            </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
      <button className="Btn" data-bs-dismiss="modal" aria-label="Close">
            Close</button>
      </div>
    </div>
  </div>
</div>


<div className="canceled-order-modal modal fade" id="canceledOrdersModal" tabIndex={-1} aria-labelledby="canceledOrderModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="orders-modal-content modal-content" style={{ backgroundColor:'#fff' }}>
    <div className="modal-header">
    <h3 className='modal-order-title'>Order Details</h3>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className='col-md-12 row' style={{ display:'flex', justifyContent:'space-between', padding:'15px' }}>
      <div className="modal-body">
        <div style={{ display:'flex', flexFlow:'row', gap:'50px' }}>
            <div className='col-md-3 product-details-container' >
            <div className='customer-details-content'>
            <h3 className='order-details-titles'>Customer Details</h3>
            <span className="customer-details-text">First Name: <p className="customer-details-input">Racel Anne</p></span>
            <span className="customer-details-text">Last Name: <p className="customer-details-input">Pitogo</p></span>
            <span className="customer-details-text">ID Number: <p className="customer-details-input">20168619</p></span>
            <span className="customer-details-text">Phone Number: <p className="customer-details-input">09161528419</p></span>
            </div>
            <div className='order-details-content'>
            <h3 className='order-details-titles'>Order Details</h3>
            <span className="order-details-text">Order Date: <p className="order-details-input">8/28/2023</p></span>
            <span className="order-details-text">Order ID: <p className="order-details-input">2583792</p></span>
            <span className="order-details-text">Number of Items: <p className="order-details-input">5</p></span>
            <span className="order-details-text">Payment option: <p className="order-details-input">GCash</p></span>
            </div>
            
            <div className='payment-details-content'>
            <span className="order-details-text"  style={{ marginTop:'15px' }}>Status: <p className="order-details-input">CANCELED ORDER</p></span>
            <span className="order-details-text">Date canceled: <p className="order-details-input">8/24/2023</p></span>
            </div>
            </div>

            <div className='item-details-container'>
            <h3>Item Details:</h3>
            <div className='order-table-wrapper table-responsive-sm'>
        <table className="col-md-12 table table-hover align-middle caption-bot table-xl">
        <caption>end of list</caption>
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="order-table-header" scope="col">Product</th>
            <th className="order-table-header" scope="col">Size</th>
            <th className="order-table-header" scope="col">Quantity</th>
            <th className="order-table-header" scope="col">Price</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            
        </tbody>
        </table>
        </div>
            </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
            <button className="Btn" data-bs-dismiss="modal" aria-label="Close">
            Close</button>
      </div>
    </div>
  </div>
</div>

<div className="deny-order-confirmation modal fade" id="cancelOrderConfirmModal" aria-hidden="true" aria-labelledby="cancelOrderConfirmModalLabel" tabIndex={-1}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="cancelOrderConfirmModalLabel">Cancel Confirmation</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p className="cancel-confirm-text">Are you sure you want to deny order?</p>
      </div>
      <div className="modal-footer">
      <button className="proceed-Btn"data-bs-toggle="modal" data-bs-target="#cartModal">
            Yes
            </button>
      <button className="Btn" data-bs-toggle="modal" data-bs-target="#pendingOrdersModal">
            No
            </button>
      </div>
    </div>
  </div>
</div>

<div className="view-receipt-modal modal fade" id="receiptModal" tabIndex={-1} aria-labelledby="receiptModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content" style={{ backgroundColor:'#fff' }}>
      
      <div className='col-md-12 row'>
      <div className="modal-body">
        <div style={{ display:'flex', flexFlow:'row', justifyContent:'center' }}>
           <div className="col-md-8 receipt-body">
            <h1 className="order-title">ORDER RECEIPT</h1>
            <h5 className="receipt-labels">order no.: <span className="receipt-details">953828</span></h5>

            <div className="col-md-10 row" style={{ marginTop:'15px' }}>
            <div className="col-md-5 receipt-details-container">
              <h4 className="receipt-details-labels">Customer ID:</h4>
              <h4 className="receipt-details-labels">No. of Items:</h4>
              <h4 className="receipt-details-labels">Shop:</h4>
              <h4 className="receipt-details-labels">Total Amount</h4>
              </div>
              <div className="col-md-7 order-info-container">
                <h4 className="order-info-text">198543985</h4>
                <h4 className="order-info-text">8</h4>
                <h4 className="order-info-text">Example Shop</h4>
                <h4 className="order-info-text">PHP 1000</h4>
              </div>
            </div>
              <div className="product-list-orders">
              <h3 className="list-title">Product List:</h3>
              <div className='product-list-table-wrapper table-responsive-sm'>
        <table className="col-md-12 table table-borderless table-dark table-hover align-middle table-xl">
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="order-table-header" scope="col">Product Name</th>
            <th className="order-table-header" scope="col">Size</th>
            <th className="order-table-header" scope="col">Quantity</th>
            <th className="order-table-header" scope="col">Price</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
            <tr>
            <th scope="row">Department Shirt</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">CCS Uniform Top</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">Department Shirt</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">CCS Uniform Skirt</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">CCS ID Sling</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">Department Shirt</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row">Department Shirt</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
        </tbody>
        </table>
        </div>
              </div>
           
           </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-lg" data-bs-toggle="modal" data-bs-target="#approvedOrdersModal">Close</button>
      </div>
    </div>
  </div>
</div>
        </div>
}

export default Orders