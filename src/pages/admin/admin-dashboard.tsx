import prodIcon from "../../assets/images/icons/shirt.png"
import supplierIcon from "../../assets/images/icons/supplier-2.png"
import customerIcon from "../../assets/images/icons/male-student.png"
import './admin-dashboard.css'
import { useEffect, useState } from "react"
import axios from "axios"
import validationEventEmitter from "../../helpers/ValidationEmitter"
import registerUsersEventEmitter from "../../helpers/RegisterUsersEmitter"

function Admin_Dashboard () {

  const [customer, setCustomer] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [products, setProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topSellingSupplier, setTopSellingSupplier] =  useState(null);

    // * Get All Customers with Event Emitter 
    useEffect(() => {
      const validationRequest = async () => {
          try {
              const response = await axios.get('https://localhost:7017/Users/getCustomers');
              setCustomer(response.data);
          } catch (error) {
              console.error('Network error or server not responding', error);
          }
      };
      const validationListener = () => {
          validationRequest();
      };

      validationEventEmitter.on("validInvalid", validationListener);
      registerUsersEventEmitter.on("registerCustomer", validationListener);
      validationRequest();

      return () => {
          validationEventEmitter.off("validInvalid", validationListener);
          registerUsersEventEmitter.off("registerCustomer", validationListener);
      };
    }, []);

    // * Windows Event Listener Focus for Customer
    useEffect(() => {
        const fetchData = async () => {
        try {
              const response = await axios.get('https://localhost:7017/Users/getCustomers');
              setCustomer(response.data);
            } catch (error) {
              console.error('Network error or server not responding', error);
            }
        };

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // * Get All Suppliers with Event Emitter
    useEffect(() => {
      const fetchShops = async () => {
          try {
            const response = await axios.get('https://localhost:7017/Users/getSuppliers');
            setSupplierData(response.data);
          } catch (error) {
            console.error('Network error or server not responding', error);
          }
      };

      const validationListener = () => {
          fetchShops();
      };

      validationEventEmitter.on("validInvalid", validationListener);
      registerUsersEventEmitter.on("registerSupplier", validationListener);
      fetchShops();

      return () => {
        validationEventEmitter.off("validInvalid", validationListener);
        registerUsersEventEmitter.off("registerSupplier", validationListener);
      };
  }, []);

  // * Windows Event Listener Focus for Supplier
  useEffect(() => {
      const fetchData = async () => {
      try {
            const response = await axios.get('https://localhost:7017/Users/getSuppliers');
            setSupplierData(response.data);
          } catch (error) {
            console.error('Network error or server not responding', error);
          }
      };

      const handleFocus = () => {
          fetchData();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
  }, []);

  // * Get All Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7017/Product');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchProducts();
  }, []);

  // * Windows Event Listener Focus for Supplier
  useEffect(() => {
      const fetchData = async () => {
      try {
            const response = await axios.get('https://localhost:7017/Product');
            setProducts(response.data);
          } catch (error) {
            console.error('Network error or server not responding', error);
          }
      };

      const handleFocus = () => {
          fetchData();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
  }, []);

  // * Get the top selling supplier
  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7017/Product/top-selling');
        setTopSellingProducts(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchTopSellingProducts();
  }, []);

  // * Windows Event Listener Focus for Supplier
  useEffect(() => {
      const fetchData = async () => {
      try {
            const response = await axios.get('https://localhost:7017/Product/top-selling');
            setTopSellingProducts(response.data);
          } catch (error) {
            console.error('Network error or server not responding', error);
          }
      };

      const handleFocus = () => {
          fetchData();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
  }, []);

  // * Get the top selling supplier
  useEffect(() => {
    const fetchTopSellingSupplier = async () => {
      try {
        const response = await axios.get('https://localhost:7017/Users/getTopSellingSeller');
        setTopSellingSupplier(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchTopSellingSupplier();
  }, []);

  // * Windows Event Listener Focus for Supplier
  useEffect(() => {
    const fetchData = async () => {
    try {
          const response = await axios.get('https://localhost:7017/Users/getTopSellingSeller');
          setTopSellingSupplier(response.data);
        } catch (error) {
          console.error('Network error or server not responding', error);
        }
    };

    const handleFocus = () => {
        fetchData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);


    return <div className='admin-dashboard-main-container'>
        {/* NEW */}
        <div className="col-md-7">
          <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Dashboard</h3>

        <div className="dash-admin-container">
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Products</span>
              {products.length > 0 ? (
                <h1 className="col-md-11 number-dash">{products.length}</h1>
              ) : (
                <h1 className="col-md-11 number-dash">0</h1>
              )}
            </div>
            <img className="dash-card-icon" src={ prodIcon }/>
          </div>
          
          {/* SUPPLIER COUNT */}
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Suppliers</span>
              {supplierData.length > 0 ? (
                <h1 className="col-md-11 number-dash">{supplierData.length}</h1>
              ) : (
                <h1 className="col-md-11 number-dash">0</h1>
              )}
            </div>
            <img className="dash-card-icon" src={ supplierIcon }/>
          </div>

          {/* CUSTOMER COUNT */}
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Customers</span>
              {customer.length > 0 ? (
                <h1 className="col-md-11 number-dash">{customer.length}</h1>
              ) : (
                <h1 className="col-md-11 number-dash">0</h1>
              )}
            </div>
            <img className="dash-card-icon" src={ customerIcon } alt="" />
          </div>
        </div>

        <div className="top-selling-prods-container">
          <h3 className="top-selling-prods-title">Top Selling Products</h3>
          {topSellingProducts.length > 0 ? 
            topSellingProducts.slice(0, 5).map(product => (
              <div key={product.productId} className='top-prods-container'>
                  <img className='top-prod-img' src={`https://localhost:7017/${product.image}`} alt={product.productName} />
                  <span className='top-prod-name'>{product.productName}</span>
                  <span className='top-prod-price'>₱{product.price}</span>
              </div>
            )) : <span>No Top Selling Products Found</span>
          }
        </div>
        </div>

        {/* TOP SELLERS */}
        <div className="col top-sellers-dash">
          <h3 style={{ marginBottom:'20px' }}>Top Sellers</h3>
          {topSellingSupplier ? (
            <div className="dash-top-sellers-container">
              <img className="shop-profile-top-seller" src={`https://localhost:7017/${topSellingSupplier.image}`}/>
              <div className="top-shop-details-container">
                <span className="shop-name-dash">{topSellingSupplier.shopName}</span>
                <span className="shop-total-sale-dash"></span>
              </div>
              <span className="shop-totalProds-sold"></span>
            </div>
            ) : <span>No Top Seller Found</span>
          }
        </div>
    </div>
}

export default Admin_Dashboard