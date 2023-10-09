import './supplier_items.css'
import { Link, useParams  } from "react-router-dom"
import logo from '../../assets/images/unitee.png'
import sprofile from '../../assets/images/s-icon.png'
import logoutSupplier from "../../assets/images/icons/logoutSupplier.png"
import items from "../../assets/images/icons/items.png"
import orders from "../../assets/images/icons/orders.png"
import reports from "../../assets/images/icons/reports.png"
import featured_item from '../../assets/images/main/home_1.png'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function Supplier (){

    interface ProductType {
        productTypeId: number;
        product_Type: string;
    }

    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [productTypeId, setSelectedProductType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const { id } = useParams();

    const maleRef = useRef(null);
    const femaleRef = useRef(null);
    const unisexRef = useRef(null);

    //Read All Departments
    useEffect(() => {
        axios.get('https://localhost:7017/Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

    // Get Department Names
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

    //Read All Product Types
    useEffect(() => {
        axios.get('https://localhost:7017/ProductType')
            .then(res => {
                setProductTypes(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

    // Get Product Type Name
    const getProductTypeName = (productTypeId) => {
        const productType = productTypes.find(p => p.productTypeId === productTypeId);
        return productType ? productType.product_Type : 'Unknown Type';
    };

    // Filtered Products Details
    const filteredProduct = products.filter(product =>
        (productTypeId === '' || product.productTypeId.toString() === productTypeId) &&
        (
            selectedGender === '' ||
            selectedGender === 'unisex' ||
            product.category.toLowerCase() === selectedGender
        ) &&
        (
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.stocks.toString().includes(searchTerm) ||
            product.price.toString().includes(searchTerm)
        )
    );

    // toggle the radio buttons for gender
    const handleGenderClick = (e, gender) => {
        if (selectedGender === gender) {
            setSelectedGender('');
            e.target.checked = false;
        } else {
            setSelectedGender(gender);
        }
    };

    // Read Product By Supplier ID
    useEffect(() => {
        axios.get(`https://localhost:7017/Product/bysupplier/${id}`)
            .then(res => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    // Compute all stocks
    const totalStock = (sizes) => {
        if (!sizes || sizes.length === 0) {
            return 0;
        }
        return sizes.reduce((acc, currentSize) => acc + currentSize.quantity, 0);
    }
    

    return (
        <div className="supplier-container row">
            <header className="supplier-header row">
                <Link to='' className="col-md-3">
                    <img className="logo" src={ logo } style={{height:'60px', marginLeft:'50px'}}/>
                </Link>
                <p className='col'>ITEMS</p>
                <Link to='' className="col-md-1">
                    <img className="sprofile" src={ sprofile } style={{height:'40px'}}/>
                </Link>
            </header>

        <div className="items-container">
            <div className="menu-button-container">
                    <Link to='' className="menu-link">
                        <img className="iconSupplier" src={ items }/>
                            <span className="menu-text">
                                Items
                            </span>
                        </Link>
                    <Link to={`/supplier_orders/${id}`} className="menu-link">
                        <img className="iconSupplier" src={ orders }/>
                            <span className="menu-text">
                                Orders
                            </span>
                        </Link>
                    <Link to='*' className="menu-link">
                        <img className="iconSupplier" src={ reports }/>
                            <span className="menu-text">
                                Reports
                            </span>
                        </Link>
                    <Link to='/' className="menu-link">
                        <img className="iconSupplier" src={ logoutSupplier }/>
                            <span className="menu-text">
                                Logout
                            </span>
                        </Link>
                </div>
                
                <div className="col-md-7">
                <span className="featured-title">Featured Item</span>
                    <div>                                   
                    <img src={ featured_item } className="featured-img"/>      
                </div>
                <div className="col-md-7 upload-featured-item">
                <button type="button" className="btn btn-outline-warning" style={{ fontSize:'20px' }}>Upload Image</button>                    
                    </div>
                    </div>
            </div>
            

            <div className='container shop-contianer'>
                <div className='col content-container'>
                <div className='row g-3' style={{ justifyContent: 'center' }}>
                    <p className='items-title' style={{ marginTop:'100px', fontWeight:'400' }}>AVAILABLE ITEMS</p>           
                    <h4 className='col-md-2' style={{ paddingLeft:'180px', paddingTop:'10px'}}>Sort by:</h4>
                    <div className='col-md-2'>
                    <select
                        onChange={(e) => setSelectedProductType(e.target.value)}
                        value={productTypeId}
                        className="form-select select"
                        style={{ backgroundColor: '#00215E', color: 'white' }}
                    >
                        <option value="" disabled>
                            Select Product Type
                        </option>
                        <option value="" style={{color: 'white'}}>All</option>
                        {productTypes.map((product_types, index) => (
                            <option key={index} value={product_types.productTypeId} style={{color: 'white'}}>
                                {product_types.product_Type}
                            </option>
                        ))}
                    </select>
                    </div>
                    
                    <div className='col-md-4 gender-filter-container' style={{alignItems:'center', display:'flex'}}>
                    <h3 style={{ paddingRight:'10px' }}>Gender:</h3>
                        <div className="form-check-shop" style={{ paddingRight:'10px' }}>
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                name="gender" 
                                ref={maleRef} 
                                id="male" 
                                value="male" 
                                defaultChecked={selectedGender === 'male'} 
                                onClick={(e) => handleGenderClick(e, 'male')} 
                            />
                            <label className="form-check-label">
                                Male
                            </label>
                        </div>

                        <div className="form-check-shop" style={{ paddingRight:'10px' }}>
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                name="gender" 
                                ref={femaleRef} 
                                id="female" 
                                value="female" 
                                defaultChecked={selectedGender === 'female'} 
                                onClick={(e) => handleGenderClick(e, 'female')} 
                            />
                            <label className="form-check-label">
                                Female
                            </label>
                        </div>               
                        <div className="form-check-shop">
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                name="gender" 
                                ref={unisexRef} 
                                id="unisex" 
                                value="unisex" 
                                defaultChecked={selectedGender === 'unisex'} 
                                onClick={(e) => handleGenderClick(e, 'unisex')} 
                            />
                            <label className="form-check-label">
                                Unisex
                            </label>
                        </div>
                        </div>
                        
                        <div className='col-md-12' style={{ marginTop:'50px',justifyContent:'center',display:'flex',alignItems:'center'}}>
                            <div>
                            <Link to={`/add_item/${id}`}>
                                <button className="add-item-btn" style={{backgroundColor: 'green'}}>Add Item</button>
                            </Link>
                            </div>
                            <div className='col-md-3'>
                                <input
                                    className="form-control input"
                                    placeholder="Search by product name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>          
                        </div>

                        {filteredProduct.map((product) => (
                            <Link key={product.productId} to={`/update_item/${id}/${product.productId}`} style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                            <div className="card mb-3" style={{maxWidth: '900px',backgroundColor:'transparent', borderStyle:'none', marginTop:'30px'}}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                <img src={`https://localhost:7017/${product.image}`} className="img-fluid rounded-start" alt="..."/>
                                </div>
                                <div className="col-md-8">
                                <div className="card-body">
                                    <span className="card-title-supplier">{product.productName}</span>
                                    <p className="size-available" style={{ color: 'black', fontSize: '20px' }}>Sizes available: 
                                        {product.sizes && product.sizes.map((size, index) => (
                                            <span key={index}> | {size.size}-{size.quantity}</span> 
                                        ))}
                                    </p>
                                    <p className="prod-gender" style={{ color: 'black' }}>Gender: {product.category}</p>
                                    <p className="prod-department" style={{ color: 'black' }}>Department: {getDepartmentName(product.departmentId)}</p>
                                    <p className="prod-type" style={{ color: 'black' }}>Product type: {getProductTypeName(product.productTypeId)}</p>
                                    <p className="prod-stock" style={{ color: 'black' }}>Stocks available: {totalStock(product.sizes)}</p>
                                    <span></span>
                                    <p className="prod-price" style={{ color: 'black' }}>Price: {product.price}</p>
                                </div>
                                </div>
                            </div>
                            </div>
                            </Link>
                        ))}
                        
                    </div> 
                </div>
            </div>
        </div>

    )
}

export default Supplier