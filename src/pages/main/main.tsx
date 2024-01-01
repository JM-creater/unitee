import { Outlet } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import "./main.css";
import logo from "../../assets/images/unitee.png";
import profIcon from "../../assets/images/icons/profile2.png";
import logout from "../../assets/images/icons/logout-3.png";
import homeIcon from "../../assets/images/icons/homeIcon.png";
import carts from "../../assets/images/icons/cartIcon.png";
import orders from "../../assets/images/icons/shopping-bag-4.png";
import notification from "../../assets/images/icons/notifIcon.png";
//import chatCustomer from "../../assets/images/icons/chat.png";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import cartEventEmitter from "../../helpers/EventEmitter";
import notifEventEmitter from "../../helpers/NotifEventEmitter";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import navEmptyCartImg from "../../assets/images/icons/empty-cart.png";
import LogoutLoadingScreen from "../common/LogoutLoadingScreen";
import React from "react";

function Main() {
  interface Customer {
    image: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notifItem, setNotifItem] = useState([]);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [cart, setCart] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const HandleLogoutModal = async () => {
    setIsLoggingOut(true);
    setShowLogoutModal(!showLogoutModal);
    await sleep(10000);
    navigate("/");
  };

  // * Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Users/${userId}`);
        setCustomer(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [userId]);

  // * Fetch Updated Cart
  useEffect(() => {
    const updateCartCount = () => {
      axios
        .get(`https://localhost:7017/Cart/myCart/${userId}`)
        .then(async(res) => {
          setCart(res.data);
          setTotalItems(
            res.data.reduce((acc, cartItems) => acc + cartItems.items.length, 0)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    };

    cartEventEmitter.on("itemAddedToCart", updateCartCount);
    cartEventEmitter.on("cartEmptied", updateCartCount);
    cartEventEmitter.on("cartUpdated", updateCartCount);
    updateCartCount();

    return () => {
      cartEventEmitter.off("itemAddedToCart", updateCartCount);
      cartEventEmitter.off("cartEmptied", updateCartCount);
      cartEventEmitter.off("cartUpdated", updateCartCount);
    };
  }, [userId]);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Cart/myCart/${userId}`
        );
        setCart(response.data);
      } catch (error) {
        console.error("Network error or server not responding");
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [userId]);

  // * Unread Notification
  const updateNotification = useCallback(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Notification/unread/${userId}`
        );
        setNotifItem(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotification();
  }, [userId]);

  useEffect(() => {
    const validListener = () => {
      updateNotification();
    };

    notifEventEmitter.on("notifAdded", validListener);

    return () => {
      notifEventEmitter.off("notifAdded", validListener);
    };
  }, [userId, updateNotification]);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Notification/unread/${userId}`
        );
        setNotifItem(response.data);
      } catch (error) {
        console.error("Network error or server not responding");
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [userId]);

  // * Mark as Read in Notification
  const handleNotificationClick = () => {
    const fetchNotificationClick = async () => {
      try {
        await axios.post(
          `https://localhost:7017/Notification/markRead/${userId}`
        );
        updateNotification();
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotificationClick();
  };

  // * Notification Hub in SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7017/notificationHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connection.on("OrderStatusUpdated", (message) => {
      toast.success(`New Notification: ${message}`);
      updateNotification();
    });
  }, [updateNotification]);

  return (
    <React.Fragment>
      {isLoggingOut ? (
        <React.Fragment>
          <LogoutLoadingScreen />
        </React.Fragment>
      ) : (
        <div className="main">
          <header
            className="header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to="" className="col-md-2">
              <img className="logo" src={logo} />
            </Link>

            <div className="col-md-6 header-button-container">
              <Link className="customer-nav-link" to="" id="tooltip">
                <span id="tooltip-text">Home</span>
                <img className="nav-icon" src={homeIcon} />
              </Link>

              <div className="customer-nav-link">
                <div className="cart-icon-container">
                  <Link to="cart">
                    <img className="nav-icon" src={carts} />
                    {totalItems !== null && totalItems > 0 && (
                      <span className="cart-count">{totalItems}</span>
                    )}
                  </Link>

                  <div className="cart-dropdown">
                    {cart.length > 0 ? (
                      cart.reduce((acc, cartObj, cartIndex) => {
                        if (acc.length < 5) {
                          acc.push(
                            ...cartObj.items
                              .slice(0, 5 - acc.length)
                              .map((item, itemIndex) => (
                                <Link
                                  to={`visit_shop/${cartObj.supplierId}`}
                                  key={`cart-item-${cartIndex}-${itemIndex}`}
                                >
                                  <div className="cart-dropdown-item">
                                    <img
                                      className="dropdown-image"
                                      src={`https://localhost:7017/${item.product.image}`}
                                      alt={item.product.productName}
                                      width="50"
                                      height="50"
                                    />
                                    <span className="dropdown-productName">
                                      {item.product.productName}
                                    </span>
                                    <span className="dropdown-price">
                                      ₱{item.product.price}
                                    </span>
                                  </div>
                                </Link>
                              ))
                          );
                        }
                        return acc;
                      }, [])
                    ) : (
                      <div className="pop-up-empty-cart-message">
                        <img
                          className="pop-up-empty-cart-img"
                          src={navEmptyCartImg}
                          alt="Empty Cart"
                        />
                        Your cart is empty.
                      </div>
                    )}
                    <div className="cart-dropdown-footer">
                      <div className="itemsTotal">
                        {totalItems && totalItems > 0
                          ? `${totalItems} Products In Cart`
                          : "No Products In Cart"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                className="customer-nav-link"
                to="notif"
                onClick={handleNotificationClick}
              >
                <div className="notif-icon-container" id="tooltip">
                  <span id="tooltip-text">Notification</span>
                  <img className="nav-icon" src={notification} />
                  {notifItem.length > 0 && (
                    <span className="notif-count">{notifItem.length}</span>
                  )}
                </div>
              </Link>

              <div className="col-md-1 dropdown">
                {customer ? (
                  <React.Fragment>
                    <img
                      className="imageProfile"
                      src={`https://localhost:7017/${customer.image}`}
                      style={{
                        width: "100%",
                        maxWidth: "30px",
                        borderStyle: "solid",
                        borderRadius: "50%",
                        maxHeight: "30px",
                        borderColor: "#D3D3D3",
                      }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  </React.Fragment>
                ) : null}
                <ul
                  className="dropdown-menu dropdown-menu-light"
                  style={{ width: "300px" }}
                >
                  <Link
                    className="customer-nav-droplink"
                    to="viewCustomer_profile"
                  >
                    <li>
                      <a className="dropdown-item">
                        <img className="dropdown-icon" src={profIcon} />
                        VIEW PROFILE
                      </a>
                    </li>
                  </Link>

                  <Link className="customer-nav-droplink" to="purchase_history">
                    <li>
                      <a className="dropdown-item">
                        <img className="dropdown-icon" src={orders} alt="" />
                        PURCHASE HISTORY
                      </a>
                    </li>
                  </Link>

                  <div className="logout-container">
                    <li>
                      <button
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#logoutModal"
                      >
                        <span className="nav-btn" style={{ color: "#FFAA00" }}>
                          <img className="dropdown-icon" src={logout} />
                          LOGOUT
                        </span>
                      </button>
                    </li>
                  </div>
                </ul>
              </div>
              <div className="modal fade" id="logoutModal" tabIndex={1} aria-labelledby="logoutModalLabel" aria-hidden={!showLogoutModal}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="logout-confirmation-modalBody">
                      <h3>Are you sure you want to logout?</h3>
                      <div className="col-md-12 logout-btn-container">
                        <button className="logout-btn" data-bs-dismiss="modal" onClick={HandleLogoutModal}>
                          Log Out
                        </button>
                        <button className="cancel-logout-btn" data-bs-dismiss="modal">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div style={{ minHeight: "100%" }}>
            <Outlet />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Main;
