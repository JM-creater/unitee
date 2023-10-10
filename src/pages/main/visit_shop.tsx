import MWSizing from "../../assets/images/MW SIZING.png"
import UNISEX from "../../assets/images/UNISEX SIZING.png"
import starIcon from "../../assets/images/icons/starRating.png"
import cartIcon from "../../assets/images/icons/addToCart.png"
import prodRatingModal from "../../assets/images/icons/starRating.png"
import axios from 'axios'
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import "./visit_shop.css"
import cartEventEmitter from "../../helpers/EventEmitter"

function Visit_Shop () {

    interface Department {
        departmentId: number;
        department_Name: string;
    }

    interface Supplier {
        id: number;
        shopName: string;
        image: string | null;
    }

    const [, setCart] = useState([]);
    const [displayProduct, setDisplayProduct] = useState([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [suppliers, setSuppliers] = useState<Record<number, Supplier>>({});
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [newQuantity, setNewQuantity] = useState(0);
    const { userId, id: shopId } = useParams();
    const supplier = suppliers[shopId];

    // Get All departments
    useEffect(() => {
        axios.get('https://localhost:7017/Department')
        .then(response => {
            setDepartments(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    //Get Department Name
    const getDepartmentName = (departmentId: number) => {
        const department = departments.find(d => d.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

    // Get All Products
    useEffect(() => {
        axios.get(`https://localhost:7017/Product/ByShop/${shopId}`)
            .then(async res => {
                setDisplayProduct(res.data);

                // Fetch supplier data for each product
                const supplierIds = res.data.map(product => product.supplierId);
                const uniqueSupplierIds = [...new Set(supplierIds)];
                const suppliersData = {};

                for (const shopId of uniqueSupplierIds) {
                    const response = await axios.get(`https://localhost:7017/Supplier/${shopId}`);
                    suppliersData[shopId as number] = response.data;
                }

                setSuppliers(suppliersData);
            })
            .catch(err => {
                console.error(err);
            });
    }, [shopId]);

    //Filter Products
    const filteredProduct = displayProduct.filter(product => 
        (
            selectedGender === '' ||
            product.category.toLowerCase() === selectedGender
        ) && 
        (
            selectedProductType === '' || 
            product.productTypeId.toString() === selectedProductType
        )
    );

    // Handle Gender 
    const handleGenderClick = (e, gender) => {
        if (selectedGender === gender) {
            setSelectedGender('');
            e.target.checked = false;
        } else {
            setSelectedGender(gender);
        }
    }

    // Handle Product Type
    const handleProductTypeClick = (e) => {
        const value = e.target.value;
        if (selectedProductType === value) {
            setSelectedProductType('');
        } else {
            setSelectedProductType(value);
        }
    }

    // Add To Cart
    const addToCart = () => {
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
            return axios.get(`https://localhost:7017/Cart/myCart/${userId}`);
        })
        .then(updatedCartResponse => {
            setCart(updatedCartResponse.data);
        })
        .catch(error => {
            toast.error(error.response.data.message || "Failed to add item to cart");
        });
    };

    // Update the Product Details Modal
    useEffect(() => {
        const modal = document.getElementById('viewProdDetailsModal') 
        if (modal) {
            modal.addEventListener('hidden.bs.modal', HandleCloseButton);

            return () => {
                modal.removeEventListener('hidden.bs.modal', HandleCloseButton);
            };
        }
    }, []);


    // Handle the Selected Size
    const HandleSelectedSize = (event) => {
        const sizeId = parseInt(event.target.value, 10); 
        const selectedSize = selectedProduct.sizes.find(size => size.id === sizeId);
        if (selectedSize) {
            setSelectedSize(selectedSize.size);
            setNewQuantity(selectedSize.quantity);
        }
    }

    // Handle Close Button
    const HandleCloseButton = () => {
        setQuantity(0);
        setSelectedProduct(null);
        setNewQuantity(0);
        setSelectedSize(null);
    };

    // Handle Minus Quantity
    const HandleMinusQuantity = () => {
        const currentQuantity = quantity;
        if(currentQuantity > 0) {
            setQuantity(currentQuantity - 1);
        }
    };

    // Handle Minus Quantity
    const HandlePlusQuantity = () => {
        const currentQuantity = quantity;
        const UpdateQuantity = newQuantity;

        if(currentQuantity < UpdateQuantity) {
            setQuantity(currentQuantity + 1);
        } else {
            setQuantity(UpdateQuantity);
        }
    };

    return <div className="shop-main-container">
        <div className="shop-content1-container">
            <div className="col-md-10 shopDetails-container-shop">
                <div>
                    {supplier ? (
                        <>
                            <img className="shop-img" src={`https://localhost:7017/${supplier.image}`} />
                            <h3 className="visitShop-Name">{supplier.shopName}</h3>
                        </>
                    ) : (
                        <p>Loading supplier details...</p>
                    )}
                </div>
                <h5 className="visitShop-rating">
                <img className="ratingIcon" src={ starIcon }/>No Rating Yet</h5>
                
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
                                    type="checkbox" 
                                    value="1" 
                                    id="shopProdCheckbox1"
                                    onClick={handleProductTypeClick}
                                />
                                School Uniform
                            </h4>
                            <h4 className="type-filter-label">
                                <input 
                                    className="form-check-input prod-cart-checkBox" 
                                    type="checkbox" 
                                    value="4" 
                                    id="shopProdCheckbox"
                                    onClick={handleProductTypeClick}
                                />
                                PE Uniform
                            </h4>
                            <h4 className="type-filter-label">
                                <input 
                                    className="form-check-input prod-cart-checkBox" 
                                    type="checkbox" 
                                    value="3" 
                                    id="shopProdCheckbox"
                                    onClick={handleProductTypeClick}
                                />
                                Department Shirt
                            </h4>
                            <h4 className="type-filter-label">
                                <input 
                                    className="form-check-input prod-cart-checkBox" 
                                    type="checkbox" 
                                    value="2" 
                                    id="shopProdCheckbox"
                                    onClick={handleProductTypeClick}
                                />
                                Event T-shirt
                            </h4>
                            <h4 className="type-filter-label">
                                <input 
                                    className="form-check-input prod-cart-checkBox" 
                                    type="checkbox" 
                                    value="5" 
                                    id="shopProdCheckbox"
                                    onClick={handleProductTypeClick}
                                />
                                ID Sling
                            </h4>
                            <h4 className="type-filter-label">
                                <input 
                                    className="form-check-input prod-cart-checkBox" 
                                    type="checkbox" 
                                    value="" 
                                    id="shopProdCheckbox"
                                />
                                Accessories
                            </h4>
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
                                        type="checkbox" 
                                        value="male" 
                                        id="shopProdCheckbox"
                                        defaultChecked={selectedGender === 'male'}
                                        onClick={(e) => handleGenderClick(e, 'male')}
                                    />
                                    Male
                                </h4>
                                <h4 className="gender-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="checkbox" 
                                        value="female" 
                                        id="shopProdCheckbox"
                                        defaultChecked={selectedGender === 'female'}
                                        onClick={(e) => handleGenderClick(e, 'female')}
                                    />
                                    Female
                                </h4>
                                <h4 className="gender-filter-label">
                                    <input 
                                        className="form-check-input prod-cart-checkBox" 
                                        type="checkbox" 
                                        value="unisex" 
                                        id="shopProdCheckbox"
                                        defaultChecked={selectedGender === 'unisex'}
                                        onClick={(e) => handleGenderClick(e, 'unisex')}
                                    />
                                    Unisex
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="shop-content2-container">
        {filteredProduct.map(product => (
            <div className="prodShop-card" data-bs-toggle="modal" data-bs-target="#viewProdDetailsModal" key={product.productId} onClick={() => setSelectedProduct(product)}> 
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
                                <h5 className="prodModal-text">
                                    <img className="prodModalRating-icon" src={ prodRatingModal }/>
                                    No Rating Yet
                                </h5>
                                <h5 className="prodModal-text">
                                    {getDepartmentName(selectedProduct.departmentId)}
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
}

export default Visit_Shop