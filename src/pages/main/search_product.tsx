import "./search_product.css";
import cartIcon from "../../assets/images/icons/addToCart.png";
import prodRatingModal from "../../assets/images/icons/starRating.png";
import LoadingGif from "../../assets/images/icons/loadingscreen.svg";
import noimage from "../../assets/images/noimage.jpg"
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import cartEventEmitter from "../../helpers/EventEmitter";
import { FaCommentSlash } from 'react-icons/fa'; 
import React from "react";

function Search_Product() {
    const [, setCart] = useState([]);
    const [displayProduct, setDisplayProduct] = useState([]);
    const [feedBack, setFeedBack] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [newQuantity, setNewQuantity] = useState(0);
    const [image, setImage] = useState("");
    const [notHover, setNotHover] = useState("");
    const { userId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search");
    const [isLoading, setIsLoading] = useState(true);

     // * Function to get the number of sold items for a product
     const getNumberOfSolds = (productId) => {
        const product = displayProduct.find(p => p.productId === productId);
        return product ? product.numberOfSolds : 0;
    };

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

    // * Fetch products based on search
    useEffect(() => {
        setIsLoading(true);
        const fetchProducts = async () => {
        try {
            if (search) {
                const response = await axios.get(
                    `https://localhost:7017/Product/recommender?search=${search}&userId=${userId}`
                );
                setDisplayProduct(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        };
        fetchProducts();
    }, [search, userId]);

    // * Get All departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("https://localhost:7017/Department");
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDepartments();
    }, []);

    // * Get Department Name
    const getDepartmentName = (departmentId: number) => {
        const department = departments.find(
            (d) => d.productDepartments.departmentId === departmentId
        );
        return department ? department.department_Name : "Unknown Department";
    };

    // * Filter Products
    const filteredProduct = displayProduct.filter(
        (product) =>
            (selectedGender === "" ||
                product.category.toLowerCase() === selectedGender) &&
            (selectedProductType === "" ||
                product.productTypeId.toString() === selectedProductType) &&
            (selectedPriceRange === "" ||
            (selectedPriceRange === "<100" && product.price < 100) ||
            (selectedPriceRange === "100-500" &&
                product.price >= 100 &&
                product.price <= 500) ||
            (selectedPriceRange === ">500" && product.price > 500))
    );

    // * Handle Product Type Filter
    const handleProductTypeClick = (e) => {
            const value = e.target.value;
            if (selectedProductType === value) {
                setSelectedProductType("");
                e.target.checked = false;
            } else {
                setSelectedProductType(value);
            }
    };

    // * Handle Gender Filter
    const handleGenderClick = (e, gender) => {
        if (selectedGender === gender) {
            setSelectedGender("");
            e.target.checked = false;
        } else {
            setSelectedGender(gender);
        }
    };

    // * Handle Price Range
    const handlePriceRangeClick = (e, priceRange) => {
        if (selectedPriceRange === priceRange) {
            setSelectedPriceRange("");
            e.target.checked = false;
        } else {
            setSelectedPriceRange(priceRange);
        }
    };

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
            quantity: quantity,
        };

        axios.post("https://localhost:7017/Cart/add", cartAddRequest)
        .then(() => {
            toast.success("Item added to cart");
            cartEventEmitter.emit("itemAddedToCart");
            CloseBtn.click();
            HandleCloseButton();
            return axios.get(`https://localhost:7017/Cart/myCart/${userId}`);
        })
        .then((updatedCartResponse) => {
            setCart(updatedCartResponse.data);
        })
        .catch((error) => {
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
        const modal = document.getElementById("viewSizeGuideModal");
        if (modal) {
            const handleModalReset = (event) => {
                if (event.target.id === "viewSizeGuideModal") {
                    handleResetModal();
                }
            };

            modal.addEventListener("hidden.bs.modal", handleModalReset);

            return () => {
                modal.removeEventListener("hidden.bs.modal", handleModalReset);
            };
        }
    }, []);

    // * Handle the Selected Size
    const HandleSelectedSize = (event) => {
        const sizeId = parseInt(event.target.value, 10);
        const selectedSize = selectedProduct.sizes.find(
            (size) => size.id === sizeId
        );
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
        if (currentQuantity > 0) {
            setQuantity(currentQuantity - 1);
        }
    };

    // * Handle Minus Quantity
    const HandlePlusQuantity = () => {
        const currentQuantity = quantity;
        const UpdateQuantity = newQuantity;

        if (currentQuantity < UpdateQuantity) {
            setQuantity(currentQuantity + 1);
        } else {
            setQuantity(UpdateQuantity);
        }
    };

return (
    <React.Fragment>
        {isLoading ? (
            <div className="mainloading-screen">
                <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
            </div>
        ) : (
            <div className="search-prod-main-container">
            <div className="search-result-message">
                {search && <h3>Search Result for "{search}"</h3>}
            </div>
            <div className="sub-container">
                <div className="recommender-filter-container">
                {/* Filter */}
                <div className="prodFilter-container">
                    <h4>Filter</h4>

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
                                    checked={selectedProductType === "1"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> School Uniform
                            </h4>
                            <h4 className="type-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="2"
                                    name="productType"
                                    id="shopProdCheckbox"
                                    checked={selectedProductType === "2"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> Event T-shirt
                            </h4>
                            <h4 className="type-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="3"
                                    name="productType"
                                    id="shopProdCheckbox"
                                    checked={selectedProductType === "3"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> Department Shirt
                            </h4>
                            <h4 className="type-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="4"
                                    name="productType"
                                    id="shopProdCheckbox"
                                    checked={selectedProductType === "4"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> PE Uniform
                            </h4>
                            <h4 className="type-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="5"
                                    name="productType"
                                    id="shopProdCheckbox"
                                    checked={selectedProductType === "5"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> ID Sling
                            </h4>
                            <h4 className="type-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="6"
                                    name="productType"
                                    id="shopProdCheckbox"
                                    checked={selectedProductType === "6"}
                                    onClick={handleProductTypeClick}
                                />
                                <hr /> Accessories
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
                                        checked={selectedPriceRange === "<100"}
                                        onClick={(e) => handlePriceRangeClick(e, "<100")}
                                    />
                                    <hr /> Below ₱100
                                </h4>
                                <h4 className="price-filter-label">
                                    <input
                                        className="form-check-input prod-cart-checkBox"
                                        type="radio"
                                        value="100-500"
                                        checked={selectedPriceRange === "100-500"}
                                        onClick={(e) => handlePriceRangeClick(e, "100-500")}
                                    />
                                    <hr /> ₱100 - ₱500
                                </h4>
                                <h4 className="price-filter-label">
                                    <input
                                        className="form-check-input prod-cart-checkBox"
                                        type="radio"
                                        value=">500"
                                        checked={selectedPriceRange === ">500"}
                                        onClick={(e) => handlePriceRangeClick(e, ">500")}
                                    />
                                    <hr /> Above ₱500
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
                                    defaultChecked={selectedGender === "male"}
                                    onClick={(e) => handleGenderClick(e, "male")}
                                />
                                <hr /> Male
                            </h4>
                            <h4 className="gender-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="female"
                                    name="gender"
                                    id="shopProdGenderFemale"
                                    defaultChecked={selectedGender === "female"}
                                    onClick={(e) => handleGenderClick(e, "female")}
                                />
                                <hr /> Female
                            </h4>
                            <h4 className="gender-filter-label">
                                <input
                                    className="form-check-input prod-cart-checkBox"
                                    type="radio"
                                    value="unisex"
                                    name="gender"
                                    id="shopProdGenderUnisex"
                                    defaultChecked={selectedGender === "unisex"}
                                    onClick={(e) => handleGenderClick(e, "unisex")}
                                />
                                <hr /> Unisex
                            </h4>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                <div className="recommender-prod-container">
                    {filteredProduct.map((product) => (
                        <div
                            className={`prodShop-card ${!product.isActive ? "inactive-product" : ""}`}
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
                            <img
                                className="visitShopProdImg"
                                src={`https://localhost:7017/${product.image}`}
                                alt={product.productName}
                            />
                            <div className="col-md-12 shop-prodDetails-container">
                                <h4 className="col-md-8 visitShop-prodName">
                                    {product.productName}
                                </h4>
                                <h3 className="visitShop-prodPrice">
                                    {product.price ? product.price.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'PHP',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                    : "₱0.00"}
                                </h3>
                                {!product.isActive && (
                                    <span className="badge badge-danger">Inactive</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="modal fade"
                    id="viewProdDetailsModal"
                    tabIndex={-1}
                    aria-labelledby="viewProdDetailsModalLabel"
                    aria-hidden="true"
                >
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
                            <div className="col-md-5 prodModal-details-container">
                            <h2 className="col-md-12 prodModal-Name">
                                {selectedProduct.productName}
                            </h2>

                            <h5 className="prodModal-text">
                                <img
                                    className="prodModalRating-icon"
                                    src={prodRatingModal}
                                />
                                {selectedProduct.averageRating.toFixed(1)}
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
                            <div className="prodModal-SizeGuide">
                                <h5 className="prodModal-text">
                                {/* <img className="sizeIcon-container" src={ sizeIcon }/> */}
                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewSizeGuideModal"
                                    style={{
                                        padding: "5px",
                                        border: "2px solid white",
                                        backgroundColor: "#004AAD",
                                        borderRadius: "10px",
                                        color: "white",
                                    }}
                                >
                                    Size Guide
                                </button>
                                </h5>
                            </div>
                            <div className="col-md-12 prodModal-Size-Stock-container">
                                <select
                                className="col-md-5"
                                style={{
                                    padding: "10px",
                                    border: "2px solid white",
                                    backgroundColor: "#F0F0F0",
                                    borderRadius: "10px",
                                }}
                                onChange={HandleSelectedSize}
                                >
                                <option disabled selected hidden>
                                    Select Size
                                </option>
                                {selectedProduct.sizes &&
                                    selectedProduct.sizes.map((size, index) => (
                                    <option
                                        key={`${size}-${index}`}
                                        value={size.id}
                                        disabled={size.quantity === 0}
                                    >
                                        {size.size}{" "}
                                        {size.quantity === 0 ? "(Sold Out)" : ""}
                                    </option>
                                    ))}
                                </select>
                                {selectedProduct.sizes && (
                                <h5 className="prodModal-stocks">
                                    Stocks: {newQuantity}
                                </h5>
                                )}
                            </div>
                            <div className="prodModal-quantity-container">
                                <h5 style={{ marginRight: "10px", fontSize: "12px" }}>
                                Quantity
                                </h5>
                                <button className="prodModal-minus-quanti-btn" onClick={HandleMinusQuantity}>
                                -
                                </button>

                                <input
                                    id="quantities"
                                    className="prodModal-quanti-input"
                                    type="text"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(parseInt(e.target.value) || 0)
                                    }
                                ></input>

                                <button className="prodModal-plus-quanti-btn" onClick={HandlePlusQuantity}>
                                +
                                </button>
                            </div>
                            <button
                                className="prodModal-add-to-cart-btn"
                                onClick={addToCart}
                            >
                                <img className="prodModal-cart-icon" src={cartIcon} />
                                Add to Cart
                            </button>
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
                    </div>
                    </div>
                </div>
                </div>

                <div
                    className="modal fade"
                    id="viewSizeGuideModal"
                    tabIndex={-1}
                    aria-labelledby="viewSizeGuideModalLabel"
                    aria-hidden="true"
                >
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
                                {selectedProduct && (
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
            </div>
        )}
    </React.Fragment>
    
  );
}

export default Search_Product;
