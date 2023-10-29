import './admin_shops.css'
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import starIcon from "../../assets/images/icons/starRating.png"
import shopImg from "../../assets/images/imageprofile.jpeg"
import axios from 'axios'


function Admin_Shops () {
    const [shop, setShop] = useState([]);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const { userId } = useParams();

    
    useEffect(() => {
        axios.get(`https://localhost:7017/Users/UserDepartment/${userId}`)
            .then(res => {
                setDepartmentId(res.data.departmentId);
            })
            .catch(err => {
                console.error(err);
            });
    }, [userId]);

    useEffect(() => {
        if (!departmentId) return;
        axios.get(`https://localhost:7017/Users/getSuppliersProduct/${departmentId}`)
            .then(async res => {
                setShop(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [departmentId]);

    return <div className="admin-shops-main-container">
        <div className='admin-shops-header'>
            <h3 style={{ color:'#020654', fontWeight:'600' }}>Shops</h3>
            <div className='admin-shops-filter'>
                <h5 style={{ marginRight:'20px', color:'#020654' }}>Sort by</h5>
            <label className='customerStatus-label' htmlFor="status">Department</label>
              <select
              style={{ padding: '10px', border: '2px solid white' }}
              name="customerStatus" id="status">
                  <option value="Select Status">Select Department</option>
                  <option value="Validated">College of Computer Studies</option>
                  <option value="Invalid">Criminology</option>
              </select>
            </div>
        </div>

        <div className='shops-admin-container'>
            <div className='admin-shop-card'>
                <img className='shopImgCard' src={ shopImg } />
                <div className='col-md-8 adminShop-card-details'>
                    <h5 className="supplier-card-title">Example Shop Name dasdsad  asdasd </h5>
                    <h5 className='shop-rating-card'><img className="ratingIcon" src={ starIcon }/>No Rating Yet</h5>
                    <h5 className='shop-rating-card'>example shop address</h5>
                </div>
            </div>
            
        </div>

        {/* <div className='supplier-container'>
            {shop.map((shops, index) => (
                <Link key={index} className='link-to-seller' to={`/shop/${userId}/visit_shop/${shops.id}`}>
                    <div className="supplier-card">
                        <img src={ `https://localhost:7017/${shops.image}` } className="supplierCard-img"/>
                        <div className='col-md-8 shop-card-details'>
                            <h5 className="supplier-card-title">{shops.shopName}</h5>
                            <h5 className='shop-rating-card'><img className="ratingIcon" src={ starIcon }/>No Rating Yet</h5>
                            <h5 className='shop-rating-card'>{shops.address}</h5>
                        </div>
                    </div>
                </Link>
            ))}
            </div> */}
    </div>
}

export default Admin_Shops