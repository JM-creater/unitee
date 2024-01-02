import './search_product.css'
import MWSizing from "../../assets/images/MW SIZING.png"
import UNISEX from "../../assets/images/UNISEX SIZING.png"
import cartIcon from "../../assets/images/icons/addToCart.png"
import prodRatingModal from "../../assets/images/icons/starRating.png"
import axios from 'axios'
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import cartEventEmitter from "../../helpers/EventEmitter"


function  Search_Product () {

    const [, setCart] = useState([]);
    const [displayProduct, setDisplayProduct] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [newQuantity, setNewQuantity] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');

    // * Handle to handle input changes
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // * Handle to perform search
    const performSearch = (productName = searchTerm) => {
        setSearchTerm(productName); 
        navigate(`/shop/${userId}/search_product?search=${productName}`);
    };

    // * Fetch products based on search
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (search) {
                    const response = await axios.get(`https://localhost:7017/Product/recommender?search=${search}`);
                    setDisplayProduct(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchProducts();
    }, [search]);

    // * Search Product Data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`https://localhost:7017/Product/searchByDepartment?userId=${userId}`);
                setDisplayProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, [userId]);

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
    useEffect(() => {
        const modal = document.getElementById('viewProdDetailsModal') 
        if (modal) {
            modal.addEventListener('hidden.bs.modal', HandleCloseButton);

            return () => {
                modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
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
    }

    // * Handle Close Button
    const HandleCloseButton = () => {
        setQuantity(0);
        setSelectedProduct(null);
        setNewQuantity(0);
        setSelectedSize(null);
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

    return <div className="search-prod-main-container">

        <div className="search-result-message">
            {search && <h3>Search Result for "{search}"</h3>}
        </div>

        <div className="search-container-product">
            <span className="fa fa-search form-control-feedback search-icon"></span>
            <input 
                className="Product-Search-Bar"
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
        <div className='search-dropdown-product'>
            {displayProduct.filter(productFilter => {
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
                    className='search-dropdown-row-product'
                    onClick={() => performSearch(productData.productName)}
                >
                    <span className="fa fa-search form-control-feedback search-icon"></span>
                    {productData.productName}
                </div>
            ))}
        </div>

        <div className='sub-container'>
            <div className='recommender-filter-container'>
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
            
            <div className="recommender-prod-container">
                {filteredProduct.map(product => (
                    <div 
                        className="prodShop-card" 
                        data-bs-toggle="modal" 
                        data-bs-target="#viewProdDetailsModal" 
                        key={product.productId} 
                        onClick={() => setSelectedProduct(product)}
                    > 
                        <img className="visitShopProdImg" src={ `https://localhost:7017/${product.image}` }/>
                        <div className="col-md-12 shop-prodDetails-container">
                            <h4 className="col-md-8 visitShop-prodName">{product.productName}</h4>
                            <h3 className="visitShop-prodPrice">₱{product.price}</h3>
                        </div>
                    </div>
                ))}
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
                            <>
                                <div className="product-div-left">
                                    <div className="img-container">
                                        <img 
                                            className="prodModal-Image" 
                                            src={`https://localhost:7017/${selectedProduct.image}`} 
                                        />
                                    </div>
                                    <div className="hover-container">
                                        <div>
                                            <img 
                                                className="small-image" 
                                                src={`https://localhost:7017/${selectedProduct.image}`} 
                                            />
                                        </div>
                                        <div>
                                            <img 
                                                className="small-image" 
                                                src={`https://localhost:7017/${selectedProduct.image}`} 
                                            />
                                        </div>
                                        <div>
                                            <img 
                                                className="small-image" 
                                                src={`https://localhost:7017/${selectedProduct.image}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 prodModal-details-container">
                                    <h2 className="col-md-12 prodModal-Name">{selectedProduct.productName}</h2>

                                    {/* {ratings && ( */}
                                        <>
                                            <h5 className="prodModal-text">
                                                <img className="prodModalRating-icon" src={ prodRatingModal }/>
                                                0
                                            </h5>
                                        </>
                                    {/* )} */}

                                    <h5 className="prodModal-text">
                                    {getDepartmentName(selectedProduct.productDepartments.departmentId)}
                                    </h5>
                                    <h5 className="prodModal-text">
                                        {selectedProduct.category}
                                    </h5>
                                    <h1 className="prodModal-Price">₱{selectedProduct.price}</h1>
                                    <div className="prodModal-SizeGuide">
                                        <h5 className="prodModal-text">
                                            {/* <img className="sizeIcon-container" src={ sizeIcon }/> */}
                                            <button 
                                                data-bs-toggle="modal"
                                                data-bs-target="#viewSizeGuideModal"
                                                style={{ 
                                                    padding:'5px', 
                                                    border: '2px solid white', 
                                                    backgroundColor:'#004AAD', 
                                                    borderRadius:'10px',
                                                    color: 'white'
                                                }}
                                            >
                                                Size Guide
                                            </button>
                                        </h5>
                                        
                                    </div>
                                    <div className="col-md-12 prodModal-Size-Stock-container">
                                        <select 
                                            className="col-md-5" 
                                            style={{ padding:'10px', border: '2px solid white', backgroundColor:'#F0F0F0', borderRadius:'10px' }}
                                            onChange={HandleSelectedSize}
                                        >
                                            <option disabled selected hidden>
                                                Select Size
                                            </option>
                                            {selectedProduct.sizes && selectedProduct.sizes.map((size, index) => (
                                                <option key={`${size}-${index}`} value={size.id}>
                                                    {size.size}
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
                                    <button className="prodModal-add-to-cart-btn" onClick={addToCart} >
                                        <img className="prodModal-cart-icon" src={ cartIcon }/>
                                        Add to Cart
                                    </button>
                                </div>
                            </>
                            )}
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
                                onClick={HandleCloseButton}
                            >
                            </button>
                        </div>
                        <div className="image-container">
                            <img className="prodSizeGuideModal-Image" src={ MWSizing }/>
                            <img className="prodSizeGuideModal-Image" src={ UNISEX } />
                        </div>         
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Search_Product