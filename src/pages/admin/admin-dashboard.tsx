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

function Admin_Dashboard () {

  const [customer, setCustomer] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

  // Get All Customers
  useEffect(() => {
      axios.get('https://localhost:7017/Users/getCustomers')
          .then(res => {
              setCustomer(res.data);
          })
          .catch((err) => {console.error(err)
      });
  }, []);

  // Get All Suppliers
  useEffect(() => {
    axios.get('https://localhost:7017/Users/getSuppliers')
        .then(res => {
            setSupplierData(res.data);
        })
        .catch((err) => {console.error(err)
    });
}, []);


    return <div className='admin-dashboard-main-container'>

      {/* OLD */}
        {/* <h1 className='page-title'>Dashboard</h1>
        <div className='card-container'>
        


<div className="card-dashboard-admin card" style={{ width:'20rem'}}>
  <div className="dashboard-card card-body2">
    <div className='customer-content'>
    <h5 className="dashboard-card-title2">Customers</h5>
    {customer.length > 0 && (
      <h3 className='dashboard-card-text2'>{customer.length}</h3>
    )}
    </div>
    <img className='dashboard-icon' src={ user } alt="" />
  </div>
</div>

<div className="card-dashboard-admin card" style={{ width:'20rem'}}>
  <div className="dashboard-card card-body2">
    <div className='suppliers-content'>
    <h5 className="dashboard-card-title2">Suppliers</h5>
    {supplierData.length > 0 && (
      <h3 className='dashboard-card-text2'>{supplierData.length}</h3>
    )}
    </div>
    <img className='dashboard-icon' src={ supplier } alt="" />
  </div>
</div>
        </div>

        */}

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
              <h1 className="col-md-11 number-dash">0</h1>
            </div>
            <img className="dash-card-icon" src={ supplierIcon }/>
          </div>

          {/* CUSTOMER COUNT */}
          <div className="card-content-container">
            <div className="col-md-9 dash-card">
              <span>Customers</span>
              <h1 className="col-md-11 number-dash">0</h1>
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