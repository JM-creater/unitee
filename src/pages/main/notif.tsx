import { useEffect, useState } from 'react';
import './notif.css';
import noNotification from '../../assets/images/icons/notification-bell.png'
import orderProcess from "../../assets/images/icons/orderProcessed.png"
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import notifEventEmitter from '../../helpers/NotifEventEmitter';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasons, setOtherReasons] = useState("");
  const { userId } = useParams();

  // * Show More / Less Notification
  const toggleShowAll = () => {
    setShowAllNotifications(!showAllNotifications);
  };

  // * Download Receipt in PDF
  const downloadReceipt = (orderNumber) => {
    const content = document.getElementById(`receipt-content-${orderNumber}`);
    html2canvas(content, { scrollY: -window.scrollY }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${orderNumber}.pdf`);
    });
  };

  // * Handle reason click radio
  const handleReasonClick = (e) => {
    const value = e.target.value;
    setSelectedReason(currentSelected => {
      if (currentSelected === value) {
        if (value === "Others") {
          setOtherReasons('');
        }
        return '';
      } else {
        if (value !== "Others") {
          setOtherReasons('');
        }
        return value;
      }
    });
  };
  
  // * Handle to add Id in local storage
  const handleAddLocalStorageId = (orderId) => {
    localStorage.setItem('orderId', orderId)
  };


  // * submit cancelation
  const submitCancellation = () => {
    const orderId = localStorage.getItem('orderId'); 
    if (!selectedReason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    HandleOrderCanceled(orderId, selectedReason);
  };

  // * Get Notifications 
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Notification/${userId}`);
        setNotification(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const validationListener = () => {
      fetchNotification();
    }

    notifEventEmitter.on("notifAdded", validationListener);
    fetchNotification();

    return () => {
      notifEventEmitter.off("notifAdded", validationListener);
    };
  }, [userId]);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Notification/${userId}`);
        setNotification(response.data);
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
        return [true, true, true, true, true];
    }
  }

  // * Get Order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Order/BySupplier/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    const validationListener = () => {
      fetchOrder();
    }

    notifEventEmitter.on("notifAdded", validationListener);
    fetchOrder();

    return () => {
      notifEventEmitter.off("notifAdded", validationListener);
    };
  }, [userId])

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Order/BySupplier/${userId}`);
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
  }, [userId]); 

  // * Function to handle canceling the order
  const HandleOrderCanceled = (orderId, reason) => {
    const close = document.getElementById('btnClose');
    axios.put(`https://localhost:7017/Order/orderCanceled/${orderId}`, { 
      cancellationReason: reason === "Others" ? otherReasons : selectedReason
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const updatedOrders = orders.filter(order => order.orderId !== response.data.Id);
      setOrders(updatedOrders);
      
      const updatedNotifications = notification.filter(notification => notification.orderId !== response.data.Id);
      setNotification(updatedNotifications); 

      toast.success("Order canceled successfully");
      notifEventEmitter.emit("notifAdded");
      close.click();
      setSelectedReason("");
      setOtherReasons("");
    })
    .catch(error => {
      console.error(error);
      toast.error("Failed to cancel the order. Please try again");
    });
  };

  // * Handle close button
  const HandleCloseButton = () => {
    setSelectedReason('');
    setOtherReasons('');
  };

  // * Update the Product Details Modal
  useEffect(() => {
      const modal = document.getElementById('cancellationModal') 
      if (modal) {
          modal.addEventListener('hidden.bs.modal', HandleCloseButton);

          return () => {
              modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
          };
      }
  }, []);

  return (
    <div className="container">
      {notification.length > 0 ? (
        notification.slice(0, showAllNotifications ? notification.length : 3).map((notificationItem, index) => {
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
                <div className="col-12 order-progress-container">
                  <ul id="progressbarCancel" className="text-center">
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
                  disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                  data-bs-toggle="modal" 
                  data-bs-target="#cancellationModal"
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
                  <ul id="progressbarCancel" className="text-center">
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
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                data-bs-toggle="modal" 
                data-bs-target="#cancellationModal"
              >
                Cancel Order
              </button>
              </div>
            </div>
            );
          }
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Pending") {
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
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total.toLocaleString()}</span>
                  </p>
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
                        <p className="font-weight-bold" style={{ fontSize: '14px' }}>
                          Order<br />Pending
                        </p>
                      </div>
                      <p style={{ fontSize: '12px' }}>
                        <span>{formatDate(notificationItem.order.dateUpdated)}</span>
                      </p>
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
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                data-bs-toggle="modal" 
                data-bs-target="#cancellationModal"
                onClick={() => handleAddLocalStorageId(notificationItem.orderId)}
              >
                Cancel Order
              </button>
              </div>
            </div>
            );
          }
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved") {
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
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total.toLocaleString()}</span>
                  </p>
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
                      <p style={{ fontSize: '12px' }}>
                        <span>{formatDate(notificationItem.order.dateUpdated)}</span>
                      </p>
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
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
              >
                Cancel Order
              </button>
              <button className='view-receipt-btn' data-bs-toggle="modal" data-bs-target="#viewReceiptModal" onClick={() => setSelectedOrderReceipt(notificationItem)}>View Order Receipt</button>
              </div>
            </div>
            );
          }
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp") {
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
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total.toLocaleString()}</span>
                  </p>
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
                      <p style={{ fontSize: '12px' }}>
                        <span>{formatDate(notificationItem.order.dateUpdated)}</span>
                      </p>
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
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
              >
                Cancel Order
              </button>
              {/* <a 
                className="show-more-btn-notif" 
                data-bs-toggle="collapse" 
                href="#collapseExample" 
                role="button"
                aria-expanded="false" 
                aria-controls="collapseExample"
              >
                Show more
              </a> */}
              <button className='view-receipt-btn' data-bs-toggle="modal" data-bs-target="#viewReceiptModal" onClick={() => setSelectedOrderReceipt(notificationItem)}>View Order Receipt</button>
              </div>
            </div>
            );
          }
          if (Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed") {
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
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total.toLocaleString()}</span>
                  </p>
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
                      <p style={{ fontSize: '12px' }}>
                        <span>{formatDate(notificationItem.order.dateUpdated)}</span>
                      </p>
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
                disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Canceled" ||
                            Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
              >
                Cancel Order
              </button>
              <button className='view-receipt-btn' data-bs-toggle="modal" data-bs-target="#viewReceiptModal" onClick={() => setSelectedOrderReceipt(notificationItem)}>View Order Receipt</button>
              </div>
            </div>
            );
          }
          const [placed, pending, approved, pickup, completed] = getActiveStatus (
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
                  <p>
                    Total Amount: <span className="font-weight-bold">₱{notificationItem.order.total.toLocaleString()}</span>
                  </p>
                  <p>
                    <span className="font-weight-bold" style={{ fontSize: '20px' }}>{notificationItem.message}</span>
                  </p>
                  {/* <p>
                    <span className="font-weight-bold">Estimated pickup date for your order. {formatDate(notificationItem.order.estimateDate)}</span>
                  </p> */}
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
                  disabled={Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Approved" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Denied" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "ForPickUp" || 
                              Status[Object.keys(Status)[notificationItem.order.status - 1]] === "Completed"}
                  data-bs-toggle="modal" 
                  data-bs-target="#cancellationModal"
                  onClick={() => handleAddLocalStorageId(notificationItem.orderId)}
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
              style={{ width: '100%', maxWidth:'80px', height: '80px' }}
            />
            <p className="mt-3" style={{ fontSize: '18px' }}>No notifications available</p>
          </div>
        </div>
      )}

      {notification.length > 3 && ( 
        <div className="card card-body">
          <button onClick={toggleShowAll} className="show-more-btn">
            {showAllNotifications ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

    {/* RECEIPT MODAL  */}
    <div className="modal fade" id="viewReceiptModal" tabIndex={-1} aria-labelledby="viewReceiptModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        {selectedOrderReceipt && (
            <div className="modal-content" id={`receipt-content-${selectedOrderReceipt.order.orderNumber}`}>
            <div className="modal-body" style={{ padding:'30px' }}>
              <div className='modal-receipt-header'>
                {/* HEADER */}
                <div className='order-num-receipt-header-container'>
                  <h2 className="modal-title" id="exampleModalLabel">Order Receipt</h2>
                  <h2 className='receipt-num-header'>#{selectedOrderReceipt.order.orderNumber}</h2>
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
                        <span>{selectedOrderReceipt.order.user.id}</span>
                        <span>{selectedOrderReceipt.order.user.firstName}</span>
                        <span>{selectedOrderReceipt.order.user.lastName}</span>
                        <span>{selectedOrderReceipt.order.referenceId}</span>
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
                        <span>{selectedOrderReceipt.order.orderNumber}</span>
                        <span>{selectedOrderReceipt.order.orderItems.length}</span>
                        <span>{selectedOrderReceipt.order.cart.supplier.shopName}</span>
                      </div>
                    </div>
                  </div>
  
                  {/* TOTAL AMOUNT */}
                  <div className='order-info-totalAmount-receiptContainer'>
                    <div className='total-amount-text-receipt'>
                      <h4 className='totalAmount-receipt'>Total Amount</h4>
                    </div>
                    <div className='total-amount-receipt'>
                      <h4 className='receipt-amount'>₱{selectedOrderReceipt.order.total.toLocaleString()}</h4>
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
                        <th className='text-center' scope="col">Size</th>
                        <th className='text-center' scope="col">Quantity</th>
                        <th className='text-center' scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrderReceipt && selectedOrderReceipt.order && selectedOrderReceipt.order.orderItems.map((item, index) => ( 
                        <tr key={index}>
                          <th scope="row">{item.product.productName}</th>
                          <td className='text-center'>{item.sizeQuantity.size}</td>
                          <td className='text-center'>{item.quantity}</td>
                          <td className='text-center'>₱{item.product.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  
            </div>
            <div className="modal-footer">
              <button type="button" className="close-receipt-btn" data-bs-dismiss="modal">Close</button>
              <button type="button" className="save-receipt-btn" onClick={() => downloadReceipt(selectedOrderReceipt.order.orderNumber)}>Download</button>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="modal fade" id="cancellationModal" tabIndex={-1} role="dialog" aria-labelledby="cancellationModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content w-80">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel2">Please select a reason for cancellation:</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btnClose"></button>
          </div>
          <div className="modal-body p-4">
            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="wrongRefNumber" 
                name="cancelReason" 
                value="Wrong reference number inputted"
                className="form-check-input" 
                checked={selectedReason === "Wrong reference number inputted"}
                onChange={handleReasonClick} 
              />
              <label className="form-check-label" htmlFor="wrongRefNumber">Wrong reference number inputted</label>
            </div>

            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="changeOfMind" 
                name="cancelReason" 
                value="Change of mind"
                className="form-check-input" 
                checked={selectedReason === "Change of mind"}
                onChange={handleReasonClick} 
              />
              <label className="form-check-label" htmlFor="changeOfMind">Change of mind</label>
            </div>

            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="modifyOrder" 
                name="cancelReason" 
                value="Need to modify order (size, quantity, etc)"
                className="form-check-input" 
                checked={selectedReason === "Need to modify order (size, quantity, etc)"}
                onChange={handleReasonClick} 
              />
              <label className="form-check-label" htmlFor="modifyOrder">Need to modify order (size, quantity, etc)</label>
            </div>

            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="foundAlternative" 
                name="cancelReason" 
                value="Found an alternative"
                className="form-check-input" 
                checked={selectedReason === "Found an alternative"}
                onChange={handleReasonClick} 
              />
              <label className="form-check-label" htmlFor="foundAlternative">Found an alternative</label>
            </div>

            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="notBuy" 
                name="cancelReason" 
                value="Don't want to buy anymore"
                className="form-check-input" 
                checked={selectedReason === "Don't want to buy anymore"}
                onChange={handleReasonClick} 
              />
              <label className="form-check-label" htmlFor="notBuy">Don't want to buy anymore</label>
            </div>

            <div className="form-check mb-4">
              <input 
                type="radio" 
                id="others" 
                name="cancelReason" 
                value="Others"
                className="form-check-input" 
                checked={selectedReason === "Others"}
                onChange={handleReasonClick}
              />
              <label className="form-check-label" htmlFor="others">Others</label>
            </div>

            {selectedReason === "Others" && (
              <div className="form-group">
                <label htmlFor="otherReasons">Enter other reasons:</label>
                <input
                  type="text"
                  id="otherReasons"
                  name="otherReasons"
                  className="form-control"
                  placeholder="Enter other reasons here"
                  value={otherReasons}
                  onChange={(e) => setOtherReasons(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" onClick={submitCancellation}>Cancel Order</button>
            <button type="submit" className="btn btn-danger btn-block" data-bs-dismiss="modal" onClick={HandleCloseButton}>NOT NOW</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
export default Notif;