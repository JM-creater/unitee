import { Link, useParams, useNavigate } from 'react-router-dom'
import product from "../../assets/images/shop_products/product.png"
import logo from "../../assets/images/unitee.png"
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Update_item(){

    interface Department {
        departmentId: number;
        department_Name: string;
    }

    interface ProductType {
        productTypeId: number;
        product_Type: string;
    }

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [productTypeId, setSelectedProductType] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentId, setSelectedDepartment] = useState('');
    const [sizesData, setSizesData] = useState({});
    const [, setInitialSizes] = useState({});
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [productIsActive, setProductIsActive] = useState('');
    const { id, productId } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    

    //Read All Departments
    useEffect(() => {
        axios.get('https://localhost:7017/Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

    //Read All Product Types
    useEffect(() => {
        axios.get('https://localhost:7017/ProductType')
            .then(res => {
                setProductTypes(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

    // Get
    useEffect(() => {
        axios.get(`https://localhost:7017/SizeQuantity/${productId}/sizes`)
            .then(response => {
                const initialData = {};
                const fetchedSizes: string[] = [];
                response.data.forEach(item => {
                    initialData[item.size] = item.quantity;
                    fetchedSizes.push(item.size);
                });
                setSizesData(initialData);
                setInitialSizes(initialData);
                setSelectedSizes(fetchedSizes); 
            });
    }, [productId]);
    

    // Category Change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductCategory(e.target.value);
    };

    // Upload Image
    const handleImageClick = () => {
        if (inputRef.current) {
        inputRef.current.click();
        }
    };

    // Change Image
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedImage(event.target.files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                document.getElementById('productImage')!.setAttribute('src', e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
            }
        };

        // Get Product By Id
        useEffect(() => {
            axios.get(`https://localhost:7017/Product/byid/${productId}`)
            .then(res => {
                const product = res.data;
                const newSizesData = product.sizes.reduce((acc, size) => {
                    acc[size.size] = size.quantity;
                    return acc;
                }, {});
                setProductName(product.productName);
                setSelectedDepartment(product.departmentId);
                setProductDescription(product.description);
                setProductPrice(product.price);
                setSelectedProductType(product.productTypeId);
                setProductCategory(product.category);
                setSelectedImage(product.image);
                setSizesData(newSizesData);

                if (product.isActive === true) {
                    const button = document.getElementById('btn_Deactivate');
                        button.textContent='Deactivate';
                        button.style.color = 'white';
                        button.style.backgroundColor = 'red';
                        button.style.borderColor = 'red';
                        setProductIsActive('false');
                } else if (product.isActive === false) {
                    const button = document.getElementById('btn_Deactivate');
                        button.textContent='Activate';
                        button.style.color = 'white';
                        button.style.backgroundColor = 'green';
                        button.style.borderColor = 'green';
                        setProductIsActive('true');
                }
            });
        }, [productId]);

        // Update Product
        const handleUpdateItem = () => {
            const formData = new FormData();
            formData.append('ProductTypeId', productTypeId);
            formData.append('DepartmentId', departmentId);
            formData.append('ProductName', productName);
            formData.append('Description', productDescription);
            formData.append('Category', productCategory);
            formData.append('Price', productPrice);
            formData.append('Image', selectedImage as File);

            axios.put(`https://localhost:7017/Product/${productId}`, formData, {
                headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((result) => {
                if (result.status !== 200) {
                    throw new Error(result.data.message);
                }
                    toast.success('Successfully Updated An Item');
                    navigate(`/supplier_items/${id}`);
                })
                .catch((error) => {
                    toast.error(error.message || 'Network error or server not responding');
                });
            };
            
        // Deactivate/Activate Product
        const handleDeactivateActivate = () => {
            const isActive = productIsActive === 'true';
            const url = `https://localhost:7017/Product/activate/${productId}`;
            
            axios.put(url, isActive, { headers: { 'Content-Type': 'application/json' }})
                .then((result) => {
                    if (result.status >= 200 && result.status < 300) {
                        console.log("Success");
                        alert('Success');
                        navigate(`/supplier_items/${id}`);
                    } else {
                        console.error(result.data.message);
                        console.error("Error");
                    }
                })
                .catch((error) => {
                    console.error('Network error or server not responding', error);
                });
        };
        

        return <div className="container add_item_container">
            <header style={{ marginTop:'30px', display:'flex', alignItems:'center', gap:'45em' }}>
            <Link to={`/supplier_items/${id}`} style={{ textDecoration:'none' }}>
                    <span className="back_btn">Back</span>
                </Link>

                <img className="logo" src={ logo }/>
            </header>
            <div style={{ display:'flex', justifyContent:'center', marginTop:'50px', gap:'30px'}}>
                <div>
                <input
                    ref={inputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <img
                    id="productImage"
                    src={selectedImage ? `https://localhost:7017/${selectedImage}` : product}
                    alt="Upload Product"
                    style={{ width: "350px", cursor: "pointer" }}
                    onClick={handleImageClick}
                />
                </div>
            <div className="col-md-4 item_deatils_container">           
            <div className="col-md-12 price-container">
                    <p className="col-md-3 item-price">Product Name:</p>
                    <input 
                        className="form-control input" 
                        style={{ width:'28em' }} 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)} required/>
                </div>
                <div className="input-group-description">
                    <textarea 
                        className="form-control" 
                        aria-label="Product description" 
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)} required/>
                </div>

                <div className='col-md-9 department-select' style={{ display:'flex', gap:'20px' }}>
                    <p className="department-item">Department:</p>
                <select 
                    onChange={(e) => setSelectedDepartment(e.target.value)} 
                    value={departmentId} 
                    className="form-select select" 
                    style={{ color:'black' }} 
                    required>
                    <option value="">Select Department</option>
                        {departments.map((department, index) => (
                            <option key={index} value={department.departmentId}>
                                {department.department_Name}
                            </option>
                        ))}    
                </select>
                </div>
                            
                <div className="col-md-12 price-container">
                    <p className="col-md-3 item-price">Enter price:</p>
                    <input 
                        className="form-control input" 
                        style={{ width:'28em' }} 
                        onChange={(e) => setProductPrice(e.target.value)} 
                        value={productPrice}
                        required/>
                </div>

                <div className="size-container">
                    <p className="available-sizes">Sizes Available:</p>
                    <div className="item-sizes-container" style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px', color: 'white' }}>
                    {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((sizeLabel) => {
                            const isChecked = selectedSizes.includes(sizeLabel);
                            const quantity = sizesData[sizeLabel] || 0;

                            return (
                                <div className="form-check-shop" key={sizeLabel} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="flexRadioDefault"
                                        id={`flexRadioDefault${sizeLabel}`}
                                        value={sizeLabel}
                                        checked={isChecked}
                                        onChange={async (e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setSelectedSizes(prev => [...prev, sizeLabel]);
                                                // Send a create request to the backend with size and quantity
                                                await axios.post(`https://localhost:7017/SizeQuantity/${productId}`, { 
                                                    size: sizeLabel, 
                                                    quantity: sizesData[sizeLabel] || 0 
                                                });
                                            } else {
                                                setSelectedSizes(prev => prev.filter(size => size !== sizeLabel));
                                                // Send a delete request to the backend
                                                await axios.delete(`https://localhost:7017/SizeQuantity/${productId}/${sizeLabel}`);
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" style={{ marginLeft: '10px', marginRight: '10px' }}>{sizeLabel}</label>
                                    <input
                                        type="number"
                                        className="quantity-input"
                                        value={quantity}
                                        disabled={!isChecked}
                                        onChange={async (e) => {
                                            const newQuantity = parseInt(e.target.value, 10);
                                            setSizesData(prevSizes => ({
                                                ...prevSizes,
                                                [sizeLabel]: newQuantity
                                            }));
                                            // Send an update request to the backend with the new quantity
                                            await axios.put(`https://localhost:7017/SizeQuantity/UpdateSizes/${productId}/${sizeLabel}`, { 
                                                size: sizeLabel, 
                                                quantity: newQuantity
                                            });
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    
                    <div className='item-gender-container'>
                    <h4>Gender:</h4>
                        <div className='genders'>
                            <div className="form-check-shop">
                                <input
                                    className='form-check-input'
                                    type='radio'
                                    name='flexRadioDefault'
                                    id='flexRadioDefault1'
                                    value='Male'
                                    onChange={handleCategoryChange}
                                    checked={productCategory === 'Male'} 
                                />
                                <label className="form-check-label">
                                    Male
                                </label>
                            </div>

                            <div className="form-check-shop">
                                <input
                                    className='form-check-input'
                                    type='radio'
                                    name='flexRadioDefault'
                                    id='flexRadioDefault2'
                                    value='Female'
                                    onChange={handleCategoryChange}
                                    checked={productCategory === 'Female'}
                                />
                                <label className="form-check-label">
                                    Female
                                </label>
                            </div>               

                            <div className="form-check-shop">
                                <input
                                    className='form-check-input'
                                    type='radio'
                                    name='flexRadioDefault'
                                    id='flexRadioDefault3'
                                    value='Unisex'
                                    onChange={handleCategoryChange}
                                    checked={productCategory === 'Unisex'}
                                />
                                <label className="form-check-label">
                                    Unisex
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-md-12 category-select'>
                    <p className="category-item">Type:</p>
                <select 
                    onChange={(e) => setSelectedProductType(e.target.value)} 
                    value={productTypeId} 
                    className="form-select select" 
                    style={{ color:'black' }} 
                    required>
                <option value="">Select Product Type</option>
                    {productTypes.map((product_types, index) => (
                        <option key={index} value={product_types.productTypeId}>
                            {product_types.product_Type}
                        </option>
                    ))}
                </select>
                </div>

                <div className="item-btns-container">
                <button type="button" className="btn btn-lg btn-warning" onClick={handleUpdateItem}>Update Item</button>
                <button type="button" className="btn btn-lg btn-danger" id='btn_Deactivate' onClick={handleDeactivateActivate}></button>
                </div>

            </div>
        </div>
    </div>
}

export default Update_item