import gcash from "../../assets/images/shop_products/gcash.png"
import remove from "../../assets/images/icons/trash.png"
import './cart.css'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (message: string, type: number) => {
  if(type === 1) {
    toast.success(message, {
      style: {
        border: '1px solid #020654',
        padding: '16px',
        color: '#020654',
      },
      iconTheme: {
        primary: '#020654',
        secondary: '#FFFAEE',
      },
    });
  }
  else if(type === 2)
    toast(message, {
      icon: '👏',
    });
  else
    toast.error(message)
}

function Cart () {

    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalItemsChecked, setTotalItemsChecked] = useState(0);
    const [proofOfPayment, setProofOfPayment] = useState(null);
    const [referenceId, setReferenceId] = useState("");
    const { userId } = useParams();

  useEffect(() => {
      axios.get(`https://localhost:7017/Cart/myCart/${userId}`)
      .then(res => {
          setCart(res.data);
      })
      .catch(error => {
          console.error(error);
      });
  }, [userId]);

    // Handle Image
    const handleProofOfPaymentChange = (event) => {
      setProofOfPayment(event.target.files[0]);
    }

    // Calculate the total amount
    const calculateTotalAmount = () => {
      let count = 0;
      const amount = cart.reduce((sum, cartItem) => {
          return sum + cartItem.items.reduce((sumItem, item) => {
              if ((document.getElementById(`prodCheckbox-${item.id}`) as HTMLInputElement).checked) {
                  count += 1;
                  return sumItem + (item.product.price || 0) * item.quantity;
              }
              return sumItem;
          }, 0);
      }, 0);
      setTotalAmount(amount);
      setTotalItemsChecked(count);
    };

    // Handle Shop Total Amount
    const handleShopCheckboxChange = (cartIndex) => {
      const updatedCart = [...cart];
      const shopChecked = (document.getElementById(`shopRadio-${updatedCart[cartIndex].supplierId}`) as HTMLInputElement).checked;

      updatedCart[cartIndex].items.forEach(item => {
          (document.getElementById(`prodCheckbox-${item.id}`) as HTMLInputElement).checked = shopChecked;
      });

      setCart(updatedCart);
      calculateTotalAmount();
    };

    // Handle Individual Product Amount
    const handleProductCheckboxChange = (cartIndex) => {
      const allItemsChecked = cart[cartIndex].items.every(item => {
          return (document.getElementById(`prodCheckbox-${item.id}`) as HTMLInputElement).checked;
      });
      (document.getElementById(`shopRadio-${cart[cartIndex].supplierId}`) as HTMLInputElement).checked = allItemsChecked;
      calculateTotalAmount();
    };

    // Handle Minus Quantity
    const HandleMinusQuantity = (index, itemIndex) => {
      const updatedCart = [...cart];
      if (updatedCart[index].items[itemIndex].quantity > 0) {
        updatedCart[index].items[itemIndex].quantity -= 1;
      }
      setCart(updatedCart);
    }

    // Handle Plus Quantity
    const HandlePlusQuantity = (index, itemIndex) => {
      const updatedCart = [...cart];
      updatedCart[index].items[itemIndex].quantity += 1;
      setCart(updatedCart);
    }

    // Handle Order Place
    const HandleOrderPlace = async () => {
      const checkedCartItems = cart.flatMap(cartItem => {
        const shopChecked = (document.getElementById(`shopRadio-${cartItem.supplierId}`) as HTMLInputElement).checked;
        if (shopChecked) {
            return [cartItem];
        }

        const checkedItems = cartItem.items.filter(item => {
            const inputElem = document.getElementById(`prodCheckbox-${item.id}`) as HTMLInputElement;
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
  
      for (const cartItem of checkedCartItems) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('cartId', cartItem.id.toString()); 
        formData.append('total', totalAmount.toString());
        formData.append('referenceId', referenceId);
        formData.append('proofOfPayment', proofOfPayment);

        try {
          await axios.post('https://localhost:7017/Order', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          axios.delete(`https://localhost:7017/Cart/deleteCart/${cartItem.id}`)
          toast.success("Successfully Ordered");
        } catch (error) {
          console.log("Error in placing order", error);
          toast.error("Failed to place order");
        }
      }
      const updatedCart = cart.filter(cItem => !checkedCartItems.includes(cItem));
      setCart(updatedCart);
      setTotalAmount(0);
    };
  


    return <div className="cart-container row">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className="col-md-8 cart-title-container">
        <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-remove-btn-container">
            <button type="button" className="btn btn-outline-primary" >
              <img style={{ width:'20%', marginRight:'5px'}} src={ remove }/>Remove
            </button>
          </div>
      </div>

          {/* SHOP CONTAINER */}
          <div className="SHOP-CART-MAIN-CONTAINER">

            <div className="SHOPS-MAIN-CONTAINER">
              {cart.map((cartItem, index) => (
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
                              <img className="shopIcon-img" src={ `https://localhost:7017/${cartItem.supplier.image}` } alt="Shop Logo" />
                              {cartItem.supplier.shopName}
                          </h4>
                      </div>

                      {cartItem.items.map((item, itemIndex) => (
                          <div key={item.id} className="prod-main-container">
                              
                              <input 
                                className="form-check-input prod-cart-checkBox" 
                                type="checkbox" 
                                value="" 
                                id={`prodCheckbox-${item.id}`} 
                                onChange={() => handleProductCheckboxChange(index)}
                              />
                              
                              <div className="col-md-11 prod-cart-container">
                                  <img className="prod-img-cart" src={ `https://localhost:7017/${item.product.image}` } alt="Product" />
                                  
                                  <div className="col-md-3 prodName-container">
                                      <h3 className="prod-name-cart">{item.product.productName}</h3>
                                      <p>{item.product.description}</p>
                                  </div>
                                  
                                  {/* Sizes */}
                                  <div className="col-md-3 sizeProd-container">
                                      <label className="sizeCart-label" htmlFor={`size-${item.id}`}>
                                          Size:
                                      </label>
                                      <select className="size-select" name="size" id={`size-${item.id}`}>
                                        <option value={item.sizeQuantity.size}>{item.sizeQuantity.size}</option>
                                      </select>
                                  </div>

                                  {/* Quantity */}
                                  <div className="col-md-2 quanti-container">
                                    <button className="minus-quanti-btn" onClick={() => HandleMinusQuantity(index, itemIndex)}>
                                        -
                                    </button>
                                    <input className="quanti-input" type="text" value={item.quantity} readOnly />
                                    <button className="plus-quanti-btn" onClick={() => HandlePlusQuantity(index, itemIndex)}>
                                        +
                                    </button>
                                  </div>

                                  {/* Price */}
                                  <div className="col-md-2 prodPrice-container">
                                      <h3 className="cartProd-price">₱{item.product.price.toFixed(2)}</h3>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              ))}
            </div>

        {/* PAYMENT SUMMARY */}
        <div className="col-md-3">
          <div className="summary-container">
              <div className="summary-details-container">
                  <h1 className="summary-title">Summary</h1>
                  <span className="payment-option-sub">Payment Method</span>
                  <div className="payment-option-container">
                      <div className="payment-option-radio" style={{ display: 'flex', alignItems: 'center' }}>
                          <img className="payment-option" src={gcash} alt="GCash logo" />
                      </div>
                      <div className="account-details-container">
                          <div className="account-details">
                              <span className="details">GCash:</span>
                              <span className="acc-number">09199431060</span>
                          </div>
                      </div>
                  </div>
                  <div className="amount-details">
                      <h2 className="total-item-text">Total Items: {totalItemsChecked}</h2>
                      <h2 className="total-amount-text">Total amount:</h2>
                      <span className="total-amount-num">₱ {totalAmount.toFixed(2)}</span>
                      <h2 className="total-amount-text">Upload Proof of Payment:</h2>
                      <input type="file" className="proof-payment-img" accept="image/png, image/gif, image/jpeg" onChange={handleProofOfPaymentChange}/>
                      <h2 className="total-amount-text">Reference Id:</h2>
                      <input type="text" className="proof-payment-img" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} />
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
  </div>
}

export default Cart