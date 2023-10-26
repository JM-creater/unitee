import './purchase_history.css'
//import product2 from "../../assets/images/shop_products/product2.png"
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Purchase_History () {

    const PaymentType = {
        EMoney: 'E-Money',
        Cash: 'Cash'
    };

    const Status = {
        OrderPlaced: 'OrderPlaced',
        Pending: 'Pending',
        Approved: 'Approved',
        ForPickUp: 'ForPickUp',
        Completed: 'Completed',
        Canceled: 'Canceled',
        Denied: 'Denied'
    };

    const [purchases, setPurchases] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedPurchases, setSelectedPurchases] = useState(null);
    const [ratingProduct, setRatingProduct] = useState(null);
    const [ratingSupplier, setRatingSupplier] = useState(null);
    const { userId } = useParams();

    const handleRatingProduct = async (productId, supplierId) => {
        const closeBtn = document.getElementById("btnClose");
        
        if (ratingProduct === null) {
            alert('Please select a rating before submitting.');
            return;
        }

        const request = {
            UserId: userId,
            ProductId: productId,
            SupplierId: supplierId,
            Value: ratingProduct
        };

        try {
            const response = await fetch('https://localhost:7017/Rating/rate-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                toast.success('Rating submitted successfully.');
                closeBtn.click();
            } else {
                const data = await response.json();
                toast.error(`Error: ${data}`);
            }

        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleRatingSupplier = async (productId, supplierId) => {
        const closeBtn = document.getElementById("btnClose");
        
        if (ratingSupplier === null) {
            alert('Please select a rating before submitting.');
            return;
        }

        const request = {
            UserId: userId,
            ProductId: productId,
            SupplierId: supplierId,
            Value: ratingSupplier
        };

        try {
            const response = await fetch('https://localhost:7017/Rating/rate-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                toast.success('Rating submitted successfully.');
                closeBtn.click();
            } else {
                const data = await response.json();
                toast.error(`Error: ${data}`);
            }

        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleBothRatings = async (items) => {
        if (!items || items.length === 0) {
            alert('No items to rate.');
            return;
        }
    
        items.forEach((item) => {
            handleRatingProduct(item.product.productId, item.product.supplierId);
            handleRatingSupplier(item.product.productId, item.product.supplierId);
        });
    };
    

    useEffect(() => {
        if (localStorage.getItem('productRatingSubmitted') === 'true') {
            setRatingProduct(null);
        }
        if (localStorage.getItem('supplierRatingSubmitted') === 'true') {
            setRatingSupplier(null);
        }
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:7017/Order/${userId}`)
            .then(response => {
                setPurchases(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [userId]);

    //Read All Product Types
    useEffect(() => {
        axios.get('https://localhost:7017/ProductType')
            .then(res => {
                setProductTypes(res.data);
            })
            .catch(error => {
                console.error(error)
            });
    }, []);
    
    // Get Product Type Name
    const getProductTypeName = (productTypeId) => {
        const productType = productTypes.find(p => p.productTypeId === productTypeId);
        return productType ? productType.product_Type : 'Unknown Type';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };

    const handleCLose = () => {
        const closeBtn = document.getElementById("btnClose");
        closeBtn.click();
    }

    // Update the Product Details Modal
    useEffect(() => {
        const modal = document.getElementById('viewProdDetailsModal') 
        if (modal) {
            modal.addEventListener('hidden.bs.modal', HandleCloseButton);

            return () => {
                modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
            };
        }
    }, []);

    const HandleCloseButton = () => {
        setRatingProduct(0);
        setRatingSupplier(0);

        const productStars = document.querySelectorAll('input[name="product-star-radio"]');
        productStars.forEach(star => {
            (star as HTMLInputElement).checked = false;
        });
    }

    return <div className="purchase-history-main-container">
        <div className='col-md-12 purchase-title-container'>
        <h1 className='history-title'>Purchase History</h1>
            <div className="col-md-10 search-date-container row" style={{ gap:'10px', marginTop:'20px'}}>
                <div className='col-md-4 history-search-container' style={{  display:'flex', flexFlow:'row', paddingLeft:'20px'}}>
                    <input className="form-control me-2" type="search" placeholder="Search by Order No." aria-label="Search"/>
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
                    <caption>end of list of purchase history</caption>
                    <thead className='table-dark align-middle'>
                        <tr className='thead-row'>
                            <th scope="col">Date</th>
                            <th scope="col">Order No.</th>
                            <th scope="col">Shop</th>
                            <th scope="col">Number of Items</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Rating</th>
                        </tr>
                    </thead>
                    {purchases.length > 0 ? (
                        purchases.filter(purchase => Status[Object.keys(Status)[purchase.status - 1]] === Status.Completed ||
                            Status[Object.keys(Status)[purchase.status - 1]] === Status.Canceled).map((purchaseItem, index) => (
                            <tbody key={index} className="table-group-divider">
                                <tr data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal" onClick={() => setSelectedPurchases(purchaseItem)}>
                                    <th scope="row">{formatDate(purchaseItem.dateCreated)}</th>
                                    <td>{purchaseItem.orderNumber}</td>
                                    <td>{purchaseItem.cart.supplier.shopName}</td>
                                    <td>{purchaseItem.cart.items.length}</td>
                                    <td>{purchaseItem.total}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        ))
                        ) : (
                        <tbody className="table-group-divider">
                            <tr data-bs-toggle="modal" className="text-center">
                                <td></td>
                                <td></td>
                                <td>No purchase history available</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </div>

    <div className="purchase-history-modal modal fade" id="purchaseHistoryModal" tabIndex={-1} aria-labelledby="purchaseHistoryModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="orders-modal-content modal-content" style={{ backgroundColor:'#fff' }}>
                <div className="modal-header">
                    <h3 className='modal-order-title'>Order Details</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose"></button>
                </div>
                <div className='col-md-12 row' style={{ display:'flex', justifyContent:'space-between', padding:'15px' }}>
                {selectedPurchases && (
                    <div className="modal-body">
                    <div style={{ display:'flex', flexFlow:'row', gap:'50px' }}>
                        <div className='col-md-3 product-details-container'>

                            <div className='customer-details-content'>
                                <h3 className='order-details-titles'>Customer Details</h3>
                                <span className="customer-details-text">First Name: <p className="customer-details-input">{selectedPurchases.user.firstName}</p></span>
                                <span className="customer-details-text">Last Name: <p className="customer-details-input">{selectedPurchases.user.lastName}</p></span>
                                <span className="customer-details-text">ID Number: <p className="customer-details-input">{selectedPurchases.user.id}</p></span>
                                <span className="customer-details-text">Phone Number: <p className="customer-details-input">{selectedPurchases.user.phoneNumber}</p></span>
                            </div>

                            <div className='order-details-content'>
                                <h3 className='order-details-titles'>Order Details</h3>
                                <span className="order-details-text">Order Date: <p className="order-details-input">{formatDate(selectedPurchases.dateCreated)}</p></span>
                                <span className="order-details-text">Order No: <p className="order-details-input">{selectedPurchases.orderNumber}</p></span>
                                <span className="order-details-text">Number of Items: <p className="order-details-input">{selectedPurchases.cart.items.length}</p></span>
                                <span className="order-details-text">Payment option: <p className="order-details-input">{PaymentType[Object.keys(PaymentType)[selectedPurchases.paymentType - 1]]}</p></span>
                            </div>
                            
                            <div className='payment-details-content'>
                                <h3 className='order-details-titles'>Payment Details</h3>
                                <p style={{ fontSize: "15px" }}>Total Amount: ₱{selectedPurchases.total}</p>
                                <span className="order-details-text">Proof of payment:</span>
                                <a 
                                    className="modal-info" 
                                    rel="noopener noreferrer" 
                                    target="_blank" 
                                    href={`https://localhost:7017/${selectedPurchases.proofOfPayment}`} 
                                >
                                    {selectedPurchases.proofOfPayment.split('\\').pop()}
                                </a>
                            </div>

                            <div className="claimed-details-container">
                                <h3 style={{ fontSize: "15px" }}>Status: {Status[Object.keys(Status)[selectedPurchases.status - 1]]}</h3>
                                <p style={{ fontSize: "15px" }}>Date Claimed: {formatDate(selectedPurchases.estimateDate)}</p>
                                <p style={{ fontSize: "15px" }}>Receiver: {selectedPurchases.user.firstName} {selectedPurchases.user.lastName}</p>
                            </div>
                        </div>

                        <div className='item-details-container'>
                        <h3>Item Details:</h3>
                        <div className='order-table-wrapper table-responsive-sm'>
                            <table className="col-md-12 table table-hover align-middle caption-bot table-xl">
                                <caption>end of list</caption>
                                <thead className='table-dark align-middle'>
                                    <tr className='thead-row'>
                                    <th className="order-table-header" scope="col">Product Name</th>
                                    <th className="order-table-header" scope="col">Product Type</th>
                                    <th className="order-table-header" scope="col">Gender</th>
                                    <th className="order-table-header" scope="col">Size</th>
                                    <th className="order-table-header" scope="col">Quantity</th>
                                    <th className="order-table-header" scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {selectedPurchases.cart.items.map(item => (
                                        <tr key={item.id}>
                                            <th scope="row" data-bs-toggle="modal" data-bs-target="#cartProductModal"><img className="prod-image-cart" src={ `https://localhost:7017/${item.product.image}` }/>{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td>{item.product.category}</td>
                                            <td>{item.sizeQuantity.size}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Product Rating */}
                        <h3 className='order-details-titles' style={{ marginTop:'120px' }}>Product Rating:</h3>
                        <div className="rating" style={{ display:'flex', justifyContent:'start' }}>
                            {[...Array(5)].map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <Fragment key={ratingValue}>
                                        <input 
                                            type="radio" 
                                            id={`product-star-${ratingValue}`} 
                                            name="product-star-radio" 
                                            value={ratingValue} 
                                            checked={ratingProduct === ratingValue} 
                                            onChange={(e) => setRatingProduct(parseInt(e.target.value))}
                                        />
                                        <label htmlFor={`product-star-${ratingValue}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                                            </svg>
                                        </label>
                                    </Fragment>
                                );
                            })}
                        </div>

                        {/* Supplier Rating */}
                        <h3 className='order-details-titles' style={{ marginTop:'120px' }}>Supplier Rating:</h3>
                        <div className="rating" style={{ display:'flex', justifyContent:'start' }}>
                            {[...Array(5)].map((_, i) => {
                                const supplierValue = i + 1;
                                return (
                                    <Fragment key={supplierValue}>
                                        <input 
                                            type="radio" 
                                            id={`supplier-star-${supplierValue}`} 
                                            name="supplier-star-radio" 
                                            value={supplierValue} 
                                            checked={ratingSupplier === supplierValue} 
                                            onChange={(e) => setRatingSupplier(parseInt(e.target.value))}
                                        />
                                        <label htmlFor={`supplier-star-${supplierValue}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                                            </svg>
                                        </label>
                                    </Fragment>
                                );
                            })}
                        </div>


                        </div>
                    </div>
                </div>
                )}
                </div>
                <div className="modal-footer">
                {selectedPurchases && (
                    <>
                        <Link to={`/shop/${userId}/visit_shop/${selectedPurchases.cart.supplier.id}`}>
                            <button className="proceed-Btn" onClick={handleCLose}>
                                Buy Again
                            </button>
                        </Link>
                        <button className="proceed-Btn" style={{ background: '#FFAA00' }} onClick={() => handleBothRatings(selectedPurchases.cart.items)}>
                            Submit
                        </button>
                    </>
                )}
                </div>
            </div>
        </div>
    </div>
</div>
}

export default Purchase_History