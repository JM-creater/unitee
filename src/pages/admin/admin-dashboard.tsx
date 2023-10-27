// import { Link } from 'react-router-dom'
import supplier from "../../assets/images/icons/supplier.png"
import user from "../../assets/images/icons/user.png"
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
        <h1 className='page-title'>Dashboard</h1>
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

       
    </div>
}

export default Admin_Dashboard