import { useEffect, useState } from 'react';
import './notif.css';
import noNotification from '../../assets/images/icons/no-spam.png'
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
          const [placed, pending, approved, pickup, completed] = getActiveStatus(
            notificationItem.order.status
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
                    <span className="font-weight-bold">{formatDate(notificationItem.order.estimateDate)}</span>
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
              style={{ width: '150px', height: '150px' }}
            />
            <p className="font-weight-bold mt-3" style={{ fontSize: '24px' }}>No notifications available</p>
          </div>
        </div>
      )}
    </div>
  )
}
export default Notif;