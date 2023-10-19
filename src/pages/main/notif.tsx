import { useEffect, useState } from 'react';
import './notif.css';
import orderProcess from "../../assets/images/icons/orderProcessed.png"
import axios from 'axios';
import { useParams } from 'react-router';

function Notif() {

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
          return [true, false, false, false];
      case 2: 
          return [true, true, false, false];
      case 3: 
          return [true, true, true, false];
      case 4: 
          return [true, true, true, true];
      default:
          return [false, false, false, false];
  }
  }

  return (
    <div className="container px-1 px-md-4 py-5 mx-auto">
      {notification.map((notificationItem, index) => {
        const [placed, approved, pickup, completed] = getActiveStatus(notificationItem.order.status);
        return (
        <div key={index} className="card">
          <div className="row d-flex justify-content-between px-3 top">
            <div className="d-flex">
              <h5>
                ORDER <span className="text-primary font-weight-bold">#{notificationItem.order.orderNumber}</span>
              </h5>
            </div>
            <div className="d-flex flex-column text-sm-right">
              <p className="mb-0">
                Expected Arrival <span>{formatDate(notificationItem.dateCreated)}</span>
              </p>
              <p>
                Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total}</span>
              </p>
            </div>
          </div>
          {/* Add class 'active' to progress */}
          <div className="row d-flex justify-content-center">
            <div className="col-12">
                <ul id="progressbar" className="text-center">
                    <li className={placed ? "active step0" : "step0"}></li>
                    <li className={approved ? "active step0" : "step0"}></li>
                    <li className={pickup ? "active step0" : "step0"}></li>
                    <li className={completed ? "active step0" : "step0"}></li>
                </ul>
            </div>
          </div>
          <div className="row justify-content-between top">
            <div className="col-md-3 mb-3 d-flex icon-content">
                <img className="icon" src={ orderProcess } alt="Order Processed Icon" style={{ width: '60px', height: '60px' }} />
                <div className="d-flex flex-column">
                <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Placed</p>
                </div>
            </div>
            <div className="col-md-3 mb-3 d-flex icon-content">
                <img className="icon" src={ orderProcess } alt="Order Shipped Icon" style={{ width: '60px', height: '60px' }} />
                <div className="d-flex flex-column">
                <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Approved</p>
                </div>
            </div>
            <div className="col-md-3 mb-3 d-flex icon-content">
                <img className="icon" src={ orderProcess } alt="Order En Route Icon" style={{ width: '60px', height: '60px' }} />
                <div className="d-flex flex-column">
                <p className="font-weight-bold" style={{ fontSize: '14px' }}>For<br />Pick Up</p>
                </div>
            </div>
            <div className="col-md-3 mb-3 d-flex icon-content">
                <img className="icon" src={ orderProcess } alt="Order Arrived Icon" style={{ width: '60px', height: '60px' }} />
                <div className="d-flex flex-column">
                <p className="font-weight-bold" style={{ fontSize: '14px' }}>Order<br />Completed</p>
                </div>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}
export default Notif
