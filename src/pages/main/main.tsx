import { Outlet } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import "./main.css";
import logo from "../../assets/images/unitee.png";
import profIcon from "../../assets/images/icons/viewProfile.png";
import logout from "../../assets/images/icons/logout-3.png";
import homeIcon from "../../assets/images/icons/homeIcon.png";
import carts from "../../assets/images/icons/cartIcon.png";
import orders from "../../assets/images/icons/purchHisto.png";
import notification from "../../assets/images/icons/notifIcon.png";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import cartEventEmitter from "../../helpers/EventEmitter";
import notifEventEmitter from "../../helpers/NotifEventEmitter";
import navEmptyCartImg from "../../assets/images/icons/empty-cart.png";
import LogoutLoadingScreen from "../common/LogoutLoadingScreen";
import React from "react";
import { useAuth } from "../../utils/AuthContext";

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
  const { setLogout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  // * Handle Search Input
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // * Navigate Search
  const performSearch = (searchCriteria = searchTerm) => {
    if (searchCriteria !== "") {
      setSearchTerm(searchCriteria);
      navigate(`/shop/${userId}/search_product?search=${searchCriteria}`);
    } else {
      return;
    }
  };

  // * Search Product Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Product/searchByDepartment?userId=${userId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [userId]);

  // * Get All Product Types
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await axios.get("https://localhost:7017/ProductType");
        setProductTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductType();
  }, []);

  // * Get Product Type Name
  const getProductTypeName = (productTypeId) => {
    const productType = productTypes.find(
      (p) => p.productTypeId === productTypeId
    );
    return productType ? productType.product_Type : "Unknown Type";
  };

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const HandleLogoutModal = async () => {
    setIsLoggingOut(true);
    setShowLogoutModal(!showLogoutModal);
    await sleep(10000);
    setLogout();
    navigate("/");
  };

  // * Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Users/${userId}`
        );
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
        .then(async (res) => {
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

            <div className="search-container">
              <span className="fa fa-search form-control-feedback search-icon"></span>
              <input
                className="Product-SearchBar"
                type="text"
                placeholder="Search Product"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    performSearch();
                    setSearchTerm("");
                  }
                }}
              />
              <div className="search-dropdown">
                {products
                  .filter((productFilter) => {
                    const searchTermLowerCase = searchTerm.toLowerCase();
                    const productName =
                      productFilter.productName?.toLowerCase();
                    const productTypeName = getProductTypeName(
                      productFilter.productTypeId
                    ).toLowerCase();
                    const category = productFilter.category?.toLowerCase();
                    const description =
                      productFilter.description?.toLowerCase();

                    return (
                      searchTermLowerCase &&
                      (productName?.includes(searchTermLowerCase) ||
                        productTypeName?.includes(searchTermLowerCase) ||
                        category?.includes(searchTermLowerCase) ||
                        description?.includes(searchTermLowerCase))
                    );
                  })
                  .slice(0, 5)
                  .map((productData, index) => {
                    const searchTermLowerCase = searchTerm.toLowerCase();
                    const productName = productData.productName?.toLowerCase();
                    const productTypeName = getProductTypeName(
                      productData.productTypeId
                    ).toLowerCase();
                    const category = productData.category?.toLowerCase();
                    const description = productData.description?.toLowerCase();

                    let displayText = "";
                    let searchCriteria = "";

                    // * Helper function to bold the matching letters
                    const highlightMatch = (text, searchTerm) => {
                      const matchIndex = text.indexOf(searchTerm);
                      if (matchIndex !== -1) {
                        return (
                          <React.Fragment>
                            {text.substring(0, matchIndex)}
                            <strong>
                              {text.substring(
                                matchIndex,
                                matchIndex + searchTerm.length
                              )}
                            </strong>
                            {text.substring(matchIndex + searchTerm.length)}
                          </React.Fragment>
                        );
                      }
                      return text;
                    };

                    if (productName?.includes(searchTermLowerCase)) {
                      displayText = highlightMatch(
                        productData.productName.toLowerCase(),
                        searchTermLowerCase
                      );
                      searchCriteria = productData.productName.toLowerCase();
                    } else if (productTypeName?.includes(searchTermLowerCase)) {
                      displayText = highlightMatch(
                        productTypeName.toLowerCase(),
                        searchTermLowerCase
                      );
                      searchCriteria = productTypeName.toLowerCase();
                    } else if (category?.includes(searchTermLowerCase)) {
                      displayText = highlightMatch(
                        productData.category.toLowerCase(),
                        searchTermLowerCase
                      );
                      searchCriteria = productData.category.toLowerCase();
                    } else if (description?.includes(searchTermLowerCase)) {
                      displayText = highlightMatch(
                        productData.description.toLowerCase(),
                        searchTermLowerCase
                      );
                      searchCriteria = productData.description.toLowerCase();
                    }

                    return (
                      <div
                        key={index}
                        className="search-dropdown-row"
                        onClick={() => {
                          performSearch(searchCriteria);
                          setSearchTerm("");
                        }}
                      >
                        <img
                          src={`https://localhost:7017/${productData.image}`}
                          width={30}
                          height={30}
                          style={{ marginRight: "10px" }}
                        >
                        </img>
                        <span className="form-control-feedback">
                          {displayText}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <input type="checkbox" id="menu" hidden />
            <label className="navLabel" htmlFor="menu">
              <i className="fa-solid fa-bars"></i>
            </label>

            <div className="col-md-3 header-button-container">
              <label className="navLabel" htmlFor="menu">
                <i className="fa-solid fa-xmark"></i>
              </label>
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
                              .slice(0, 4 - acc.length)
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
                                      {item.product.price ? item.product.price.toLocaleString('en-US', {
                                          style: 'currency',
                                          currency: 'PHP',
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2
                                        })
                                      : "₱0.00"}
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

              <div className="dropdown">
                {customer ? (
                  <React.Fragment>
                    <img
                      className="imageProfile"
                      src={`https://localhost:7017/${customer.image}`}
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
              <div
                className="modal fade"
                id="logoutModal"
                tabIndex={1}
                aria-labelledby="logoutModalLabel"
                aria-hidden={!showLogoutModal}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="logout-confirmation-modalBody">
                      <h3>Are you sure you want to logout?</h3>
                      <div className="col-md-12 logout-btn-container">
                        <button
                          className="logout-btn"
                          data-bs-dismiss="modal"
                          onClick={HandleLogoutModal}
                        >
                          Log Out
                        </button>
                        <button
                          className="cancel-logout-btn"
                          data-bs-dismiss="modal"
                        >
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
