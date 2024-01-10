import './admin_shops.css'
import { useEffect, useState } from 'react'
import starIcon from "../../assets/images/icons/starRating.png"
import prodRating from "../../assets/images/icons/star.png"
import axios from 'axios'
import validationEventEmitter from '../../helpers/ValidationEmitter';
import registerUsersEventEmitter from '../../helpers/RegisterUsersEmitter';
import addProductEventEmitter from '../../helpers/AddProductEventEmitter'


function Admin_Shops () {

    const [shop, setShop] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [averageRatingSupplier, setAverageRatingSupplier] = useState(null);
    const [averageRatingProduct, setAverageRatingProduct] = useState(null);
    

    // * For Delay
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // * Get All Departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Department');
                setDepartments(response.data);
            } catch(error) {
                console.error(error)
            }
        }
        fetchDepartments();
    }, []);

    // * Get the Department Name
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.productDepartments.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

    // * Get All Product Types
    useEffect(() => {
        const fetchProductType = async () => {
            try {
                const response = await axios.get("https://localhost:7017/ProductType");
                setProductTypes(response.data);
            } catch(error) {
                console.log(error);
                console.error("Network error or server not responding");
            }
        }
        fetchProductType();
    }, []);

    // * Get the Product Type Name
    const getProductTypeName = (productTypeId) => {
        const productType = productTypes.find((p) => p.productTypeId === productTypeId);
        return productType ? productType.product_Type : "Unknown Type";
    };

    // * Filter shops based on their status (Validated/Invalid)
    const filteredShopsByStatus = shop.filter((shopItem) => {
        const matchesStatus = selectedStatus === 'All' || (shopItem.isValidate ? 'Validated' : 'Invalid') === selectedStatus;

        return matchesStatus;
    });

    // * Filter products based on gender and product type
    const filteredProducts = (selectedShop && selectedShop.products) ? selectedShop.products.filter((product) => {

        const matchesGender = !selectedGender || (product.category && product.category.toLowerCase() === selectedGender);
        
        const matchesProductType = !selectedProductType || (product.productTypeId && product.productTypeId.toString() === selectedProductType);
        
        const matchesPriceRange = !selectedPriceRange || 
                                (selectedPriceRange === '<100' && product.price < 100) || 
                                (selectedPriceRange === '100-500' && product.price >= 100 && product.price <= 500) || 
                                (selectedPriceRange === '>500' && product.price > 500)

        return matchesGender && matchesProductType && matchesPriceRange;

    }) : [];

    // * Handle Gender Filter
    const handleGenderClick = (e, gender) => {
        if (selectedGender === gender) {
            setSelectedGender('');
            e.target.checked = false;
        } else {
            setSelectedGender(gender);
        }
    }

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

    // * Handle Price Filter
    const handlePriceRangeClick = (e, priceRange) => {
        if (selectedPriceRange === priceRange) {
            setSelectedPriceRange('');
            e.target.checked = false;
        } else {
            setSelectedPriceRange(priceRange);
        }
    }

    // * Handle Reset Button
    const HandleResetButton = async () => {
        setSelectedProductType('');
        setSelectedPriceRange('');
        setSelectedGender('');
        await sleep(20);
        window.location.reload();
    }

    // * Compute all stocks
    const totalStock = (sizes) => {
        if (!sizes || sizes.length === 0) {
            return 0;
        }
        return sizes.reduce((acc, currentSize) => acc + currentSize.quantity, 0);
    }

    // * Get All Suppliers with Event Emitter
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Users/getSuppliers');
                setShop(response.data);
            } catch (error) {
                console.error('Network error or server not responding');
            }
        };

        const validationListener = () => {
            fetchShops();
        };

        validationEventEmitter.on("validInvalid", validationListener);
        registerUsersEventEmitter.on("registerSupplier", validationListener);
        addProductEventEmitter.on("addProduct", validationListener);
        fetchShops();

        return () => {
            validationEventEmitter.off("validInvalid", validationListener);
            registerUsersEventEmitter.off("registerSupplier", validationListener);
            addProductEventEmitter.off("addProduct", validationListener);
        };
    }, []);

    // * Windows Event Listener Focus for Supplier
    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get('https://localhost:7017/Users/getSuppliers');
                setShop(response.data);
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
    }, [])

    // * Reset Modal
    useEffect(() => {
        const modalElement = document.getElementById('viewProdsModal');

        const handleModalClose = () => {
            setSelectedProductType('');
            setSelectedPriceRange('');
            setSelectedGender('');

            const allCollapse = document.querySelectorAll('.collapse');

            allCollapse.forEach(collapseElement => {
                if (collapseElement.classList.contains('show')) {
                    collapseElement.classList.remove('show');
                }
            });
        };

        modalElement.addEventListener('hidden.bs.modal', handleModalClose);

        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
        };
    }, []);

    // * Get Average Rating for Supplier
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Users/getSuppliers');
                const suppliers = response.data;
                setShop(suppliers);
    
                const ratingsPromises = suppliers.map(supplier => 
                    axios.get(`https://localhost:7017/Rating/average-supplier-rating/${supplier.id}`)
                );
    
                const ratingsResponses = await Promise.all(ratingsPromises);
                const ratingsMap = ratingsResponses.reduce((acc, curr, index) => {
                    acc[suppliers[index].id] = curr.data.averageRating;
                    return acc;
                }, {});
    
                setAverageRatingSupplier(ratingsMap);
            } catch (error) {
                console.error('Network error or server not responding:', error);
            }
        };
        fetchShops();
    }, []);

    // * Get Average Rating for Product
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Users/getSuppliers');
                const suppliers = response.data;
                setShop(suppliers);
    
                const productRatingsMap = {};
    
                for (const supplier of suppliers) {
                    for (const product of supplier.products) {
                        const ratingResponse = await axios.get(`https://localhost:7017/Rating/average-product-rating/${product.productId}`);
                        productRatingsMap[product.productId] = ratingResponse.data.averageRating;
                    }
                }
    
                setAverageRatingProduct(productRatingsMap);
            } catch (error) {
                console.error('Network error or server not responding:', error);
            }
        };
        fetchShops();
    }, []);

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

            {filteredShopsByStatus.map(shopItem => (
                <div 
                    key={shopItem.id} 
                    className='admin-shop-card' 
                    data-bs-toggle="modal" 
                    data-bs-target="#viewProdsModal" 
                    onClick={() => setSelectedShop(shopItem)}
                >
                    <img className='shopProfileImgCard' src={ `https://localhost:7017/${shopItem.image}` } />
                    <div className='col-md-8 adminShop-card-details'>
                        <h5 className="supplier-card-title">{shopItem.shopName}</h5>
                        <h5 className='shop-rating-card'>
                            <img className="ratingIcon" src={starIcon} />
                            {averageRatingSupplier && averageRatingSupplier[shopItem.id] ?
                                averageRatingSupplier[shopItem.id].toFixed(1) : "No rating yet"}
                        </h5>
                        <h5 className='shop-rating-card'>{shopItem.address}</h5>
                    </div>
                </div>
            ))}

            {/* VIEW PRODUCTS MODAL */}
            <div className="modal fade" id="viewProdsModal" tabIndex={-1} aria-labelledby="viewProdsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen modal-dialog-scrollable">
                    <div className="modal-content" 
                        style={{ padding:'25px' }}>
                        <div className="viewProds-modalHeader">
                            <h1
                                style={{ color:'#020654' }}>Product List</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={HandleResetButton}></button>
                        </div>
                        <div className="productList-modalBody">
                            {/* Filter */}
                            <div className="admin-prodFilter-container">
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
                            {/* END OF FILTER */}

                            {/* PRODUCTS CONTAINER */}
                                <div className='adminShop-prods-container'>

                                {/* PRODUCT CARD */}
                                {filteredProducts.map(product => (
                                <div key={product.productId} className='col-md-12' style={{ backgroundColor:'#004AAD', padding:'10px', borderRadius:'5px' }}>
                                    <div style={{ display:'flex', flexFlow:'column' }}>
                                        <div className='admin-viewProds-card'>
                                            <img className='admin-viewProd-img' src={ `https://localhost:7017/${product.image}` }/>
                                            <h4 className='col-md-4 admin-prodName' style={{ display:'flex', flexFlow:'column' }}>{product.productName}
                                                <span className='admin-prodRating' style={{ color:'white', marginTop:'8px', display:'flex', alignItems:'center' }}>

                                                    <img style={{ marginRight:'5px', width:'100%', maxWidth:'12px' }} src={ prodRating } alt="product rating icon" />
                                                    {averageRatingProduct && averageRatingProduct[product.productId] ? averageRatingProduct[product.productId].toFixed(1) : "No rating yet"}
                                                </span>
                                            </h4>
                                            <h4 className='col-md-3 admin-prodStocks'>Total Stocks:
                                                <span className='totalStocks-adminProd'>{totalStock(product.sizes)}</span>
                                            </h4>
                                            <h4 className='col-md-3 admin-prodPrice'>Price:
                                                <span className='price-adminProd'>
                                                    {product.price ? product.price.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "₱0.00"}
                                                </span>
                                            </h4>
                                        </div>
                                        
                                        <div className='showMore-btn-container'>
                                                    {/* SHOW MORE BUTTON */}
                                            <button 
                                                className="admin-prodShowDetails-btn" 
                                                type="button" 
                                                data-bs-toggle="collapse"  
                                                data-bs-target={`#prodDetailsCollapse${product.productId}`}  
                                                aria-expanded="false" 
                                                aria-controls={`prodDetailsCollapse${product.productId}`}
                                            >
                                                Show More
                                            </button>
                                        </div>
                                    </div>


                                    <div className="collapse" id={`prodDetailsCollapse${product.productId}`} style={{ marginRight:'18px' }}>
                                        {/* START OF CARD BODY */}
                                        <div className="card card-body" style={{ display:'flex', justifyContent:'space-between', gap:'10px' }}>

                                            {/* DESCRIPTION */}
                                            <h5 className='admin-prodDetails-labels' style={{ display:'flex', flexWrap:'wrap' }}>Description:
                                                <span className='col-md-10 admin-prodDetails-text'>{product.description}</span>
                                            </h5>

                                            {/* DEPARTMENT */}
                                            <h5 className='admin-prodDetails-labels'>Department:
                                                <h5 className='admin-prodDetails-text'>{getDepartmentName(product.departmentId)}</h5>
                                            </h5>

                                            {/* TYPE */}
                                            <h5 className='admin-prodDetails-labels'>Type:
                                                <h5 className='admin-prodDetails-text'>{getProductTypeName(product.productTypeId)}</h5>
                                            </h5>

                                            {/* SIZES AVAILABLE */}
                                            <h5 className='admin-prodDetails-labels'>Sizes Available:
                                                <h5 className='admin-prodDetails-text'>
                                                    {product.sizes.map((sizeObj, index) => (
                                                        <span style={{ fontSize: '18px' }} key={index}>{sizeObj.size}{index !== product.sizes.length - 1 ? ', ' : ''}</span>
                                                    ))}
                                                </h5>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Admin_Shops