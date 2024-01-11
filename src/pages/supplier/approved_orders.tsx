import { toast } from 'react-toastify';
import uniteeLogo from '../../assets/images/unitee.png'
import './approved_orders.css'
import notifEventEmitter from '../../helpers/NotifEventEmitter';
import orderEventEmitter from '../../helpers/OrderEmitter';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cartEventEmitter from '../../helpers/EventEmitter';
import { useParams } from 'react-router-dom';

function Approved_Orders() {

    // * Payment Type and Status
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
        Denied: 'Denied',
    };

    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // * Handle Close Button s
    const handleCloseButton = async () => {
        await sleep(50);
        window.location.reload();
    };  

    // * Handle Order Click
    const handleOrderClick = (orderItem) => {
        setSelectedOrders(orderItem);
    };

    // * Get Order By Supplier from Customer
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Order/BySupplier/${id}`);
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const validationListener = () => {
            fetchOrders();
        }

        cartEventEmitter.on("itemAddedToCart", validationListener);
        validationListener();

        return () => {
            cartEventEmitter.off("itemAddedToCart", validationListener);
        };
    }, [id])

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get(`https://localhost:7017/Order/BySupplier/${id}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Network error or server not responding');
            }
        };

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [id])

    // * Get All Departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("https://localhost:7017/Department");
                setDepartments(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDepartments();
    }, []);

    // * Get Department Names
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

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

    // * Handle Pick Up Orders
    const HandleForPickUpOrders = (orderId) => {
        axios.put(`https://localhost:7017/Order/forPickUp/${orderId}`)
        .then(async response => {
            const updatedOrder = orders.find(order => order.Id === response.data.Id);
            if (updatedOrder) {
                Object.assign(updatedOrder, response.data);
            }
            toast.success("For pick up order success");
            notifEventEmitter.emit("notifAdded");
            orderEventEmitter.emit("statusUpdate");
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    };

     // * Format Date
    const formatDate= (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return <div className="approved-orders-main-container">
        <header className='order-header'>
                <h1>Approved Orders</h1>
                <input className="input-searchOrder" name="text" placeholder="Search..." type="search" onChange={handleSearchChange}></input>
            </header>
        <div className="approved-table-container">
            <table className='table table-hover'>
                <thead className='table-dark'>
                <tr>
                        <th scope='col'>Date</th>
                        <th className="text-center" scope='col'>Order no.</th>
                        <th className="text-center" scope='col'>Number of Items</th>
                        <th className="text-center" scope='col'>Customer</th>
                        <th className="text-center" scope='col'>Total Amount</th>
                    </tr>
                </thead>
                {orders.length > 0 ? (
                    orders
                    .filter(order => order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Approved)
                    .map((orderItem, index) => (
                    <tbody key={index} className="table-group-divider">
                        <tr data-bs-toggle="modal" data-bs-target="#orderDetailsModal" onClick={() => handleOrderClick(orderItem)}>
                            <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                            <td className="text-center">{orderItem.orderNumber}</td>
                            <td className="text-center">
                                {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}
                            </td>
                            <td className='text-center'>{orderItem.user.firstName} {orderItem.user.lastName}</td>
                            <td className="text-center">{orderItem.total ? orderItem.total.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'PHP',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })
                                : "₱0.00"}
                            </td>
                        </tr>
                    </tbody>
                ))
                ) : (
                    <tbody className="table-group-divider">
                    <tr data-bs-toggle="modal" className="text-center">
                        <td></td>
                        <td></td>
                        <td>No approved orders available</td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                )}
            </table>
        </div>

        {/* VIEW ORDER DETAILS MODAL */}
        <div className="modal fade" id="orderDetailsModal" tabIndex={-1} aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                <div className="modalHeader">
                    <img className='modal-logo' src={ uniteeLogo }/>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseButton}></button>
                </div>
                {selectedOrders && (
                    <div className="modal-body orderDetails-modal">
                    <div className="order-detail-1">
                        <div>
                            <h1>Order Details</h1>
                            <div className="order-details-container">
                                <div className="ord-details-labels">
                                    <span className='details-label'>Status</span>
                                    <span className='details-label'>Payment Type</span>
                                    <span className='details-label'>Order Number</span>
                                    <span className='details-label'>Date</span>
                                    <span className='details-label'>Number of Items</span>
                                    <span className='details-label'>Proof of Payment</span>
                                    <span className='details-label'>Reference no.</span>
                                    <span className='details-label-totalAmount'>Total Amount</span>
                                </div>
                                <div className="ord-details-data">
                                    <span className='details-data' style={{ color:'#07c706' }}>{Status[Object.keys(Status)[selectedOrders.status - 1]]}</span>
                                    <span className='details-data'>{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
                                    <span className='details-data'>{selectedOrders.orderNumber}</span>
                                    <span className='details-data'>{formatDate(selectedOrders.dateCreated)}</span>
                                    <span className='details-data'>{selectedOrders.orderItems.length}</span>
                                    <span className='details-data'>
                                    <a 
                                        className="modal-info" 
                                        rel="noopener noreferrer" 
                                        target="_blank" 
                                        href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                    >
                                        {selectedOrders.proofOfPayment.split('\\').pop()}
                                    </a>
                                    </span>
                                    <span className='details-data'>{selectedOrders.referenceId}</span>
                                    <span className='details-data-totalAmount'>
                                        {selectedOrders.total ? selectedOrders.total.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'PHP',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })
                                        : "₱0.00"}
                                    </span>
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
                                    <span className='details-data'>{selectedOrders.user.id}</span>
                                    <span className='details-data'>{selectedOrders.user.firstName}</span>
                                    <span className='details-data'>{selectedOrders.user.lastName}</span>
                                    <span className='details-data'>{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                    <span className='details-data'>{selectedOrders.user.gender}</span>
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
                                        <th className='text-center' scope='col'>Type</th>
                                        <th className='text-center' scope='col'>Gender</th>
                                        <th className='text-center' scope='col'>Size</th>
                                        <th className='text-center' scope='col'>Quantity</th>
                                        <th className='text-center' scope='col'>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {selectedOrders && selectedOrders.orderItems && 
                                    (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.Approved) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{item.product.productName}</th>
                                                <td className='text-center'>{getProductTypeName(item.product.productTypeId)}</td>
                                                <td className="text-center">{item.product.category}</td>
                                                <td className="text-center">{item.sizeQuantity.size}</td>
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-center">{item.product ? item.product.price.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "₱0.00"}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                )}
                
                <div className="orderModal-footer">
                    <button className='approve-btn' onClick={() => HandleForPickUpOrders(selectedOrders.id)}>For Pick Up</button>
                </div>
                </div>
            </div>
        </div>
    </div>
}

export default Approved_Orders