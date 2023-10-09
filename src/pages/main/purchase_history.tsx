import './purchase_history.css'
import product2 from "../../assets/images/shop_products/product2.png"

function Purchase_History () {
    return <div className="purchase-history-main-container">
        <div className='col-md-12 purchase-title-container'>
        <h1 className='history-title'>Purchase History</h1>
        <div className="col-md-10 search-date-container row" style={{ gap:'10px', marginTop:'20px'}}>
            <div className='col-md-4 history-search-container' style={{  display:'flex', flexFlow:'row', paddingLeft:'20px'}}>

                    <input className="form-control me-2" type="search" placeholder="Search by Order ID" aria-label="Search"/>
                    <button className="col-md-3 btn btn-outline-primary" type="submit">Search</button>
                    </div>

                    <div className='col-md-3 date-container'>
                    <span style={{ fontWeight:'500', fontSize:'15px', paddingRight:'5px' }}>Sort by date:</span>
                    <input className='date-input' type="date" />
                    </div>
         </div>
        </div>
        
        <div className='col-md-12 history-table-container'>
        <div className='col-md-10 history-table-wrapper table-responsive'>
    <table className="purchase-table table table-hover table-striped align-middle caption-bot table-xxl">
    <caption>end of list of orders</caption>
    <thead className='table-dark align-middle'>
        <tr className='thead-row'>
        <th scope="col">Date</th>
        <th scope="col">Order ID</th>
        <th scope="col">Shop</th>
        <th scope="col">Number of Items</th>
        <th scope="col">Total Amount</th>
        <th scope="col">Rating</th>
        </tr>
    </thead>
    <tbody className="table-group-divider">
    <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">08/28/2023</th>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">2583792</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">Example Shop</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">5</td>
            <td data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal">PHP 1000</td>
            <td>5 Stars</td>
            </tr>
    </tbody>
    </table>
    </div>
        </div>

    <div className="purchase-history-modal modal fade" id="purchaseHistoryModal" tabIndex={-1} aria-labelledby="purchaseHistoryModalLabel" aria-hidden="true">
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
            <a href="" style={{ fontSize:'15px' }}>proofPayment.png</a>
            </div>

            <div className="claimed-details-container">
                <h3>Status: <p className="order-details-input">Claimed</p></h3>
                <span className="order-details-text">Date Claimed: <p className="order-details-input">8/28/2023</p></span>
                <span className="order-details-text">Receiver: <p className="order-details-input">Example Name</p></span>
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
            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>XL</td>
            <td>3</td>
            <td>PHP 123</td>
            </tr>
            
        </tbody>
        </table>
        </div>
        <input type="radio" id="star-4" name="star-radio" value="star-1"/>
                    <h3 className='order-details-titles' style={{ marginTop:'20px' }}>Product Rating:</h3>
        <div className="rating" style={{ display:'flex', justifyContent:'start' }}>
                    <input type="radio" id="star-1" name="star-radio" value="star-1"/>
                    <label htmlFor="star-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-2" name="star-radio" value="star-1"/>
                    <label htmlFor="star-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-3" name="star-radio" value="star-1"/>
                    <label htmlFor="star-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <label htmlFor="star-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-5" name="star-radio" value="star-1"/>
                    <label htmlFor="star-5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    </div>

                    
            </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
      <button className="proceed-Btn">
            Submit</button>
      </div>
    </div>
</div>
</div>
    </div>
}

export default Purchase_History