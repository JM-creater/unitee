import starIcon from "../../assets/images/icons/starRating.png"
import cartIcon from "../../assets/images/icons/addToCart.png"
import noimage from "../../assets/images/noimage.jpg"
import axios from 'axios'
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import "./visit_shop.css"
import cartEventEmitter from "../../helpers/EventEmitter"
import React from "react"
import addProductEventEmitter from "../../helpers/AddProductEventEmitter";
import { FaCommentSlash } from 'react-icons/fa'; 
// import { Rating } from "../../components/common/rate"

function Visit_Shop () {

    interface Supplier {
        id: number;
        shopName: string;
        image: string | null;
    }

    const [, setCart] = useState([]);
    const [displayProduct, setDisplayProduct] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [feedBack, setFeedBack] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [suppliers, setSuppliers] = useState<Record<number, Supplier>>({});
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [newQuantity, setNewQuantity] = useState(0);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [, setAverageRatingSupplier] = useState(null);
    const [, setProductData] = useState([]);
    const [ ,setProductAverageRating] = useState({}); 
    const [recommendedForYou, setRecommendedForYou] = useState([]);
    const [image, setImage] = useState('');
    const [notHover, setNotHover] = useState('');
    const { userId, id: shopId } = useParams();
    const supplier = suppliers[shopId];

    // * Render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(rating)) {
                stars.push(<span className="fa fa-star checked" key={i}></span>); 
            } else {
                stars.push(<span className="fa fa-star" key={i}></span>); 
            }
        }
        return stars;
    }
    
    // * Function to fetch feedback for a specific product
    const handleFeedback = async (productId) => {
        try {
            const response = await axios.get(`https://localhost:7017/Rating/getFeedBack/${productId}`);
            setFeedBack(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // * Function to get the number of sold items for a product
    const getNumberOfSolds = (productId) => {
        const product = recommendedForYou.find(p => p.productId === productId);
        return product ? product.numberOfSolds : 0;
    };

   // * Get Recommended Products For You
    useEffect(() => {
        if (!userId) return;
        axios.get(`https://localhost:7017/Product/recommendedForYou?userId=${userId}&supplierId=${shopId}`)
            .then(async (res) => {
                setRecommendedForYou(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [userId, shopId]);

    // * Get the Average Rating for Supplier
    useEffect(() => {
        const fetchAverageRatingSupplier = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Rating/average-supplier-rating/${shopId}`);
                setAverageRatingSupplier(response.data.averageRating);
            } catch (error) {
                console.error(error);
            }
        }
        fetchAverageRatingSupplier();
    }, [shopId]);

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get(`https://localhost:7017/Rating/average-supplier-rating/${shopId}`);
                setAverageRatingSupplier(response.data.averageRating);
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
    }, [shopId]);

    // * Get the Average Rating for Product
    useEffect(() => {
        if (!departmentId) return;
        const fetchProductDataAndRatings = async () => {
            try {
                const productResponse = await axios.get(`https://localhost:7017/Product/ByShop/${shopId}/ByDepartment/${departmentId}`);
                setProductData(productResponse.data);

                const ratingsPromises = productResponse.data.map(async product => {
                    const response = await axios.get(`https://localhost:7017/Rating/average-product-rating/${product.productId}`);
                    return { productId: product.productId, averageRating: response.data.averageRating };
                });

                const ratings = await Promise.all(ratingsPromises);
                const ratingsMap = ratings.reduce((acc, curr) => {
                    acc[curr.productId] = curr.averageRating;
                    return acc;
                }, {});

                setProductAverageRating(ratingsMap);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProductDataAndRatings();
    }, [shopId, departmentId]);

    // * Get All departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Department');
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchDepartments();
    }, []);

    // * Get Department Name
    const getDepartmentName = (departmentId: number) => {
        const department = departments.find(d => d.productDepartments.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

    // * Get User Department
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Users/UserDepartment/${userId}`);
                setDepartmentId(response.data.departmentId);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDepartment();
    }, [userId]);

    // * Get All Products by shop and department
    useEffect(() => {
        if (!departmentId) return;
        const fetchProductByShopDepartment = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Product/ByShop/${shopId}/ByDepartment/${departmentId}`);
                setDisplayProduct(response.data);

                // * Fetch supplier data for each product
                const supplierIds = response.data.map(product => product.supplierId);
                const uniqueSupplierIds = [...new Set(supplierIds)];
                const suppliersData = {};

                for (const shopId of uniqueSupplierIds) {
                    const response = await axios.get(`https://localhost:7017/Users/getSupplierId/${shopId}`);
                    suppliersData[shopId as number] = response.data;
                }

                setSuppliers(suppliersData);
            } catch (error) {
                console.error(error);
            }
        }

        const validationListener = () => {
            fetchProductByShopDepartment();
        }

        addProductEventEmitter.emit("addProduct", validationListener);
        validationListener();

        return () => {
            addProductEventEmitter.emit("addProduct", validationListener);
        };
    }, [shopId, departmentId]);

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
            if (!departmentId) return;

            try {
                const response = await axios.get(`https://localhost:7017/Product/ByShop/${shopId}/ByDepartment/${departmentId}`);
                setDisplayProduct(response.data);

                // * Fetch supplier data for each product
                const supplierIds = response.data.map(product => product.supplierId);
                const uniqueSupplierIds = [...new Set(supplierIds)];
                const suppliersData = {};

                for (const shopId of uniqueSupplierIds) {
                    const response = await axios.get(`https://localhost:7017/Users/getSupplierId/${shopId}`);
                    suppliersData[shopId as number] = response.data;
                }

                setSuppliers(suppliersData);
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
    }, [shopId, departmentId]);

    // * Filter Products
    const filteredProduct = displayProduct.filter(product => 
        (
            selectedGender === '' ||
            product.category.toLowerCase() === selectedGender
        ) && 
        (
            selectedProductType === '' || 
            product.productTypeId.toString() === selectedProductType
        ) && 
        (
            selectedPriceRange === '' || 
            (selectedPriceRange === '<100' && product.price < 100) ||
            (selectedPriceRange === '100-500' && product.price >= 100 && product.price <= 500) ||
            (selectedPriceRange === '>500' && product.price > 500)
        )
    );
    
    // * Handle Product Type Filter
    const handleProductTypeClick = (e) => {
        const value = e.target.value;
        if (selectedProductType === value) {
            setSelectedProductType(''); 
            e.target.checked = false; 
        } else {
            setSelectedProductType(value);
        }
    }

    // * Handle Gender Filter
    const handleGenderClick = (e, gender) => {
        if (selectedGender === gender) {
            setSelectedGender('');
            e.target.checked = false;
        } else {
            setSelectedGender(gender);
        }
    }

    // * Handle Price Range
    const handlePriceRangeClick = (e, priceRange) => {
        if (selectedPriceRange === priceRange) {
            setSelectedPriceRange('');
            e.target.checked = false;
        } else {
            setSelectedPriceRange(priceRange);
        }
    }
    
    // * Add To Cart
    const addToCart = () => {
        const CloseBtn = document.getElementById("btnClose");
        if (!selectedProduct) return;

        if (!selectedSize) {
            toast.warning("Please select a size.");
            return;
        }

        if (quantity <= 0) {
            toast.warning("Please select a valid quantity.");
            return;
        }

        const cartAddRequest = {
            userId: userId,
            productId: selectedProduct.productId,
            size: selectedSize,
            quantity: quantity
        };

        axios.post('https://localhost:7017/Cart/add', cartAddRequest)
            .then(() => {
                toast.success("Item added to cart");
                cartEventEmitter.emit("itemAddedToCart");
                CloseBtn.click();
                HandleCloseButton();
                return axios.get(`https://localhost:7017/Cart/myCart/${userId}`);
            })
            .then(updatedCartResponse => {
                setCart(updatedCartResponse.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Error adding item to cart. Please try again.");
                }
        });
    };


    // * Update the Product Details Modal
    // useEffect(() => {
    //     const modal = document.getElementById('viewProdDetailsModal') 
    //     if (modal) {
    //         modal.addEventListener('hidden.bs.modal', HandleCloseButton);

    //         return () => {
    //             modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
    //         };
    //     }
    // }, []);

    // * Update the Size Guide Modal
    useEffect(() => {
        const modal = document.getElementById('viewSizeGuideModal');
        if (modal) {
            const handleModalReset = (event) => {
                if (event.target.id === 'viewSizeGuideModal') {
                    handleResetModal();
                }
            };
    
            modal.addEventListener('hidden.bs.modal', handleModalReset);
    
            return () => {
                modal.removeEventListener('hidden.bs.modal', handleModalReset);
            };
        }
    }, []);

    // * Handle the Selected Size
    const HandleSelectedSize = (event) => {
        const sizeId = parseInt(event.target.value, 10); 
        const selectedSize = selectedProduct.sizes.find(size => size.id === sizeId);
        if (selectedSize) {
            setSelectedSize(selectedSize.size);
            setNewQuantity(selectedSize.quantity);
        }
    };

    // * Handle Close Button
    const HandleCloseButton = () => {
        setQuantity(0);
        setSelectedProduct(null);
        setNewQuantity(0);
        setSelectedSize(null);
    };

    // * Handle Reset Modal
    const handleResetModal = () => {
        window.location.reload();
    };

    // * Handle Minus Quantity
    const HandleMinusQuantity = () => {
        const currentQuantity = quantity;
        if(currentQuantity > 0) {
            setQuantity(currentQuantity - 1);
        }
    };

    // * Handle Minus Quantity
    const HandlePlusQuantity = () => {
        const currentQuantity = quantity;
        const UpdateQuantity = newQuantity;

        if(currentQuantity < UpdateQuantity) {
            setQuantity(currentQuantity + 1);
        } else {
            setQuantity(UpdateQuantity);
        }
    };


    return (
        <div className="shop-main-container">
            <div className="shop-content1-container">
                <div className="col-md-10 shopDetails-container-shop">
                    <div className="visitShop-seller-details-container">
                        {supplier ? (
                            <React.Fragment>
                                <div className="seller-information-visitShop">
                                    <img className="shop-img" src={`https://localhost:7017/${supplier.image}`} />
                                    <div className="seller-name-address-container">
                                        <h3 className="visitShop-Name">{supplier.shopName}</h3>
                                        <h3 className="visitShop-address">{supplier.address}</h3>
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <p>Loading supplier details...</p>
                        )}
                    </div>
    
                    <h5 className="visitShop-rating">
                        <img className="ratingIcon" src={starIcon} />
                        {displayProduct.slice(0, 1).map((sup, index) => (
                            <span key={index}>{sup.supplier.averageRating.toFixed(1)}</span>
                        ))}
                    </h5>
                    
                    {/* Filter */}
                    <div className="prodFilter-container">
                        {/* <h4 className="filter-text">Filter</h4> */}
    
                        {/* product type filter */}
                        <div className="prod-type-filter-container row">
                            <div className="col-md-3 filter-type-text">
                                <h4 className="prodType-filter-title">Type</h4>
                            </div>
                            {/* check button product types */}
                            <div className="col-md-8 prod-type-checkbox">
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="1" 
                                        name="productType"
                                        id="shopProdTypeSchoolUniform"
                                        checked={selectedProductType === '1'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> School Uniform
                                </h4>
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="2" 
                                        name="productType"
                                        id="shopProdCheckbox"
                                        checked={selectedProductType === '2'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> Event T-shirt
                                </h4>
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="3" 
                                        name="productType"
                                        id="shopProdCheckbox"
                                        checked={selectedProductType === '3'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> Department Shirt
                                </h4>
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="4" 
                                        name="productType"
                                        id="shopProdCheckbox"
                                        checked={selectedProductType === '4'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> PE Uniform
                                </h4>
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="5" 
                                        name="productType"
                                        id="shopProdCheckbox"
                                        checked={selectedProductType === '5'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> ID Sling
                                </h4>
                                <h4 className="type-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="radio" 
                                        value="6" 
                                        name="productType"
                                        id="shopProdCheckbox"
                                        checked={selectedProductType === '6'}
                                        onClick={handleProductTypeClick}
                                    />
                                    <hr/> Accessories
                                </h4>
                            </div>
    
                            {/* Price filter */}
                            <div className="prod-price-filter-container row">
                                <div className="col-md-3 filter-price-text">
                                    <h4 className="prodType-filter-title">Price</h4>
                                </div>
                                <div className="col-md-8 prod-price-checkbox">
                                    <h4 className="price-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value="<100"
                                            checked={selectedPriceRange === '<100'}
                                            onClick={(e) => handlePriceRangeClick(e, '<100')}
                                        />
                                        <hr/> Below ₱100
                                    </h4>
                                    <h4 className="price-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value="100-500"
                                            checked={selectedPriceRange === '100-500'}
                                            onClick={(e) => handlePriceRangeClick(e, '100-500')}
                                        />
                                        <hr/> ₱100 - ₱500
                                    </h4>
                                    <h4 className="price-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value=">500"
                                            checked={selectedPriceRange === '>500'}
                                            onClick={(e) => handlePriceRangeClick(e, '>500')}
                                        />
                                        <hr/> Above ₱500
                                    </h4>
                                </div>
                            </div>
    
    
                                {/* GENDER filter */}
                            <div className="prod-gender-filter-container row">
                                <div className="col-md-3 filter-gender-text">
                                    <h4 className="prodType-filter-title">Gender</h4>
                                </div>
                                {/* check button GENDER */}
                                <div className="col-md-8 prod-gender-checkbox">
                                    <h4 className="gender-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value="male" 
                                            name="gender"
                                            id="shopProdGenderMale"
                                            defaultChecked={selectedGender === 'male'}
                                            onClick={(e) => handleGenderClick(e, 'male')}
                                        />
                                        <hr/> Male
                                    </h4>
                                    <h4 className="gender-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value="female" 
                                            name="gender"
                                            id="shopProdGenderFemale"
                                            defaultChecked={selectedGender === 'female'}
                                            onClick={(e) => handleGenderClick(e, 'female')}
                                        />
                                        <hr/> Female
                                    </h4>
                                    <h4 className="gender-filter-label">
                                        <input 
                                            className="form-check-input prod-cart-checkBox" 
                                            type="radio" 
                                            value="unisex" 
                                            name="gender"
                                            id="shopProdGenderUnisex"
                                            defaultChecked={selectedGender === 'unisex'}
                                            onClick={(e) => handleGenderClick(e, 'unisex')}
                                        />
                                        <hr/> Unisex
                                    </h4>
                                </div>
                            </div>
    
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="shop-content2-container">
                <div className="top-ratedProducts-Shop">
                    <h3 className="topRated-label">Recommended For You</h3>
                    <div className="topProds-container-visitShop">
                        {recommendedForYou
                        .slice(0, 5)
                        .map(recommended => (
                            <div 
                                className="topProdShop-card"
                                data-bs-toggle="modal" 
                                data-bs-target={!recommended.isActive ? undefined : "#viewProdDetailsModal"}
                                key={recommended.productId} 
                                onClick={() => {
                                    if (recommended.isActive) {
                                        setSelectedProduct(recommended);
                                        setImage(`https://localhost:7017/${recommended.image}`);
                                        handleFeedback(recommended.productId);
                                    }
                                }}
                            >
                                <img className="visitShopProdImg" src={`https://localhost:7017/${recommended.image}`} alt={recommended.productName} />
                                <h4 className="visitShop-topProdName">{recommended.productName}</h4>
                                <div className="topProd-rating">
                                    {renderStars(recommended.averageRating)}
                                </div>
                                <h3 className="topProdPrice">{recommended.price ? recommended.price.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'PHP',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })
                                        : "₱0.00"}</h3>
                                {!recommended.isActive && <span className="badge badge-danger">Inactive</span>}
                            </div>
                        ))}
                    </div>
                </div>
                <h3 className="prods-available-label">Products Available</h3>
                <div className="otherProds-visitShop-container">
                    {filteredProduct.map(product => (
                        <div 
                            className={`prodShop-card ${!product.isActive ? 'inactive-product' : ''}`} 
                            data-bs-toggle="modal" 
                            data-bs-target={!product.isActive ? undefined : "#viewProdDetailsModal"}
                            key={product.productId} 
                            onClick={() => {
                                if (product.isActive) {
                                    setSelectedProduct(product);
                                    setImage(`https://localhost:7017/${product.image}`);
                                    handleFeedback(product.productId);
                                }
                            }}
                        > 
                            <img className="visitShopProdImg" src={`https://localhost:7017/${product.image}`} alt={product.productName}/>
                            <div className="col-md-12 shop-prodDetails-container">
                                <h4 className="col-md-8 visitShop-prodName">{product.productName}</h4>
                                <h3 className="visitShop-prodPrice">{product.price ? product.price.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'PHP',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                    : "₱0.00"}
                                </h3>
                                {!product.isActive && <span className="badge badge-danger">Inactive</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
    
            <div className="modal fade" id="viewProdDetailsModal" tabIndex={-1} aria-labelledby="viewProdDetailsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="col-md-12 close-btn-container">
                            <button 
                                type="button" 
                                className="btn-close"
                                data-bs-dismiss="modal" 
                                aria-label="Close"
                                onClick={HandleCloseButton}
                                id="btnClose"
                            >
                            </button>
                        </div>
                            <div className="modal-body viewProd-modalBody">
                            {selectedProduct && (
                            <React.Fragment>
                                <div className="product-div-left">
                                    <div className="img-container">
                                        <img 
                                            className="prodModal-Image" 
                                            src={notHover || image || noimage} 
                                        />
                                    </div>
                                    <div className="hover-container">
                                        <div 
                                            onMouseOver={() => setNotHover(selectedProduct.frontViewImage ? `https://localhost:7017/${selectedProduct.frontViewImage}` : noimage)}
                                            onMouseLeave={() => setNotHover('')}
                                        >
                                            <img 
                                                className="small-image" 
                                                src={selectedProduct.frontViewImage ? `https://localhost:7017/${selectedProduct.frontViewImage}` : noimage} 
                                            />
                                        </div>
                                        <div 
                                            onMouseOver={() => setNotHover(selectedProduct.sideViewImage ? `https://localhost:7017/${selectedProduct.sideViewImage}` : noimage)}
                                            onMouseLeave={() => setNotHover('')}
                                        >
                                            <img 
                                                className="small-image" 
                                                src={selectedProduct.sideViewImage ? `https://localhost:7017/${selectedProduct.sideViewImage}` : noimage} 
                                            />
                                        </div>
                                        <div 
                                            onMouseOver={() => setNotHover(selectedProduct.backViewImage ? `https://localhost:7017/${selectedProduct.backViewImage}` : noimage)}
                                            onMouseLeave={() => setNotHover('')}
                                        >
                                            <img 
                                                className="small-image" 
                                                src={selectedProduct.backViewImage ? `https://localhost:7017/${selectedProduct.backViewImage}` : noimage}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="prodModal-details-container">
                                    <h2 className="prodModal-Name">{selectedProduct.productName}</h2>
    
                                    <h5 className="prodModal-text">
                                        {selectedProduct.averageRating > 0 ? (
                                            <React.Fragment>
                                                <span className="fa fa-star" style={{ color: 'yellow', marginRight: '3px' }}></span>
                                                {selectedProduct.averageRating.toFixed(1)}
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <span className="fa fa-star" style={{ color: '#ccc', marginRight: '3px' }}></span>
                                                {selectedProduct.averageRating.toFixed(1)}
                                            </React.Fragment>
                                        )}
                                    </h5>
                                    <span className="num-sold-prod"><span className="numberSold-prod">{getNumberOfSolds(selectedProduct.productId)}</span>sold</span>
                                    <h5 className="prodModal-text">
                                        {getDepartmentName(selectedProduct.productDepartments.departmentId)}
                                    </h5>
                                    <h5 className="prodModal-text">
                                        {selectedProduct.category}
                                    </h5>
                                    <h1 className="prodModal-Price">
                                        {selectedProduct.price ? selectedProduct.price.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'PHP',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })
                                        : "₱0.00"}
                                    </h1>
                                    <div className="prodModal-Size-Stock-container">
                                    <button 
                                                className="sizeGuide-btn"
                                                data-bs-toggle="modal"
                                                data-bs-target="#viewSizeGuideModal"
                                                title="view size guide"
                                            >
                                                Size Guide
                                            </button>
                                        <select 
                                            className="col-md-2" 
                                            title="select product size"
                                            style={{ padding:'10px', border: '2px solid white', borderRadius:'10px' }}
                                            onChange={HandleSelectedSize}
                                        >
                                            <option disabled selected hidden>
                                                Select Size
                                            </option>
                                            {selectedProduct.sizes && selectedProduct.sizes.map((size, index) => (
                                                <option key={`${size}-${index}`} value={size.id} disabled={size.quantity === 0}>
                                                    {size.size} {size.quantity === 0 ? '(Sold Out)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedProduct.sizes && (
                                            <h5 className="prodModal-stocks">Stocks: {newQuantity}</h5>
                                        )}
                                    </div>
                                    <div className="prodModal-quantity-container">
                                            <h5 style={{ marginRight:'10px', fontSize:'12px' }}>Quantity</h5>
                                        <button className="prodModal-minus-quanti-btn" onClick={HandleMinusQuantity}>
                                            -
                                        </button>
    
                                        <input 
                                            id="quantities"
                                            className="prodModal-quanti-input" 
                                            type="text" 
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                        >
                                        </input>
    
                                        <button className="prodModal-plus-quanti-btn" onClick={HandlePlusQuantity}>
                                            +
                                        </button>
                                    </div>
                                    <div className="addToCart-container">
                                        <button className="prodModal-add-to-cart-btn" onClick={addToCart} >
                                            <img className="prodModal-cart-icon" src={ cartIcon }/>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                            )}

                            <div className="product-reviews-container">
                                <h2>Reviews</h2>
                                {feedBack && feedBack.length > 0 ? (
                                    <div className="user-review-card">
                                        {feedBack
                                            .filter(rating => rating.role === 1)
                                            .slice(0, 5)
                                            .map((rating, ratingIndex) => (
                                                <React.Fragment key={ratingIndex}>
                                                    <div className="custDetails-reviews">
                                                        <img
                                                            className="review-cust-profile"
                                                            src={`https://localhost:7017/${rating.user.image}`}
                                                            alt={`${rating.user.firstName} ${rating.user.lastName}`} />
                                                        <div className="cust-name-rating-container">
                                                            <span className="reviews-CustName">
                                                                {rating.user.firstName} {rating.user.lastName}
                                                            </span>
                                                            <span className="reviews-rating">
                                                                <span className="reviewRating">{renderStars(rating.value)}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="prodReview-visitShop" id="productReview">{rating.comment}</p>
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="no-reviews-message text-center p-3 border border-white" style={{ backgroundColor: "white" }}>
                                        <FaCommentSlash className="no-reviews-icon" style={{ height: '50px', width: '50px' }} />
                                        <p className="no-reviews-text">
                                            We're sorry, but there are no reviews available for this product at the moment.
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* <nav aria-label="Page navigation example">
                                <ul className="pagination pagination-lg">
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                    </li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                    </li>
                                </ul>
                            </nav> */}
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="modal fade" id="viewSizeGuideModal" tabIndex={-1} aria-labelledby="viewSizeGuideModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="col-md-12 close-btn-container">
                            <button 
                                type="button" 
                                className="btn-close"
                                data-bs-dismiss="modal" 
                                aria-label="Close"
                                onClick={() => window.location.reload()}
                            >
                            </button>
                        </div> 
                        <div className="image-container">
                            {selectedProduct &&  (
                                <img 
                                    className="prodSizeGuideModal-Image" 
                                    src={`https://localhost:7017/${selectedProduct.sizeGuide}`} 
                                    alt="Size Guide" 
                                />
                            )}
                        </div>     
                    </div>
                </div>
            </div>
        </div>   
    )
}

export default Visit_Shop