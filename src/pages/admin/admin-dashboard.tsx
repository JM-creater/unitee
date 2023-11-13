// import { Link } from 'react-router-dom'
// import supplier from "../../assets/images/icons/supplier.png"
// import user from "../../assets/images/icons/user.png"
import shopProf from "../../assets/images/imageprofile.jpeg"
import prodIcon from "../../assets/images/icons/shirt.png"
import supplierIcon from "../../assets/images/icons/supplier-2.png"
import customerIcon from "../../assets/images/icons/male-student.png"
import './admin-dashboard.css'
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import validationEventEmitter from "../../helpers/ValidationEmitter"
import registerUsersEventEmitter from "../../helpers/RegisterUsersEmitter"

function Admin_Dashboard () {

  const [customer, setCustomer] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

    // * Get All Customers with Event Emitter 
    useEffect(() => {
      const validationRequest = async () => {
          try {
              const response = await axios.get('https://localhost:7017/Users/getCustomers');
              setCustomer(response.data);
          } catch (error) {
              toast.error('Network error or server not responding');
          }
      };
      const validationListener = () => {
          validationRequest();
      };

      validationEventEmitter.on("validInvalid", validationListener);
      registerUsersEventEmitter.on("registerCustomer", validationListener)
      validationRequest();

      return () => {
          validationEventEmitter.off("validInvalid", validationListener);
          registerUsersEventEmitter.off("registerCustomer", validationListener)
      };
    }, []);


    // * Windows Event Listener Focus for Customer
    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get('https://localhost:7017/Users/getCustomers');
                setCustomer(response.data);
            } catch (error) {
                toast.error('Network error or server not responding');
            }
        };

        const handleFocus = () => {
            fetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [])

    // * Get All Suppliers with Event Emitter
    useEffect(() => {
      const fetchShops = async () => {
          try {
              const response = await axios.get('https://localhost:7017/Users/getSuppliers');
              setSupplierData(response.data);
          } catch (error) {
              toast.error('Network error or server not responding');
          }
      };

      const validationListener = () => {
          fetchShops();
      };

      validationEventEmitter.on("validInvalid", validationListener);
      registerUsersEventEmitter.on("registerSupplier", validationListener)
      fetchShops();

      return () => {
          validationEventEmitter.off("validInvalid", validationListener);
          registerUsersEventEmitter.off("registerSupplier", validationListener)
      };
  }, []);

  // * Windows Event Listener Focus for Supplier
  useEffect(() => {
      const fetchData = async () => {
      try {
              const response = await axios.get('https://localhost:7017/Users/getSuppliers');
              setSupplierData(response.data);
          } catch (error) {
              toast.error('Network error or server not responding');
          }
      };

      const handleFocus = () => {
          fetchData();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
          window.removeEventListener('focus', handleFocus);
      };
  }, [])


    return <div className='admin-dashboard-main-container'>
        {/* NEW */}
        <div className="col-md-7">
          <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' }}>Dashboard</h3>

        <div className="dash-admin-container">
          <div className="card-content-container">
            <div className="col-md-9 dash-card">

              {/* PRODUCT COUNT */}
              <span>Products</span>
              <h1 className="col-md-11 number-dash">0</h1>
            </div>
            <img className="dash-card-icon" src={ prodIcon }/>
          </div>
          
          {/* SUPPLIER COUNT */}
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Suppliers</span>
              {supplierData.length > 0 && (
              <h1 className="col-md-11 number-dash">{supplierData.length}</h1>
              )}
            </div>
            <img className="dash-card-icon" src={ supplierIcon }/>
          </div>

          {/* CUSTOMER COUNT */}
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Customers</span>
              {customer.length > 0 && (
              <h1 className="col-md-11 number-dash">{customer.length}</h1>
              )}
            </div>
            <img className="dash-card-icon" src={ customerIcon } alt="" />
          </div>
        </div>


        <div className="top-selling-prods-container">
          <h3 className="top-selling-prods-title">Top Selling Products</h3>
          <div className="top-prods-container">
            <img className="top-prod-img" src={''}/>
            <span className="top-prod-name">Sample Product Name</span>
            <span className="top-prod-price">123</span>
          </div>
        </div>
        </div>

        {/* TOP SELLERS */}
        <div className="col top-sellers-dash">
          <h3 style={{ marginBottom:'20px' }}>Top Sellers</h3>
          <div className="dash-top-sellers-container">
            <img className="shop-profile-top-seller" src={ shopProf }/>
            <div className="top-shop-details-container">
              <span className="shop-name-dash">Sample Shop Name</span>
              <span className="shop-total-sale-dash"></span>
            </div>
            <span className="shop-totalProds-sold">Total Sales: 0</span>
          </div>
        </div>
    </div>
}

export default Admin_Dashboard