import './admin_shops.css'
import { useEffect, useState } from 'react'
import starIcon from "../../assets/images/icons/starRating.png"
//import shopImg from "../../assets/images/imageprofile.jpeg"
import axios from 'axios'
import { toast } from 'react-toastify';
import validationEventEmitter from '../../helpers/ValidationEmitter';
import registerUsersEventEmitter from '../../helpers/RegisterUsersEmitter';


function Admin_Shops () {

    const [shop, setShop] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');

    const filteredShops = shop.filter((departmentItem) => {
        const matchesStatus = selectedStatus === 'All' || (departmentItem.isValidate ? 'Validated' : 'Invalid') === selectedStatus;
        
        return matchesStatus;
    });

    // * Get All Suppliers with Event Emitter
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Users/getSuppliers');
                setShop(response.data);
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
                setShop(response.data);
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

    return <div className="admin-shops-main-container">
        <div className='admin-shops-header'>
            <h3 style={{ color:'#020654', fontWeight:'600' }}>Shops</h3>
            <div className='admin-shops-filter'>
                <h5 style={{ marginRight:'20px', color:'#020654' }}>Sort by</h5>
            <label className='customerStatus-label' htmlFor="status">Status</label>
                <select
                    style={{ padding: '10px', border: '2px solid white' }}
                    name="customerStatus" 
                    id="status"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="Select Status" disabled selected hidden>Select Status</option>
                    <option value="All">All</option>
                    <option value="Validated">Valid</option>
                    <option value="Invalid">Invalid</option>
                </select>
            </div>
        </div>

        <div className='shops-admin-container'>
        {filteredShops.map(shops => (
            <div className='admin-shop-card' key={shops.id}>
                <img className='shopImgCard' src={ `https://localhost:7017/${shops.image}` }  />
                <div className='col-md-8 adminShop-card-details'>
                    <h5 className="supplier-card-title">{shops.shopName}</h5>
                    <h5 className='shop-rating-card'><img className="ratingIcon" src={ starIcon }/>No Rating Yet</h5>
                    <h5 className='shop-rating-card'>{shops.address}</h5>
                </div>
            </div>
            ))}
        </div>
    </div>
}

export default Admin_Shops