import { useEffect, useState } from 'react';
import './notif.css';
import noNotification from '../../assets/images/icons/notification-bell.png'
import orderProcess from "../../assets/images/icons/orderProcessed.png"
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import notifEventEmitter from '../../helpers/NotifEventEmitter';

function Notif() {

  const Status = {
    OrderPlaced: 'OrderPlaced',
    Pending: 'Pending',
    Approved: 'Approved',
    ForPickUp: 'ForPickUp',
    Completed: 'Completed',
    Canceled: 'Canceled',
    Denied: 'Denied'
  };


  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    axios.get(`https://localhost:7017/Notification/${userId}`)
      .then(response => {
        setNotification(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const getActiveStatus = (status) => {
    switch (status) {
      case 1:
        return [true, false, false, false, false];
      case 2:
        return [true, true, false, false, false];
      case 3: 
        return [true, true, true, false, false];
      case 4: 
        return [true, true, true, true, false];
      case 5: 
        return [true, true, true, true, true];
      default:
        return [false, false, false, false, false];
    }
  }

  useEffect(() => {
    axios.get(`https://localhost:7017/Order/BySupplier/${userId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [userId])

  // Function to handle canceling the order:
const HandleOrderCanceled = (orderId) => {
  axios.put(`https://localhost:7017/Order/orderCanceled/${orderId}`)
      .then(response => {
          const updatedOrders = orders.filter(order => order.orderId !== response.data.Id);
          setOrders(updatedOrders);
          
          const updatedNotifications = notification.filter(notification => notification.orderId !== response.data.Id);
          setNotification(updatedNotifications); 

          toast.success("Order canceled successfully");
          notifEventEmitter.emit("notifAdded");
      })
      .catch(error => {
          console.error(error);
          toast.error("Failed to cancel the order. Please try again");
      });
}

  return (
    <div className="container">
      {notification.length > 0 ? (
        notification.map((notificationItem, index) => {
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied") {
            const [placed, pending, approved, pickup, completed] = getActiveStatus(
              Status[Object.keys(Status)[notificationItem.order.status - 1]]
            );
            return (
              <div key={index} className="card">
              <div className="row d-flex justify-content-between px-3 top">
                <div className="d-flex">
                  <h5>
                    <span className="text-primary font-weight-bold">#{notificationItem.order.orderNumber}</span>
                  </h5>
                </div>
                <div className="d-flex flex-column text-sm-left">
                  <p>
                    <span className="font-weight-bold" style={{ fontSize: '20px' }}>{notificationItem.message}</span>
                  </p>
                </div>
              </div>
              {/* Add class 'active' to progress */}
              <div className="row d-flex justify-content-center">
                <div className="col-12">
                  <ul id="progressbar" className="text-center">
                    <li className={placed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Processed Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px'}}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Placed</p>
                      </div>
                    </li>
                    <li className={pending ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Pending</p>
                      </div>
                    </li>
                    <li className={approved ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Approved</p>
                      </div>
                    </li>
                    <li className={pickup ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order En Route Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>For<br />Pick Up</p>
                      </div>
                    </li>
                    <li className={completed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Arrived Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Completed</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
              <button 
                className={`btn ${Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed" ? 'btn-secondary' : 'btn-danger'}`}
                  style={{ marginLeft: '30px' }} 
                  onClick={() => HandleOrderCanceled(notificationItem.orderId)}
                  disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                >
                Cancel Order
              </button>
              </div>
            </div>
            );
          }
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled") {
            const [placed, pending, approved, pickup, completed] = getActiveStatus(
              Status[Object.keys(Status)[notificationItem.order.status - 1]]
            );
            return (
              <div key={index} className="card">
              <div className="row d-flex justify-content-between px-3 top">
                <div className="d-flex">
                  <h5>
                    <span className="text-primary font-weight-bold">#{notificationItem.order.orderNumber}</span>
                  </h5>
                </div>
                <div className="d-flex flex-column text-sm-left">
                  <p>
                    <span className="font-weight-bold" style={{ fontSize: '20px' }}>{notificationItem.message}</span>
                  </p>
                </div>
              </div>
              {/* Add class 'active' to progress */}
              <div className="row d-flex justify-content-center">
                <div className="col-12">
                  <ul id="progressbar" className="text-center">
                    <li className={placed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Processed Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px'}}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Placed</p>
                      </div>
                    </li>
                    <li className={pending ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Pending</p>
                      </div>
                    </li>
                    <li className={approved ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Approved</p>
                      </div>
                    </li>
                    <li className={pickup ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order En Route Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>For<br />Pick Up</p>
                      </div>
                    </li>
                    <li className={completed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Arrived Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Completed</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
              <button 
                className={`btn ${Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed" ? 'btn-secondary' : 'btn-danger'}`}
                style={{ marginLeft: '30px' }} 
                onClick={() => HandleOrderCanceled(notificationItem.orderId)}
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
              >
                Cancel Order
              </button>
              </div>
            </div>
            );
          }
          const [placed, pending, approved, pickup, completed] = getActiveStatus(
            notificationItem.order.status
          );
          return (
            <div key={index} className="card">
              <div className="row d-flex justify-content-between px-3 top">
                <div className="d-flex">
                  <h5>
                    <span className="text-primary font-weight-bold" style={{ fontSize:'18px' }}>#{notificationItem.order.orderNumber}</span>
                  </h5>
                </div>
                <div className="d-flex flex-column text-sm-left">
                  <p className="mb-0">
                    Order Created: <span>{formatDate(notificationItem.dateCreated)}</span>
                  </p>
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total}</span>
                  </p>
                  <p>
                    <span className="font-weight-bold" style={{ fontSize: '20px' }}>{notificationItem.message}</span>
                  </p>
                  <p>
                    <span className="font-weight-bold">Estimated pickup date for your order. {formatDate(notificationItem.order.estimateDate)}</span>
                  </p>
                </div>
              </div>
              {/* Add class 'active' to progress */}
              <div className="row d-flex justify-content-center">
                <div className="col-12">
                  <ul id="progressbar" className="text-center">
                    <li className={placed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Processed Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px'}}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Placed</p>
                      </div>
                    </li>
                    <li className={pending ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Pending</p>
                      </div>
                    </li>
                    <li className={approved ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Shipped Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Approved</p>
                      </div>
                    </li>
                    <li className={pickup ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order En Route Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>For<br />Pick Up</p>
                      </div>
                    </li>
                    <li className={completed ? "active step0" : "step0"}>
                      <div className="icon-content">
                        <img
                          className="icon"
                          src={orderProcess}
                          alt="Order Arrived Icon"
                          style={{ width: '60px', height: '60px', marginLeft: '70px' }}
                        />
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Completed</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
              <button 
                className={`btn ${Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed" ? 'btn-secondary' : 'btn-danger'}`}
                  style={{ marginLeft: '30px' }} 
                  onClick={() => HandleOrderCanceled(notificationItem.orderId)}
                  disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                >
                Cancel Order
              </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className='notifItem-container'>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', textAlign: 'center' }}>
            <img
              className="icon"
              src={noNotification}
              alt="No Notifications Icon"
              style={{ width: '100%', maxWidth:'100px', height: '100px' }}
            />
            <p className="font-weight-bold mt-3" style={{ fontSize: '24px' }}>No notifications available</p>
          </div>
        </div>
      )}

<p className="d-inline-flex gap-1">
  <a className="show-more-btn-notif" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    Show more
  </a>
  {/* <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Button with data-bs-target
  </button> */}
</p>
<div className="collapse" id="collapseExample">
  <div className="card card-body">
    {/* BUTTON TO VIEW RECEIPT */}
    <button className='view-receipt-btn' data-bs-toggle="modal" data-bs-target="#viewReceiptModal">View Order Receipt</button>
  </div>
</div>

{/* RECEIPT MODAL  */}
<div className="modal fade" id="viewReceiptModal" tabIndex={-1} aria-labelledby="viewReceiptModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="modal-content">
      <div className="modal-body" style={{ padding:'30px' }}>
        <div className='modal-receipt-header'>
          {/* HEADER */}
          <div className='order-num-receipt-header-container'>
            <h2 className="modal-title" id="exampleModalLabel">Order Receipt</h2>
            <h2 className='receipt-num-header'>#543523423</h2>
          </div>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className='order-details-itemList-container'>
            {/* ORDER DETAILS */}
          <div className='col-md-6 notif-order-details-label'>
            {/* CUSTOMER INFORMATION */}
            <div className='customer-info-container-notif'>
              <h4 className='notif-order-details-subTitle'>Customer Details</h4>
              <div className='notif-order-details-container'>
                <div className='notif-order-details-1'>
                  <span>ID Number</span>
                  <span>First Name</span>
                  <span>Last Name</span>
                  <span>Reference ID (GCash)</span>
                </div>

                <div className='notif-order-details-2'>
                  <span>ID Number</span>
                  <span>First Name</span>
                  <span>Last Name</span>
                  <span>Reference ID (GCash)</span>
                </div>
              </div>
            </div>

            {/* ORDER INFORMATION */}
            <div className='order-info-container-notif'>
              <h4 className='notif-order-details-subTitle'>Order Details</h4>
              <div className='notif-order-details-container'>
                <div className='notif-order-details-1'>
                  <span>Order Number</span>
                  <span>Number of items</span>
                  <span>Shop Name</span>
                </div>

                <div className='notif-order-details-2'>
                  <span>Order Number</span>
                  <span>Number of items</span>
                  <span>Shop Name</span>
                </div>
              </div>
            </div>

            {/* TOTAL AMOUNT */}
            <div className='order-info-totalAmount-receiptContainer'>
              <div className='total-amount-text-receipt'>
                <h4 className='totalAmount-receipt'>Total Amount</h4>
              </div>
              <div className='total-amount-receipt'>
                <h4 className='receipt-amount'>4000</h4>
              </div>
            </div>
          </div> 
          {/* END OF ORDER DETAILS CONTAINER */}
          <div className='col-md-6 item-list-container-receipt'>
            <h4 style={{ borderBottom:'solid 2px #F0F0F0' }}>Item List</h4>
            <table className="table align-middle receipt-itemList ">
              <thead className='table-secondary'>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Size</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Sample</th>
                  <td>M</td>
                  <td>5</td>
                  <td>1243</td>
                </tr>
                <tr>
                  <th scope="row">Sample</th>
                  <td>S</td>
                  <td>12</td>
                  <td>123</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      
      </div>
      <div className="modal-footer">
        <button type="button" className="close-receipt-btn" data-bs-dismiss="modal">Close</button>
        <button type="button" className="save-receipt-btn">Download</button>
      </div>
    </div>
  </div>
</div>


    </div>
  )
}
export default Notif;