import { useEffect, useState } from "react";
import "./supplier_orders.css"
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import notifEventEmitter from "../../helpers/NotifEventEmitter";
import orderEventEmitter from "../../helpers/OrderEmitter";
import cartEventEmitter from "../../helpers/EventEmitter";

function Supplier_Orders () {

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

    const statuses = [
      { key: 'Pending', href: '#supplier-pending-order' },
      { key: 'Approved', href: '#supplier-approved-order' },
      { key: 'ForPickUp', href: '#supplier-forpickup-order' },
      { key: 'Completed', href: '#supplier-completed-order' },
      { key: 'Canceled', href: '#supplier-canceled-order' },
    ];

    // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // * Handle Close Button s
    const handleCloseButton = async () => {
      await sleep(50);
      window.location.reload();
    };

    // * Handle Order Click
    const handleOrderClick = (orderItem) => {
      setSelectedOrders(orderItem);
    }

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

    // * Handle Approved Orders
    const HandleApprovedOrders = (orderId) => {
      axios.put(`https://localhost:7017/Order/approvedOrder/${orderId}`)
        .then(async response => {
          const updatedOrders = orders.map(order => {
            if (order.Id === response.data.Id) {
                return response.data;
            }
            return order;
          });
          setOrders(updatedOrders);
          
          toast.success("Order approved successfully");
          notifEventEmitter.emit("notifAdded");
          orderEventEmitter.emit("statusUpdate");
          window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    };

    // * Handle Denied Orders
    const HandleDeniedOrders = (orderId) => {
      axios.put(`https://localhost:7017/Order/deniedOrder/${orderId}`)
        .then(async response => {
            const updatedOrder = orders.find(order => order.Id === response.data.Id);
            if (updatedOrder) {
                Object.assign(updatedOrder, response.data);
            }
            toast.success("Order denied successfully");
            notifEventEmitter.emit("notifAdded");
            orderEventEmitter.emit("statusUpdate");
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
        });
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

    // * Handle Completed Orders
    const HandleOrderCompleted = (orderId) => {
      axios.put(`https://localhost:7017/Order/orderCompleted/${orderId}`)
        .then(async response => {
          const updatedOrder = orders.find(order => order.Id === response.data.Id);
            if (updatedOrder) {
                Object.assign(updatedOrder, response.data);
            }
            toast.success("Order completed success");
            notifEventEmitter.emit("notifAdded");
            orderEventEmitter.emit("orderCompleted");
            orderEventEmitter.emit("statusUpdate");
            orderEventEmitter.emit("updateSalesReport");
            window.location.reload();
        })
        .catch(error => {
          console.error(error.response.data.message);
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
    

    return (
          <div className="manage-orders-main-container">
          <nav id="orders-nav" className="navbar px-3 mb-3" style={{ display:'flex', justifyContent:'end' }}>
            <ul className="nav nav-pills">
              {statuses.map((status) => (
                <li key={status.key} className="nav-item supplier-nav-items">
                  <a className="nav-link" href={status.href}>
                    {status.key}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
      
          <div className="orders-supplier-container">
              <div data-bs-spy="scroll" data-bs-target="#orders-nav" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example p-3 rounded-2" tabIndex={-1}>
                  <h4 className="order-status-label" id="supplier-pending-order">Pending Orders</h4>
                  <div className='col-md-11 pending-orders-table-wrapper table-responsive-sm' 
                    style={{ marginBottom:'25px', marginTop:'12px'}}>
                    <table className="table table-hover align-middle caption-bot table-xxl">
                        <caption>end of list of pending orders</caption>
                        <thead className='table align-middle'>
                            <tr className='thead-row'>
                                <th scope="col">Date</th>
                                <th className="text-center" scope="col">Order No.</th>
                                <th className="text-center" scope="col">Number of Items</th>
                                <th className="text-center" scope="col">Total Amount</th>
                                <th className="text-center" scope="col">Status</th>
                            </tr>
                        </thead>
                        {orders.length > 0 ? (
                          orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Pending).map((orderItem, index) => (
                            <tbody key={index} className="table-group-divider">
                              <tr data-bs-toggle="modal" data-bs-target="#pendingOrderModal" onClick={() => handleOrderClick(orderItem)}>
                                <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                                <td className="text-center">{orderItem.orderNumber}</td>
                                <td className="text-center">
                                  {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}
                                </td>
                                <td className="text-center">₱{orderItem.total.toFixed(2)}</td>
                                <td className="text-center">{Status[Object.keys(Status)[orderItem.status - 1]]}</td>
                              </tr>
                            </tbody>
                          ))
                        ) : (
                          <tbody className="table-group-divider">
                            <tr data-bs-toggle="modal" className="text-center">
                              <td></td>
                              <td></td>
                              <td>No pending orders available</td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        )}
                    </table>
                  </div>
                  <h4 className="order-status-label" id="supplier-approved-order">Approved Orders</h4>
                  <div className='col-md-11 approved-orders-table-wrapper table-responsive-sm' style={{ marginBottom:'25px', marginTop:'12px'}}>
                      <table className="table table-hover align-middle caption-bot table-xxl">
                          <caption>end of list of approved orders</caption>
                          <thead className='table align-middle'>
                              <tr className='thead-row'>
                                  <th scope="col">Date</th>
                                  <th className="text-center" scope="col">Order No.</th>
                                  <th className="text-center" scope="col">Number of Items</th>
                                  <th className="text-center" scope="col">Total Amount</th>
                                  <th className="text-center" scope="col">Status</th>
                              </tr>
                          </thead>
                          {orders.length > 0 ? (
                            orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Approved).map((orderItem, index) => (
                              <tbody key={index} className="table-group-divider">
                                <tr data-bs-toggle="modal" data-bs-target="#approvedOrderModal" onClick={() => setSelectedOrders(orderItem)}>
                                  <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                                  <td className="text-center">{orderItem.orderNumber}</td>
                                  <td className="text-center">
                                    {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}  
                                  </td>
                                  <td className="text-center">₱{orderItem.total.toFixed(2)}</td>
                                  <td className="text-center">{Status[Object.keys(Status)[orderItem.status - 1]]}</td>
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
                  <h4 className="order-status-label" id="supplier-forpickup-order">For Pick Up</h4>
                  <div className='col-md-11 admin-orders-table-wrapper table-responsive-sm' style={{ marginBottom:'25px', marginTop:'12px'}}>
                      <table className="table table-hover align-middle caption-bot table-xxl">
                          <caption>end of list of for pick up orders</caption>
                          <thead className='table align-middle'>
                              <tr className='thead-row'>
                              <th scope="col">Date</th>
                              <th className="text-center" scope="col">Order No.</th>
                              <th className="text-center" scope="col">Number of Items</th>
                              <th className="text-center" scope="col">Total Amount</th>
                              <th className="text-center" scope="col">Status</th>
                              </tr>
                          </thead>
                          {orders.length > 0 ? (
                            orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.ForPickUp).map((orderItem, index) => (
                              <tbody key={index} className="table-group-divider">
                                <tr data-bs-toggle="modal" data-bs-target="#forPickUpOrderModal" onClick={() => setSelectedOrders(orderItem)}>
                                  <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                                  <td className="text-center">{orderItem.orderNumber}</td>
                                  <td className="text-center">
                                    {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}
                                  </td>
                                  <td className="text-center">₱{orderItem.total.toFixed(2)}</td>
                                  <td className="text-center">{Status[Object.keys(Status)[orderItem.status - 1]]}</td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody className="table-group-divider">
                              <tr data-bs-toggle="modal" className="text-center">
                                <td></td>
                                <td></td>
                                <td>No pick up orders available</td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          )}
                      </table>
                  </div>
                  <h4 className="order-status-label" id="supplier-completed-order">Completed Orders</h4>
                  <div className='col-md-11 admin-orders-table-wrapper table-responsive-sm' style={{ marginBottom:'25px', marginTop:'12px'}}>
                      <table className="table table-hover align-middle caption-bot table-xxl">
                          <caption>end of list of claimed orders</caption>
                          <thead className='table align-middle'>
                              <tr className='thead-row'>
                              <th scope="col">Date</th>
                              <th className="text-center" scope="col">Order No.</th>
                              <th className="text-center" scope="col">Number of Items</th>
                              <th className="text-center" scope="col">Total Amount</th>
                              <th className="text-center" scope="col">Status</th>
                              </tr>
                          </thead>
                          {orders.length > 0 ? (
                            orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Completed).map((orderItem, index) => (
                              <tbody key={index} className="table-group-divider">
                                <tr data-bs-toggle="modal" data-bs-target="#orderCompletedOrderModal" onClick={() => setSelectedOrders(orderItem)}>
                                  <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                                  <td className="text-center">{orderItem.orderNumber}</td>
                                  <td className="text-center">
                                    {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}
                                  </td>
                                  <td className="text-center">₱{orderItem.total.toFixed(2)}</td>
                                  <td className="text-center">{Status[Object.keys(Status)[orderItem.status - 1]]}</td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody className="table-group-divider">
                              <tr data-bs-toggle="modal" className="text-center">
                                <td></td>
                                <td></td>
                                <td>No completed orders available</td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          )}
                      </table>
                  </div>
                  <h4 className="order-status-label" id="supplier-canceled-order">Canceled Orders</h4>
                  <div className='col-md-11 admin-orders-table-wrapper table-responsive-sm' style={{ marginBottom:'25px', marginTop:'12px'}}>
                      <table className="table table-hover align-middle caption-bot table-xxl">
                          <caption>end of list of cancelled orders</caption>
                          <thead className='table align-middle'>
                              <tr className='thead-row'>
                              <th scope="col">Date</th>
                              <th className="text-center" scope="col">Order No.</th>
                              <th className="text-center" scope="col">Number of Items</th>
                              <th className="text-center" scope="col">Total Amount</th>
                              <th className="text-center" scope="col">Status</th>
                              </tr>
                          </thead>
                          {orders.length > 0 ? (
                            orders.filter(order => Status[Object.keys(Status)[order.status - 1]] === Status.Canceled).map((orderItem, index) => (
                              <tbody key={index} className="table-group-divider">
                                <tr data-bs-toggle="modal" data-bs-target="#canceledOrderModal" onClick={() => setSelectedOrders(orderItem)}>
                                  <th scope="row">{formatDate(orderItem.dateUpdated)}</th>
                                  <td className="text-center">{orderItem.orderNumber}</td>
                                  <td className="text-center">
                                    {orderItem.orderItems && orderItem.orderItems ? orderItem.orderItems.length : 0}
                                  </td>
                                  <td className="text-center">₱{orderItem.total.toFixed(2)}</td>
                                  <td className="text-center">{Status[Object.keys(Status)[orderItem.status - 1]]}</td>
                                </tr>
                              </tbody>
                            ))
                          ) : (
                            <tbody className="table-group-divider">
                              <tr data-bs-toggle="modal" className="text-center">
                                <td></td>
                                <td></td>
                                <td>No canceled orders available</td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          )}
                      </table>
                  </div>
              </div>
          </div>
      
          {/* PENDING ORDER DETAILS MODAL */}
          <div className="modal fade" id="pendingOrderModal" tabIndex={-1} aria-labelledby="pendingOrderModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content" style={{ padding:'20px' }}>
                      <div className="pending-header">
                          <h1 className="modal-title" id="exampleModalLabel">Pending Order</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" onClick={handleCloseButton}></button>
                      </div>
                      <div className="modal-basta-container">
                          <span>Check pending order details</span>
                          <div className="modal-btns-container">
                              <button type="button" className="cancel-btn-modal" onClick={() => HandleDeniedOrders(selectedOrders.id)}>Deny</button>
                              <button type="button" className="save-prod-btn" onClick={() => HandleApprovedOrders(selectedOrders.id)}>Approve</button>
                          </div>
                      </div>
                          {selectedOrders && (
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
                                              <span className="modal-info">{selectedOrders.user.id}</span>
                                              <span className="modal-info">{selectedOrders.user.firstName}</span>
                                              <span className="modal-info">{selectedOrders.user.lastName}</span>
                                              <span className="modal-info">{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                              <span className="modal-info">{selectedOrders.user.gender}</span>
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
                                              <span className="modal-label">Reference No.</span>
                                              <span className="modal-label">Payment Type</span>
                                          </div>
                                          <div className="modal-details-info">
                                            <span className="modal-info">{formatDate(selectedOrders.dateCreated)}</span>
                                            <span className="modal-info">{selectedOrders.orderNumber}</span>
                                            <span className="modal-info">{selectedOrders.orderItems.length}</span>
                                            <span className="modal-info">₱{selectedOrders.total.toFixed(2)}</span>
                                            <a 
                                              className="modal-info" 
                                              rel="noopener noreferrer" 
                                              target="_blank" 
                                              href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                            >
                                              {selectedOrders.proofOfPayment.split('\\').pop()}
                                            </a>
                                            <span className="modal-info">{selectedOrders.referenceId}</span>
                                            <span className="modal-info">{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
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
                                          <th className="text-center" scope="col">Gender</th>
                                          <th className="text-center" scope="col">Size</th>
                                          <th className="text-center" scope="col">Quantity</th>
                                          <th className="text-center" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrders && selectedOrders.orderItems && 
                                      (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.Pending) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                          <tr key={index}>
                                            <th scope="row">{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td className="text-center">{item.product.category}</td>
                                            <td className="text-center">{item.sizeQuantity.size}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center">₱{item.product.price.toLocaleString()}</td>
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
                  </div>
              </div>
          </div>
          
          {/* APPROVED ORDER DETAILS MODAL */}
          <div className="modal fade" id="approvedOrderModal" tabIndex={-1} aria-labelledby="approvedOrderModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content" style={{ padding:'20px' }}>
                      <div className="pending-header">
                          <h1 className="modal-title" id="exampleModalLabel">Approved Order</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" onClick={handleCloseButton}></button>
                      </div>
                      <div className="modal-basta-container">
                          <span>Check approved order details</span>
                          <div className="modal-btns-container">
                              <button type="button" className="save-prod-btn" onClick={() => HandleForPickUpOrders(selectedOrders.id)}>For Pick Up</button>
                          </div>
                      </div>
                          {selectedOrders && (
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
                                              <span className="modal-info">{selectedOrders.user.id}</span>
                                              <span className="modal-info">{selectedOrders.user.firstName}</span>
                                              <span className="modal-info">{selectedOrders.user.lastName}</span>
                                              <span className="modal-info">{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                              <span className="modal-info">{selectedOrders.user.gender}</span>
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
                                              <span className="modal-label">Reference No.</span>
                                              <span className="modal-label">Payment Type</span>
                                          </div>
                                          <div className="modal-details-info">
                                            <span className="modal-info">{formatDate(selectedOrders.dateUpdated)}</span>
                                            <span className="modal-info">{selectedOrders.orderNumber}</span>
                                            <span className="modal-info">{selectedOrders.orderItems.length}</span>
                                            <span className="modal-info">₱{selectedOrders.total.toLocaleString()}</span>
                                            <a 
                                              className="modal-info" 
                                              rel="noopener noreferrer" 
                                              target="_blank" 
                                              href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                            >
                                              {selectedOrders.proofOfPayment.split('\\').pop()}
                                            </a>
                                            <span className="modal-info">{selectedOrders.referenceId}</span>
                                            <span className="modal-info">{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
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
                                          <th className="text-center" scope="col">Gender</th>
                                          <th className="text-center" scope="col">Size</th>
                                          <th className="text-center" scope="col">Quantity</th>
                                          <th className="text-center" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrders && selectedOrders.orderItems && 
                                      (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.Approved) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                          <tr key={index}>
                                            <th scope="row">{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td className="text-center">{item.product.category}</td>
                                            <td className="text-center">{item.sizeQuantity.size}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center">₱{item.product.price.toLocaleString()}</td>
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
                  </div>
              </div>
          </div>
      
          {/* FOR PICK UP ORDER DETAILS MODAL */}
          <div className="modal fade" id="forPickUpOrderModal" tabIndex={-1} aria-labelledby="forPickUpOrderModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content" style={{ padding:'20px' }}>
                      <div className="pending-header">
                          <h1 className="modal-title" id="exampleModalLabel">For Pick Up Orders</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" onClick={handleCloseButton}></button>
                      </div>
                      <div className="modal-basta-container">
                          <span>Check for pick up orders details</span>
                          <div className="modal-btns-container">
                              <button type="button" className="save-prod-btn" onClick={() => HandleOrderCompleted(selectedOrders.id)}>Completed</button>
                          </div>
                      </div>
                          {selectedOrders && (
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
                                              <span className="modal-info">{selectedOrders.user.id}</span>
                                              <span className="modal-info">{selectedOrders.user.firstName}</span>
                                              <span className="modal-info">{selectedOrders.user.lastName}</span>
                                              <span className="modal-info">{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                              <span className="modal-info">{selectedOrders.user.gender}</span>
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
                                              <span className="modal-label">Reference No.</span>
                                              <span className="modal-label">Payment Type</span>
                                          </div>
                                          <div className="modal-details-info">
                                            <span className="modal-info">{formatDate(selectedOrders.dateUpdated)}</span>
                                            <span className="modal-info">{selectedOrders.orderNumber}</span>
                                            <span className="modal-info">{selectedOrders.orderItems.length}</span>
                                            <span className="modal-info">₱{selectedOrders.total.toLocaleString()}</span>
                                            <a 
                                              className="modal-info" 
                                              rel="noopener noreferrer" 
                                              target="_blank" 
                                              href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                            >
                                              {selectedOrders.proofOfPayment.split('\\').pop()}
                                            </a>
                                            <span className="modal-info">{selectedOrders.referenceId}</span>
                                            <span className="modal-info">{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
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
                                        <th className="text-center" scope="col">Gender</th>
                                        <th className="text-center" scope="col">Size</th>
                                        <th className="text-center" scope="col">Quantity</th>
                                        <th className="text-center" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrders && selectedOrders.orderItems && 
                                      (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.ForPickUp) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                          <tr key={index}>
                                            <th scope="row">{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td className="text-center">{item.product.category}</td>
                                            <td className="text-center">{item.sizeQuantity.size}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center">₱{item.product.price.toLocaleString()}</td>
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
                  </div>
              </div>
          </div>
      
          {/* COMPLETED ORDER DETAILS MODAL */}
          <div className="modal fade" id="orderCompletedOrderModal" tabIndex={-1} aria-labelledby="orderCompletedOrderModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content" style={{ padding:'20px' }}>
                      <div className="pending-header">
                          <h1 className="modal-title" id="exampleModalLabel">Completed Orders</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" onClick={handleCloseButton}></button>
                      </div>
                      <div className="modal-basta-container">
                          <span>Check for pick up orders details</span>
                      </div>
                          {selectedOrders && (
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
                                              <span className="modal-info">{selectedOrders.user.id}</span>
                                              <span className="modal-info">{selectedOrders.user.firstName}</span>
                                              <span className="modal-info">{selectedOrders.user.lastName}</span>
                                              <span className="modal-info">{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                              <span className="modal-info">{selectedOrders.user.gender}</span>
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
                                              <span className="modal-label">Reference No.</span>
                                              <span className="modal-label">Payment Type</span>
                                              <span className="modal-label">Received</span>
                                          </div>
                                          <div className="modal-details-info">
                                            <span className="modal-info">{formatDate(selectedOrders.dateUpdated)}</span>
                                            <span className="modal-info">{selectedOrders.orderNumber}</span>
                                            <span className="modal-info">{selectedOrders.orderItems.length}</span>
                                            <span className="modal-info">₱{selectedOrders.total.toLocaleString()}</span>
                                            <a 
                                              className="modal-info" 
                                              rel="noopener noreferrer" 
                                              target="_blank" 
                                              href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                            >
                                              {selectedOrders.proofOfPayment.split('\\').pop()}
                                            </a>
                                            <span className="modal-info">{selectedOrders.referenceId}</span>
                                            <span className="modal-info">{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
                                            <span className="modal-info">
                                              {selectedOrders.isReceived ? 'Received' : 'Not Received'}
                                            </span>
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
                                        <th className="text-center" scope="col">Gender</th>
                                        <th className="text-center" scope="col">Size</th>
                                        <th className="text-center" scope="col">Quantity</th>
                                        <th className="text-center" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrders && selectedOrders.orderItems && 
                                      (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.Completed) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                          <tr key={index}>
                                            <th scope="row">{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td className="text-center">{item.product.category}</td>
                                            <td className="text-center">{item.sizeQuantity.size}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center">₱{item.product.price.toLocaleString()}</td>
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
                  </div>
              </div>
          </div>   
      
          {/* CANCELED ORDER DETAILS MODAL */}                            
          <div className="modal fade" id="canceledOrderModal" tabIndex={-1} aria-labelledby="canceledOrderModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content" style={{ padding:'20px' }}>
                      <div className="pending-header">
                          <h1 className="modal-title" id="exampleModalLabel">Canceled Orders</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose" onClick={handleCloseButton}></button>
                      </div>
                      <div className="modal-basta-container">
                          <span>Check for pick up orders details</span>
                      </div>
                          {selectedOrders && (
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
                                              <span className="modal-info">{selectedOrders.user.id}</span>
                                              <span className="modal-info">{selectedOrders.user.firstName}</span>
                                              <span className="modal-info">{selectedOrders.user.lastName}</span>
                                              <span className="modal-info">{getDepartmentName(selectedOrders.user.departmentId)}</span>
                                              <span className="modal-info">{selectedOrders.user.gender}</span>
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
                                              <span className="modal-label">Reference No.</span>
                                              <span className="modal-label">Payment Type</span>
                                              <span className="modal-label">Cancellation Reason</span>
                                          </div>
                                          <div className="modal-details-info">
                                            <span className="modal-info">{formatDate(selectedOrders.dateUpdated)}</span>
                                            <span className="modal-info">{selectedOrders.orderNumber}</span>
                                            <span className="modal-info">{selectedOrders.orderItems.length}</span>
                                            <span className="modal-info">₱{selectedOrders.total.toLocaleString()}</span>
                                            <a 
                                              className="modal-info" 
                                              rel="noopener noreferrer" 
                                              target="_blank" 
                                              href={`https://localhost:7017/${selectedOrders.proofOfPayment}`} 
                                            >
                                              {selectedOrders.proofOfPayment.split('\\').pop()}
                                            </a>
                                            <span className="modal-info">{selectedOrders.referenceId}</span>
                                            <span className="modal-info">{PaymentType[Object.keys(PaymentType)[selectedOrders.paymentType - 1]]}</span>
                                            <span className="modal-info">{selectedOrders.cancellationReason}</span>
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
                                        <th className="text-center" scope="col">Gender</th>
                                        <th className="text-center" scope="col">Size</th>
                                        <th className="text-center" scope="col">Quantity</th>
                                        <th className="text-center" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrders && selectedOrders.orderItems && 
                                      (Status[Object.keys(Status)[selectedOrders.status - 1]] === Status.Canceled) && (
                                        selectedOrders.orderItems.map((item, index) => (
                                          <tr key={index}>
                                            <th scope="row">{item.product.productName}</th>
                                            <td>{getProductTypeName(item.product.productTypeId)}</td>
                                            <td className="text-center">{item.product.category}</td>
                                            <td className="text-center">{item.sizeQuantity.size}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center">₱{item.product.price.toLocaleString()}</td>
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
                  </div>
              </div>
          </div>   
      
        </div>
  )
}

export default Supplier_Orders