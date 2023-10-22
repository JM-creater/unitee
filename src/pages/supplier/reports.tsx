import './supplier_dashboard.css'
import totalSalesIcon from "../../assets/images/icons/dollar.png"
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useParams } from 'react-router'


function Supplier (){
    
    return (
        <div className='orders-supplier-main-container'>    
        <div className='col-md-7'>
        <h3 style={{ marginBottom:'20px', color:'#020654', fontWeight:'600' , textAlign: 'justify'}}>Reports</h3>
        <div  className='dash-supplier-container'>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Weekly Sales</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Sales Icon"/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Monthly Sales</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Orders Icon"/>
            </div>
            <div className='card-content-container'>
                <div className='col-md-9 dash-card'>
                    <span>Yearly Sales</span>
                    <h1 className='col-md-11 number-dash'>0</h1>
                </div>
                <img className='dash-card-icon' src={ totalSalesIcon } alt="Total Products Icon"/>
            </div>
        </div>

        

        <div className='top-selling-prods-container'>
            <h3 className='top-selling-prods-title'>Top Selling Products</h3>
            <div className='top-prods-container'>
                <span className='top-prod-name'>No Product Yet</span>
            </div>
            {/* <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div>

            <div className='top-prods-container'>
                <img className='top-prod-img' src={ topProd } />
                <span className='top-prod-name'>No Product Yet</span>
                <span className='top-prod-price'>₱0</span>
            </div> */}
        </div>
        
        
        
        </div>
            
        </div>
    )
}

export default Supplier