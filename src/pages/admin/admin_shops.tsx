import './admin_shops.css'
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import starIcon from "../../assets/images/icons/starRating.png"
import prodRating from "../../assets/images/icons/star.png"
import shopImg from "../../assets/images/imageprofile.jpeg"
import prodImg from "../../assets/images/shop_products/college-uniform.jpg"
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
            <div className='admin-shop-card'
            data-bs-toggle="modal"
            data-bs-target="#viewProdsModal">
                <img className='shopProfileImgCard' src={ shopImg } />
                <div className='col-md-8 adminShop-card-details'>
                    <h5 className="supplier-card-title">Example Shop Name dasdsad  asdasd </h5>
                    <h5 className='shop-rating-card'><img className="ratingIcon" src={ starIcon }/>No Rating Yet</h5>
                    <h5 className='shop-rating-card'>example shop address</h5>
                </div>
            </div>
            

            {/* VIEW PRODUCTS MODAL */}
            <div className="modal fade" id="viewProdsModal" tabIndex={-1} aria-labelledby="viewProdsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen modal-dialog-scrollable">
                    <div className="modal-content" 
                        style={{ padding:'25px' }}>
                        <div className="viewProds-modalHeader">
                            <h1
                                style={{ color:'#020654' }}>Product List</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                        {/* <h4 className="type-filter-label">
                                            <input 
                                                className="form-check-input prod-cart-checkBox" 
                                                type="radio" 
                                                value="1" 
                                                name="productType"
                                                id="shopProdTypeAll"
                                                checked={selectedProductType === '1'}
                                                onChange={handleProductTypeChange}
                                            />
                                            <hr/> All
                                        </h4> */}
                                        <h4 className="type-filter-label">
                                            <input 
                                                className="form-check-input prod-cart-checkBox" 
                                                type="radio" 
                                                value="1" 
                                                name="productType"
                                                id="shopProdTypeSchoolUniform"
                                                // checked={selectedProductType === '1'}
                                                // onClick={handleProductTypeClick}
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
                                                // checked={selectedProductType === '2'}
                                                // onClick={handleProductTypeClick}
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
                                                // checked={selectedProductType === '3'}
                                                // onClick={handleProductTypeClick}
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
                                                // checked={selectedProductType === '4'}
                                                // onClick={handleProductTypeClick}
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
                                                // checked={selectedProductType === '5'}
                                                // onClick={handleProductTypeClick}
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
                                                // checked={selectedProductType === '6'}
                                                // onClick={handleProductTypeClick}
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
                                                    // checked={selectedPriceRange === '<100'}
                                                    // onClick={(e) => handlePriceRangeClick(e, '<100')}
                                                />
                                                <hr/> Below ₱100
                                            </h4>
                                            <h4 className="price-filter-label">
                                                <input 
                                                    className="form-check-input prod-cart-checkBox" 
                                                    type="radio" 
                                                    value="100-500"
                                                    // checked={selectedPriceRange === '100-500'}
                                                    // onClick={(e) => handlePriceRangeClick(e, '100-500')}
                                                />
                                                <hr/> ₱100 - ₱500
                                            </h4>
                                            <h4 className="price-filter-label">
                                                <input 
                                                    className="form-check-input prod-cart-checkBox" 
                                                    type="radio" 
                                                    value=">500"
                                                    // checked={selectedPriceRange === '>500'}
                                                    // onClick={(e) => handlePriceRangeClick(e, '>500')}
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
                                                    // defaultChecked={selectedGender === 'male'}
                                                    // onClick={(e) => handleGenderClick(e, 'male')}
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
                                                    // defaultChecked={selectedGender === 'female'}
                                                    // onClick={(e) => handleGenderClick(e, 'female')}
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
                                                    // defaultChecked={selectedGender === 'unisex'}
                                                    // onClick={(e) => handleGenderClick(e, 'unisex')}
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
                                <div className='col-md-12' style={{ backgroundColor:'#004AAD', padding:'10px', borderRadius:'5px' }}>
                                    <div className='admin-viewProds-card'>
                                        <img className='admin-viewProd-img' src={prodImg}/>
                                        <h4 className='col-md-4 admin-prodName' style={{ display:'flex', flexFlow:'column' }}>Example Product Name
                                            <span className='admin-prodRating' style={{ color:'white', marginTop:'8px', display:'flex', alignItems:'center' }}>
                                                <img style={{ marginRight:'5px', width:'100%', maxWidth:'12px' }} src={ prodRating } alt="product rating icon" />
                                                No rating yet</span>
                                        </h4>
                                        <h4 className='col-md-3 admin-prodStocks'>Total Stocks:
                                            <span className='totalStocks-adminProd'>5534</span>
                                        </h4>
                                        <h4 className='col-md-3 admin-prodPrice'>Price:
                                            <span className='price-adminProd'>123435</span>
                                        </h4>
                                    </div>
                                    
                                            {/* SHOW MORE BUTTON */}
                                    <button className="admin-prodShowDetails-btn" type="button" data-bs-toggle="collapse" data-bs-target="#prodDetailsCollapse" aria-expanded="false" aria-controls="prodDetailsCollapse">
                                        Show More
                                    </button>


                                    <div className="collapse" id="prodDetailsCollapse" 
                                    style={{ marginRight:'18px' }}>
                                        {/* START OF CARD BODY */}
                                        <div className="card card-body" 
                                        style={{ display:'flex', justifyContent:'space-between', gap:'10px' }}>

                                                {/* PRODUCT ID */}
                                                <h4 className='admin-prodDetails-labels' 
                                                style={{ display:'flex', flexFlow:'row', gap:'10px', fontWeight:'600'}}>Product ID: 
                                                     <h4 className='admin-prodDetails-text'>12432423</h4>
                                                </h4>

                                                {/* DESCRIPTION */}
                                                <h5 className='admin-prodDetails-labels' style={{ display:'flex', flexWrap:'wrap' }}>Description:
                                                    <span className='col-md-10 admin-prodDetails-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                                                </h5>

                                                {/* DEPARTMENT */}
                                                <h5 className='admin-prodDetails-labels'>Department:
                                                     <h5 className='admin-prodDetails-text'>College of Computer Studies</h5>
                                                </h5>

                                                {/* TYPE */}
                                                <h5 className='admin-prodDetails-labels'>Type:
                                                    <h5 className='admin-prodDetails-text'>School Uniform</h5>
                                                </h5>

                                                {/* SIZES AVAILABLE */}
                                                <h5 className='admin-prodDetails-labels'>Sizes Available:
                                                    <h5 className='admin-prodDetails-text'>18, 20, XS, S, M, L, XL, 2XL</h5>
                                                </h5>
                                        </div>
                                        {/* END OF CARD BODY */}
                                    </div>
                                </div>
                                {/* END OF PRODUCT CARD */}
                                
                            </div>
                            {/* END OF PRODUCTS CONTAINER */}

                        </div>
                    </div>
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