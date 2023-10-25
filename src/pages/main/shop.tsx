import './shop.css'
import { Link, useParams } from "react-router-dom"
import shopPic1Carousel from "../../assets/images/carouselPic2.png"
import shopPic2Carousel from  "../../assets/images/carouselPic1.png"
import starIcon from "../../assets/images/icons/starRating.png"
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'
import axios from 'axios'

function Shop() {

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

    return <div className='container shop-contianer'>
        <div className='content-container'>
            <div className='col-md-12 shopCustomer-title-container'>
                <div id="carouselExampleAutoplaying" className="shopCarousel-container carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                        <img src={ shopPic1Carousel } className="carouselPic d-block w-100"/>
                        </div>
                        <div className="carousel-item">
                        <img src={ shopPic2Carousel } className="carouselPic d-block w-100"/>
                        </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>  
                <div className='motto-container'>
                    <p className='shop-title1'>New Clothes,</p>
                    <p className='shop-title2'>New Passion.</p>
                </div> 
            </div>
        <div className='col-md-10 shopLabel-text-container'>
            <h2 className='visit-shop-text'>Shops for you to visit</h2>
        </div>
            <div className='supplier-container'>
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
            </div>
        </div>
    </div>
}

export default Shop