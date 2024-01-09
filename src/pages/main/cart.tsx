import gcash from "../../assets/images/shop_products/gcash.png";
import remove from "../../assets/images/icons/trash.png";
import "./cart.css";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import cartEventEmitter from "../../helpers/EventEmitter";
import Modal from "bootstrap/js/dist/modal";
import notifEventEmitter from "../../helpers/NotifEventEmitter";
import orderEventEmitter from "../../helpers/OrderEmitter";
import emptyCartImg from "../../assets/images/icons/empty-cart.png";

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (message: string, type: number) => {
  if (type === 1) {
    toast.success(message, {
      style: {
        border: "1px solid #020654",
        padding: "16px",
        color: "#020654",
      },
      iconTheme: {
        primary: "#020654",
        secondary: "#FFFAEE",
      },
    });
  } else if (type === 2)
    toast(message, {
      icon: "👏",
    });
  else toast.error(message);
};

function Cart() {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItemsChecked, setTotalItemsChecked] = useState(0);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [referenceId, setReferenceId] = useState("");
  const [selectedPhoneShop, setSelectedPhoneShop] = useState("");
  const [, setSelectedShopId] = useState(null);
  const [lastErrorMessage, setLastErrorMessage] = useState("");
  const { userId } = useParams();
  const fileInputRef = useRef(null);
  const [, setSelectedShopIndex] = useState(null);

  // * Handle Reference Id
  const handleReferenceId = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setReferenceId(value);
      setLastErrorMessage("");
    } else if (lastErrorMessage !== "Reference ID must contain only numbers.") {
      toast.error("Reference ID must contain only numbers.");
      setLastErrorMessage("Reference ID must contain only numbers.");
    }
  };

  // * Get Cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Cart/myCart/${userId}`
        );
        setCart(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const validationListener = () => {
      fetchCart();
    };

    orderEventEmitter.on("orderCartEmptied", validationListener);
    fetchCart();

    return () => {
      orderEventEmitter.off("orderCartEmptied", validationListener);
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

  // * Handle Image
  const handleProofOfPaymentChange = (event) => {
    setProofOfPayment(event.target.files[0]);
  };

  // * Calculate the total amount
  const calculateTotalAmount = () => {
    let count = 0;
    const amount = cart.reduce((sum, cartItem) => {
      return (
        sum +
        cartItem.items.reduce((sumItem, item) => {
          if (
            (
              document.getElementById(
                `prodCheckbox-${item.id}`
              ) as HTMLInputElement
            ).checked
          ) {
            count += 1;
            return sumItem + (item.product.price || 0) * item.quantity;
          }
          return sumItem;
        }, 0)
      );
    }, 0);
    setTotalAmount(amount);
    setTotalItemsChecked(count);
  };

  // * Handle Minus Quantity
  const HandleMinusQuantity = (index, itemIndex) => {
    const updatedCart = [...cart];
    if (updatedCart[index].items[itemIndex].quantity > 0) {
      updatedCart[index].items[itemIndex].quantity -= 1;
    }
    setCart(updatedCart);
    calculateTotalAmount();
  };

  // * Handle Plus Quantity
  const HandlePlusQuantity = async (index, itemIndex) => {
    const updatedCart = [...cart];
    const currentQuantity = updatedCart[index].items[itemIndex].quantity;
    const availableQuantity = await getAvailableQuantity(
      updatedCart[index].items[itemIndex].productId,
      updatedCart[index].items[itemIndex].sizeQuantityId
    );

    if (currentQuantity < availableQuantity) {
      updatedCart[index].items[itemIndex].quantity += 1;
      setCart(updatedCart);
      calculateTotalAmount();
    } else {
      showToast(
        `Maximum quantity of ${availableQuantity} for this size reached`,
        3
      );
    }
  };

  // * Get the Available quantity for each sizes
  const getAvailableQuantity = async (productId, sizeQuantityId) => {
    try {
      const response = await axios.get(
        `https://localhost:7017/Product/getQuantity?productId=${productId}&sizeQuantityId=${sizeQuantityId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available quantity:", error);
    }
  };

  // * Handle Size Change
  const handleSizeChange = async (index, itemIndex, newSizeIdString) => {
    const newSizeId = parseInt(newSizeIdString);
    if (isNaN(newSizeId)) {
      return;
    }
    const updatedCart = [...cart];
    updatedCart[index].items[itemIndex].sizeQuantityId = newSizeId;

    const newSize = updatedCart[index].items[itemIndex].product.sizes.find(
      (size) => size.id === newSizeId
    );
    const availableQuantity = await getAvailableQuantity(
      updatedCart[index].items[itemIndex].productId,
      newSizeId
    );

    if (
      newSize &&
      updatedCart[index].items[itemIndex].quantity > availableQuantity
    ) {
      showToast(
        `Only ${availableQuantity} items left in stock for size ${newSize.size}`,
        3
      );
      updatedCart[index].items[itemIndex].quantity = availableQuantity;
    }

    setCart(updatedCart);
  };

  // * Handle Shop Cart
  const handleShopCheckboxChange = (cartIndex) => {
    cart.forEach((shop, index) => {
      if (index !== cartIndex) {
        const otherShopCheckbox = document.getElementById(
          `shopRadio-${shop.supplierId}`
        ) as HTMLInputElement;
        if (otherShopCheckbox) otherShopCheckbox.checked = false;
        shop.items.forEach((item) => {
          const itemCheckbox = document.getElementById(
            `prodCheckbox-${item.id}`
          ) as HTMLInputElement;
          if (itemCheckbox) itemCheckbox.checked = false;
        });
      }
    });

    const updatedCart = [...cart];
    const currentShopId = updatedCart[cartIndex].supplierId;
    const shopChecked = (
      document.getElementById(`shopRadio-${currentShopId}`) as HTMLInputElement
    ).checked;

    updatedCart[cartIndex].items.forEach((item) => {
      const itemCheckbox = document.getElementById(
        `prodCheckbox-${item.id}`
      ) as HTMLInputElement;
      if (itemCheckbox) itemCheckbox.checked = shopChecked;
    });

    if (shopChecked) {
      setSelectedPhoneShop(updatedCart[cartIndex].supplier.phoneNumber);
      setSelectedShopId(currentShopId);
    } else {
      setSelectedPhoneShop("");
      setSelectedShopId(null);
    }

    setCart(updatedCart);
    calculateTotalAmount();
  };

  // * Handle Individual Product From The Shop Cart
  const handleProductCheckboxChange = (cartIndex, itemId) => {
    const updatedCart = [...cart];

    cart.forEach((shop, index) => {
      setSelectedShopIndex(index);

      // Reset checkboxes only for different shopRadio
      if (index !== cartIndex) {
        const otherShopCheckbox = document.getElementById(
          `shopRadio-${shop.supplierId}`
        ) as HTMLInputElement;

        if (otherShopCheckbox) {
          otherShopCheckbox.checked = false;

          shop.items.forEach((item) => {
            const itemCheckbox = document.getElementById(
              `prodCheckbox-${item.id}`
            ) as HTMLInputElement;

            if (itemCheckbox) {
              itemCheckbox.checked = false;
              item.checked = false; // Reset the checked property in the cart data
            }
          });
        }
      }
    });

    const currentItem = updatedCart[cartIndex].items.find(
      (item) => item.id === itemId
    );

    if (!currentItem) return;

    const currentItemCheckbox = (
      document.getElementById(`prodCheckbox-${itemId}`) as HTMLInputElement
    ).checked;

    currentItem.checked = currentItemCheckbox;

    const isAllItemsChecked = updatedCart[cartIndex].items.every(
      (item) => item.checked
    );

    const shopCheckbox = document.getElementById(
      `shopRadio-${updatedCart[cartIndex].supplierId}`
    ) as HTMLInputElement;

    if (isAllItemsChecked) {
      shopCheckbox.checked = true;
    } else {
      shopCheckbox.checked = false;
    }

    if (currentItemCheckbox) {
      setSelectedPhoneShop(updatedCart[cartIndex].supplier.phoneNumber);
      setSelectedShopId(updatedCart[cartIndex].supplierId);
    } else {
      const isAnyItemChecked = updatedCart[cartIndex].items.some(
        (item) => item.checked
      );
      if (!isAnyItemChecked) {
        setSelectedPhoneShop("");
        setSelectedShopId(null);
      }
    }

    setCart(updatedCart);
    calculateTotalAmount();
  };

  // * Handle Order Place
  const HandleOrderPlace = async () => {
    const checkedCartItems = cart.flatMap((cartItem) => {
      const shopChecked = (
        document.getElementById(
          `shopRadio-${cartItem.supplierId}`
        ) as HTMLInputElement
      ).checked;
      if (shopChecked) {
        return [cartItem];
      }

      const checkedItems = cartItem.items.filter((item) => {
        const inputElem = document.getElementById(
          `prodCheckbox-${item.id}`
        ) as HTMLInputElement;
        return inputElem && inputElem.checked;
      });
      if (checkedItems.length > 0) {
        return [{ ...cartItem, items: checkedItems }];
      }
      return [];
    });

    if (checkedCartItems.length === 0) {
      toast.error("Please select items to order");
      return;
    }

    if (!referenceId) {
      toast.error("Reference ID is required.");
      return;
    }

    if (referenceId.length !== 13) {
      toast.error(
        "Reference ID must be 13 characters in length to place an order."
      );
      return;
    }

    if (!proofOfPayment) {
      toast.error("Please upload Proof of Payment.");
      return;
    }

    const success = true;

    for (const cartItem of checkedCartItems) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("cartId", cartItem.id.toString());
      formData.append("total", totalAmount.toString());
      formData.append("referenceId", referenceId);
      formData.append("proofOfPayment", proofOfPayment);

      cartItem.items.forEach((item, index) => {
        formData.append(`CartItemIds[${index}]`, item.id.toString());
      });

      const orderItems = cartItem.items.map((item) => {
        return {
          ProductId: item.product.id,
          Quantity: item.quantity,
          SizeQuantityId: item.sizeQuantityId,
        };
      });
      formData.append("OrderItems", JSON.stringify(orderItems));

      try {
        await axios.post("https://localhost:7017/Order", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        //axios.delete(`https://localhost:7017/Cart/deleteCart/${cartItem.id}`);
        toast.success("Successfully Ordered");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error in placing order");
        }
      }
    }

    if (success) {
      const updatedCart = cart.filter(
        (cItem) => !checkedCartItems.includes(cItem)
      );
      setCart(updatedCart);
      setTotalAmount(0);
      setTotalItemsChecked(0);
      setReferenceId("");
      setProofOfPayment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      cartEventEmitter.emit("cartEmptied");
      notifEventEmitter.emit("notifAdded");
      orderEventEmitter.emit("notifNewOrderAdded");
      orderEventEmitter.emit("orderCartEmptied");
    }
  };

  // * Delete Method for Cart
  const removeCartItem = async (cartId, itemId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7017/Cart/delete/${cartId}/${itemId}`
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // * Handle for Deleting a Cart
  const handleRemoveCart = async () => {
    const itemsToRemove = [];
    const shopsToRemove = [];

    cart.forEach((cartItem) => {
      const shopChecked = (
        document.getElementById(
          `shopRadio-${cartItem.supplierId}`
        ) as HTMLInputElement
      ).checked;
      if (shopChecked) {
        shopsToRemove.push(cartItem.id);
        cartItem.items.forEach((item) => {
          itemsToRemove.push({ cartId: cartItem.id, itemId: item.id });
        });
      } else {
        cartItem.items.forEach((item) => {
          const itemChecked = (
            document.getElementById(
              `prodCheckbox-${item.id}`
            ) as HTMLInputElement
          ).checked;
          if (itemChecked) {
            itemsToRemove.push({ cartId: cartItem.id, itemId: item.id });
          }
        });
      }
    });

    for (const { cartId, itemId } of itemsToRemove) {
      await removeCartItem(cartId, itemId);
    }

    const updatedCart = cart
      .filter((cartItem) => !shopsToRemove.includes(cartItem.id))
      .map((cartItem) => {
        cartItem.items = cartItem.items.filter(
          (item) => !itemsToRemove.some((itm) => itm.itemId === item.id)
        );
        return cartItem;
      });

    setCart(updatedCart);
    setTotalAmount(0);
    setTotalItemsChecked(0);
    cartEventEmitter.emit("cartUpdated");
  };

  // * Handle Remove Cart Modal
  const handleRemoveCartPrompt = () => {
    const anyProductChecked = cart.some((shop) => {
      return shop.items.some((item) => {
        return (
          document.getElementById(`prodCheckbox-${item.id}`) as HTMLInputElement
        ).checked;
      });
    });

    if (!anyProductChecked) {
      toast.error("Please select a product");
    } else {
      const modalElement = document.getElementById(
        "removeCartConfirmationModal"
      );
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  };

  return (
    <div className="cart-container row">
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="col-md-10 cart-title-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-remove-btn-container">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRemoveCartPrompt}
          >
            <img style={{ width: "20%", marginRight: "5px" }} src={remove} />
            Remove
          </button>
        </div>
      </div>

      {/* SHOP CONTAINER */}
      <div className="SHOP-CART-MAIN-CONTAINER">
        <div className="SHOPS-MAIN-CONTAINER">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <img className="empty-cart-img" src={emptyCartImg} />
              Your cart is currently empty. Start shopping now!
            </div>
          ) : (
            cart.map((cartItem, index) => (
              <div key={index} className="shop-cart-container">
                {/* Displaying Shop Details */}
                <div className="col-md-12 shop-title-container">
                  <h4 className="shop-name-cart">
                    <input
                      className="form-check-input shop-radio"
                      type="checkbox"
                      name="shopRadio"
                      id={`shopRadio-${cartItem.supplierId}`}
                      onChange={() => handleShopCheckboxChange(index)}
                    />
                    <img
                      className="shopIcon-img"
                      src={`https://localhost:7017/${cartItem.supplier.image}`}
                      alt="Shop Logo"
                    />
                    <Link
                      to={`/shop/${userId}/visit_shop/${cartItem.supplierId}`}
                      className="plain-link-shop"
                    >
                      {cartItem.supplier.shopName}
                    </Link>
                  </h4>
                </div>

                {cartItem.items.map((item, itemIndex) => (
                  <div key={item.id} className="prod-main-container">
                    <input
                      style={{ marginRight: "840px", height: "20px" }}
                      className="form-check-input prod-cart-checkBox"
                      type="checkbox"
                      value=""
                      id={`prodCheckbox-${item.id}`}
                      onChange={() =>
                        handleProductCheckboxChange(index, item.id)
                      }
                    />
                    <div className="col-md-11 prod-cart-container">
                      <img
                        className="prod-img-cart"
                        src={`https://localhost:7017/${item.product.image}`}
                        alt="Product"
                      />

                      <div className="col-md-3 prodName-container">
                        <Link
                          to={`/shop/${userId}/visit_shop/${cartItem.supplierId}`}
                          className="plain-link-shop"
                        >
                          <h3 className="prod-name-cart">
                            {item.product.productName}
                          </h3>
                        </Link>
                      </div>

                      {/* Sizes */}
                      <div className="col-md-3 sizeProd-container">
                        <label
                          className="sizeCart-label"
                          htmlFor={`size-${item.id}`}
                        >
                          Size:
                        </label>
                        <select
                          className="size-select"
                          name="size"
                          id={`size-${item.id}`}
                          onChange={(e) =>
                            handleSizeChange(index, itemIndex, e.target.value)
                          }
                        >
                          {item.product.sizes.map((sizeItem) => (
                            <option
                              key={sizeItem.id}
                              value={sizeItem.id}
                              selected={item.sizeQuantityId === sizeItem.id}
                            >
                              {sizeItem.size}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Quantity */}
                      <div className="qua-container">
                        <button
                          className="minus-quantity-btn"
                          onClick={() => HandleMinusQuantity(index, itemIndex)}
                        >
                          -
                        </button>
                        <input
                          className="quanti-input"
                          type="text"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="plus-quantity-btn"
                          onClick={() => HandlePlusQuantity(index, itemIndex)}
                        >
                          +
                        </button>
                      </div>
                      {/* Price */}
                      <div className="col-md-2 prodPrice-container">
                        <h3 className="cartProd-price">
                          ₱
                          {/* {(item.product.price * item.quantity).toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 2 }
                          )} */}
                          {(item.product.price * item.quantity).toFixed(2)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="col-md-3">
          <div className="summary-container">
            <div className="summary-details-container">
              <h1 className="summary-title">Summary</h1>
              <span className="payment-option-sub">Payment Method</span>
              <div className="payment-option-container">
                <div
                  className="payment-option-radio"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    className="payment-option"
                    src={gcash}
                    alt="GCash logo"
                  />
                </div>
                <div className="account-details-container">
                  <div className="account-details">
                    <div className="account-details">
                      {selectedPhoneShop ? (
                        <React.Fragment>
                          <span className="details">GCash:</span>
                          <span className="acc-number">
                            {selectedPhoneShop}
                          </span>
                        </React.Fragment>
                      ) : (
                        <span className="acc-number">No shop selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="amount-details">
                <h2 className="total-item-text">
                  Total Items: {totalItemsChecked}
                </h2>
                <h2 className="total-amount-text">Total amount:</h2>
                <span className="total-amount-num">
                  ₱
                  {totalAmount.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <h2 className="total-amount-text">Upload Proof of Payment:</h2>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="proof-payment-img"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleProofOfPaymentChange}
                />
                <h2 className="total-amount-text">Reference Id (GCash):</h2>
                <input
                  type="text"
                  style={{ borderRadius: "5px" }}
                  className="proof-payment-img"
                  value={referenceId}
                  onChange={(e) => handleReferenceId(e.target.value)}
                  maxLength={13}
                />
              </div>
              <div className="btn-container">
                <button className="place-order" onClick={HandleOrderPlace}>
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="place-button-text">Place Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="removeCartConfirmationModal"
        tabIndex={-1}
        aria-labelledby="removeCartConfirmationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="removeCartConfirmationModalLabel">
                Remove items from cart
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5>
                {" "}
                Are you sure you want to remove the selected items from the
                cart?{" "}
              </h5>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleRemoveCart}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
