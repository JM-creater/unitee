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

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState([]);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [averageRatingSupplier, setAverageRatingSupplier] = useState({});
    const [, setProductData] = useState([]);
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // * Handle Search Input
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    // * Navigate Search
    const performSearch = (productName = searchTerm) => {
        setSearchTerm(productName); 
        navigate(`/shop/${userId}/search_product?search=${productName}`);
    };

    // * Get the Average Rating for Product
    useEffect(() => {
        if (!departmentId) return;
    
        const fetchAverageRatingSupplier = async () => {
            try {
                const supplierResponse = await axios.get(`https://localhost:7017/Users/getSuppliersProduct/${departmentId}`);
                setProductData(supplierResponse.data);
    
                const ratingsPromises = supplierResponse.data.map(supplier => 
                    axios.get(`https://localhost:7017/Rating/average-supplier-rating/${supplier.id}`)
                );
    
                const ratingsResponses = await Promise.all(ratingsPromises);
                const ratingsMap = ratingsResponses.reduce((acc, response, index) => {
                    acc[supplierResponse.data[index].id] = response.data.averageRating;
                    return acc;
                }, {});
    
                setAverageRatingSupplier(ratingsMap);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchAverageRatingSupplier();
    }, [departmentId]);

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
        try {
                const supplierResponse = await axios.get(`https://localhost:7017/Users/getSuppliersProduct/${departmentId}`);
                setProductData(supplierResponse.data);

                const ratingsPromises = supplierResponse.data.map(supplier => 
                    axios.get(`https://localhost:7017/Rating/average-supplier-rating/${supplier.id}`)
                );

                const ratingsResponses = await Promise.all(ratingsPromises);
                const ratingsMap = ratingsResponses.reduce((acc, response, index) => {
                    acc[supplierResponse.data[index].id] = response.data.averageRating;
                    return acc;
                }, {});

                setAverageRatingSupplier(ratingsMap);
            } catch (error) {
                console.error('Network error or server not responding');
            }
        };
    
        const handleFocus = () => {
            fetchData();
        };
    
        window.addEventListener('focus', handleFocus);
    
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [departmentId]);
    
    // * Get User Department
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

    // * Get Products By Supplier 
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

    // * Search Product Data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Product/searchByDepartment?userId=${userId}`);
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, [userId]);

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
                        className="Product-SearchBar"
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
                <div className='search-dropdown'>
                    {products.filter(productFilter => {
                        const searchTermLowerCase = searchTerm.toLowerCase();
                        const productName = productFilter.productName?.toLowerCase();

                        return (
                            searchTermLowerCase &&
                            productName?.startsWith(searchTermLowerCase) &&
                            productName !== searchTermLowerCase
                        );
                    }).slice(0, 5).map((productData, index) => (
                        <div 
                            key={index} 
                            className='search-dropdown-row'
                            onClick={() => performSearch(productData.productName)}
                        >
                            <span className="fa fa-search form-control-feedback search-icon"></span>
                            {productData.productName}
                        </div>
                    ))}
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
                                    <React.Fragment>
                                        <h5 className='shop-rating-card'>
                                            <img className="ratingIcon" src={starIcon} alt="Star icon" />
                                            {averageRatingSupplier[shops.id] ? averageRatingSupplier[shops.id] : '0'}
                                        </h5>
                                    </React.Fragment>
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