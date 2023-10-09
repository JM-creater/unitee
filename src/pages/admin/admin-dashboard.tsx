//import { Link } from 'react-router-dom'
import revenue from "../../assets/images/icons/growth.png"
import supplier from "../../assets/images/icons/supplier.png"
import user from "../../assets/images/icons/user.png"
import orders from "../../assets/images/icons/ordersbox.png"
import product2 from "../../assets/images/shop_products/product2.png"
import profile from '../../assets/images/imageprofile.jpeg'
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
    <div className='rev-content'>
    <h5 className="dashboard-card-title2">Revenue</h5>
    <h3 className='dashboard-card-text2'>PHP 20000</h3>
    </div>
    <img className='dashboard-icon' src={ revenue } alt="" />
  </div>
</div>

<div className="card-dashboard-admin card" style={{ width:'20rem'}}>
  <div className="dashboard-card card-body2">
    <div className='pending-content'>
    <h5 className="dashboard-card-title2">Pending Orders</h5>
    <h3 className='dashboard-card-text2'>200</h3>
    </div>
    <img className='dashboard-icon' src={ orders } alt="" />
  </div>
</div>


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

       <div className='col-md-12 home-container-2 row'>
       <div className='col-md-9 best-sellers-container'>
            <h1>Best Sellers</h1>
        <div className='col-md-12 best-sellers-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
        <table className="best-sellers table table-hover align-middle caption-top table-xl">
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="cart-table-header" scope="col">Product</th>
            <th className="cart-table-header" scope="col">Price</th>
            <th className="cart-table-header" scope="col">Shop</th>
            <th className="cart-table-header" scope="col">Total Sales</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>PHP 1000</td>
            <td>Example Shop</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>PHP 1000</td>
            <td>Example Shop</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>PHP 1000</td>
            <td>Example Shop</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>PHP 1000</td>
            <td>Example Shop</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ product2 }/>Product Name</th>
            <td>PHP 1000</td>
            <td>Example Shop</td>
            <td>PHP 50000</td>
            </tr>
        </tbody>
        </table>
        </div>
        </div>

        <div className='col-md-9 best-sellers-container'>
            <h1>Top Selling Shops</h1>
        <div className='col-md-12 best-sellers-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
        <table className="best-sellers table table-hover align-middle caption-top table-xl">
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th className="cart-table-header" scope="col">Shop</th>
            <th className="cart-table-header" scope="col">supplier ID</th>
            <th className="cart-table-header" scope="col">Total no. of Orders</th>
            <th className="cart-table-header" scope="col">Total Sales</th>
            </tr>
        </thead>
        <tbody className="table-group-divider">
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ profile }/>Example Shop Name</th>
            <td>764288</td>
            <td>299999</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ profile }/>Example Shop Name</th>
            <td>764288</td>
            <td>8789785</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ profile }/>Example Shop Name</th>
            <td>764288</td>
            <td>8789785</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ profile }/>Example Shop Name</th>
            <td>764288</td>
            <td>8789785</td>
            <td>PHP 50000</td>
            </tr>
            <tr>
            <th scope="row" data-bs-toggle="modal"><img className="prod-image-cart" src={ profile }/>Example Shop Name</th>
            <td>764288</td>
            <td>8789785</td>
            <td>PHP 50000</td>
            </tr>
        </tbody>
        </table>
        </div>
        </div>
       </div>
    </div>
}

export default Admin_Dashboard