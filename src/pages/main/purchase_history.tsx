import './purchase_history.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import React from 'react';
import submitRatingEventEmitter from '../../helpers/SubmitRatingEventEmitter';

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
    const [ratingProduct, setRatingProduct] = useState(0);
    const [ratingSupplier, setRatingSupplier] = useState(0);
    const [ratedPurchases, setRatedPurchases] = useState(new Set());
    const { userId } = useParams();

    // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // * Add to cart from purchase history 
    const addPurchaseToCart = () => {
        const closeBtn = document.getElementById("btnClose");
        if (!selectedPurchases || !selectedPurchases.cart || !Array.isArray(selectedPurchases.cart.items) || selectedPurchases.cart.items.length === 0) {
            toast.error("No purchases selected");
            return;
        }
    
        selectedPurchases.cart.items.forEach(item => {
            if (!item.productId || !item.sizeQuantity || !item.sizeQuantity.size || !item.sizeQuantity.quantity) {
                toast.error("Invalid purchase item data");
                return;
        }
    
            const cartAddRequest = {
                userId: userId,
                productId: item.productId,
                size: item.sizeQuantity.size,
                quantity: item.quantity
            };
    
            axios.post('https://localhost:7017/Cart/add', cartAddRequest)
                .then(async () => {
                    toast.success("Item added to cart");
                    closeBtn.click();

                    await sleep(1000);
                    window.location.reload();
                })
                .catch(error => {
                    toast.error(error.message);
                });
            });
            axios.get(`https://localhost:7017/Cart/myCart/${userId}`)
            .then(updatedCartResponse => {
                setPurchases(updatedCartResponse.data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    };
    
    // * Handle Submit Rating
    const HandleSubmitRatings = async (purchaseId, productId, supplierId, productRating, supplierRating) => {
        if (productRating < 1 || productRating > 5 || supplierRating < 1 || supplierRating > 5) {
            toast.error("Invalid ratings. Please select a rating between 1 and 5.");
            return;
        }
    
        try {
            // * Submit product rating
            await axios.post('https://localhost:7017/Rating/rate-product', {
                UserId: userId,
                ProductId: productId,
                SupplierId: supplierId,
                Value: productRating
            });
    
            // * Submit supplier rating
            await axios.post('https://localhost:7017/Rating/rate-supplier', {
                UserId: userId,
                ProductId: productId,
                SupplierId: supplierId,
                Value: supplierRating
            });

            // * Add the purchaseId to the ratedPurchases set
            setRatedPurchases(prevRatedPurchases => {
                const updatedRatedPurchases = new Set(prevRatedPurchases.add(purchaseId));
                localStorage.setItem('ratedPurchases', JSON.stringify(Array.from(updatedRatedPurchases)));
                return updatedRatedPurchases;
            });
            
            submitRatingEventEmitter.emit("SubmitRating");
            toast.success("Ratings submitted successfully");
            setRatingProduct(0);
            setRatingSupplier(0);
            await sleep(200);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting ratings:", error);
            toast.error("Error submitting ratings");
        }
    };

    // * Load rated purchases from local storage
    useEffect(() => {
        const storedRatedPurchases = JSON.parse(localStorage.getItem('ratedPurchases')) || [];
        setRatedPurchases(new Set(storedRatedPurchases));
    }, []);

    // * Get Order By User Id
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Order/${userId}`);
                setPurchases(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOrders();
    }, [userId]);

    // * Get All Product Types
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7017/ProductType');
                setProductTypes(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProductTypes();
    }, []);
    
    // * Get Product Type Name
    const getProductTypeName = (productTypeId) => {
        const productType = productTypes.find(p => p.productTypeId === productTypeId);
        return productType ? productType.product_Type : 'Unknown Type';
    };

    // * Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };

    // * Update the Product Details Modal
    useEffect(() => {
        const modal = document.getElementById('viewProdDetailsModal') 
        if (modal) {
            modal.addEventListener('hidden.bs.modal', HandleCloseButton);

            return () => {
                modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
            };
        }
    }, []);

    // * Close Button
    const HandleCloseButton = () => {
        setRatingProduct(0);
        setRatingSupplier(0);

        const productStars = document.querySelectorAll('input[name="product-star-radio"]');
        productStars.forEach(star => {
            (star as HTMLInputElement).checked = false;
        });
    };

    return <div className="purchase-history-main-container">
        <div className='col-md-12 purchase-title-container'>
        <h1 className='history-title'>Purchase History</h1>
            <div className="col-md-10 search-date-container row" style={{ gap:'10px', marginTop:'20px'}}>
                <div className='col-md-4 history-search-container' style={{  display:'flex', flexFlow:'row', paddingLeft:'20px'}}>
                    <input className="form-control me-2" type="search" placeholder="Search by Order No." aria-label="Search"/>
                    <button className="col-md-3 btn btn-outline-primary" type="submit">Search</button>
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
                            <th className="text-center" scope="col">Order No.</th>
                            <th className="text-center" scope="col">Shop</th>
                            <th className="text-center" scope="col">Number of Items</th>
                            <th className="text-center" scope="col">Total Amount</th>
                        </tr>
                    </thead>
                    {purchases.length > 0 ? (
                        purchases.filter(purchase => Status[Object.keys(Status)[purchase.status - 1]] === Status.Completed ||
                            Status[Object.keys(Status)[purchase.status - 1]] === Status.Completed).map((purchaseItem, index) => (
                            <tbody key={index} className="table-group-divider">
                                <tr className='align-middle' data-bs-toggle="modal" data-bs-target="#purchaseHistoryModal" onClick={() => setSelectedPurchases(purchaseItem)}>
                                    <th scope="row">{formatDate(purchaseItem.dateCreated)}</th>
                                    <td className="text-center">{purchaseItem.orderNumber}</td>
                                    <td className="text-center">{purchaseItem.cart.supplier.shopName}</td>
                                    <td className="text-center">{purchaseItem.cart.items.length}</td>
                                    <td className="text-center">{purchaseItem.total}</td>
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
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" ></button>
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

                        <div className='col-md-8 item-details-container'>
                        <h3>Item Details:</h3>
                        <div className='order-table-wrapper table-responsive-sm'>
                            <table className="table table-hover align-middle caption-bot table-xl">
                                <caption>end of list</caption>
                                <thead className='table-dark align-middle'>
                                    <tr className='thead-row'>
                                        <th className="order-table-header" scope="col">Product Name</th>
                                        <th className="order-table-header text-center" scope="col">Product Type</th>
                                        <th className="order-table-header text-center" scope="col">Gender</th>
                                        <th className="order-table-header text-center" scope="col">Size</th>
                                        <th className="order-table-header text-center" scope="col">Quantity</th>
                                        <th className="order-table-header text-center" scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                {selectedPurchases && Status[Object.keys(Status)[selectedPurchases.status - 1]] === Status.Completed && (
                                    <tr>
                                        <th scope="row">{selectedPurchases.cart.items[0].product.productName}</th>
                                        <td className='text-center'>{getProductTypeName(selectedPurchases.cart.items[0].product.productTypeId)}</td>
                                        <td className='text-center'>{selectedPurchases.cart.items[0].product.category}</td>
                                        <td className='text-center'>{selectedPurchases.cart.items[0].sizeQuantity.size}</td>
                                        <td className='text-center'>{selectedPurchases.cart.items[0].quantity}</td>
                                        <td className='text-center'>{selectedPurchases.cart.items[0].product.price}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        {!ratedPurchases.has(selectedPurchases.id) && (
                            <div>
                                {/* Product Rating */}
                                <h3 className='order-details-titles' style={{ marginTop:'120px' }}>Product Rating:</h3>
                                <div className="rating-group">
                                    {[...Array(5)].map((_, i) => {
                                        const ratingValue = i + 1;
                                        return (
                                            <span className="rating-option" key={ratingValue}>
                                                <input 
                                                    type="radio" 
                                                    id={`product-rating-${ratingValue}`} 
                                                    name="product-rating" 
                                                    value={ratingValue} 
                                                    checked={ratingProduct === ratingValue} 
                                                    onChange={(e) => setRatingProduct(parseInt(e.target.value))}
                                                />
                                                <label htmlFor={`product-rating-${ratingValue}`}>{ratingValue}</label>
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Supplier Rating */}
                                <h3 className='order-details-titles' style={{ marginTop:'120px' }}>Supplier Rating:</h3>
                                <div className="rating-group">
                                    {[...Array(5)].map((_, i) => {
                                        const supplierValue = i + 1;
                                        return (
                                            <span className="rating-option" key={supplierValue}>
                                                <input 
                                                    type="radio" 
                                                    id={`supplier-rating-${supplierValue}`} 
                                                    name="supplier-rating" 
                                                    value={supplierValue} 
                                                    checked={ratingSupplier === supplierValue} 
                                                    onChange={(e) => setRatingSupplier(parseInt(e.target.value))}
                                                />
                                                <label htmlFor={`supplier-rating-${supplierValue}`}>{supplierValue}</label>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}    

                        {!ratedPurchases.has(selectedPurchases.id) && (
                            <React.Fragment>
                                <button 
                                    className="proceed-Btn" 
                                    style={{ background: '#FFAA00' }}
                                    onClick={() => HandleSubmitRatings(selectedPurchases.id, selectedPurchases.cart.items[0].product.productId, 
                                                                selectedPurchases.cart.items[0].product.supplierId, 
                                                                ratingProduct, 
                                                                ratingSupplier)}>
                                    Submit
                                </button>
                            </React.Fragment>
                        )}

                        </div>
                    </div>
                </div>
                )}
                </div>
                <div className="modal-footer">
                    <Link to={`/shop/${userId}/cart`}>
                        <button className="proceed-Btn" onClick={addPurchaseToCart}>
                            Buy Again
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</div>
}

export default Purchase_History