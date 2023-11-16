import './shop.css'
import { Link, useNavigate, useParams } from "react-router-dom"
import shopPic1Carousel from "../../assets/images/carouselPic2.png"
import shopPic2Carousel from  "../../assets/images/carouselPic1.png"
import starIcon from "../../assets/images/icons/starRating.png"
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LoadingGif from '../../assets/images/icons/loadingscreen.svg'

function Shop() {

    //const [ratings, setRatings] = useState(null);
    //const [averageRating, setAverageRating] = useState(0);
    const [shop, setShop] = useState([]);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const performSearch = () => {
        navigate(`/shop/${userId}/search_product?search=${searchTerm}`);
    };
    
    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://localhost:7017/Users/UserDepartment/${userId}`)
            .then(async res => {
                setDepartmentId(res.data.departmentId);
                await sleep(50);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
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

    // ! To be fixed
    // useEffect(() => {
    //     axios.get(`https://localhost:7017/Rating/${userId}`)
    //         .then((response) => {
    //             setRatings(response.data);
                // Calculate average rating
    //             const totalValue = response.data.reduce((acc, cur) => acc + cur.value, 0);
    //             const avg = response.data.length > 0 ? (totalValue / response.data.length) : 0;
    //             setAverageRating(+avg.toFixed(1)); 
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    // }, [userId]);

    return (
    <React.Fragment>
        {isLoading ? (
            <div className="mainloading-screen">
                <img className='mainloading-bar' src={LoadingGif} alt="loading..." />
            </div>
        ) : ( 
            <div className='container shop-contianer'>
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

                <div className="search-container">
                    <span className="fa fa-search form-control-feedback search-icon"></span>
                    <input 
                        className="col-md-4 Supplier-SearchBar"
                        type="text"
                        placeholder="Search Product"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                performSearch();
                            }
                        }}
                    />
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
                                {/* {ratings && ( */}
                                    <React.Fragment>
                                        <h5 className='shop-rating-card'>
                                            <img className="ratingIcon" src={starIcon} alt="Star icon" />
                                            0
                                        </h5>
                                    </React.Fragment>
                                {/* )} */}
                                <h5 className='shop-rating-card'>{shops.address}</h5>
                            </div>
                        </div>
                    </Link>
                ))}
                </div>
            </div>
        </div>
        )}
    </React.Fragment>
    )
}

export default Shop