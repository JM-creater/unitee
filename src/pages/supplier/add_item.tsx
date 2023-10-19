import './add_item.css'
import product from "../../assets/images/shop_products/product.png"
import { Link } from 'react-router-dom'
import logo from "../../assets/images/unitee.png"
import axios from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function Add_item(){

    interface Department {
        departmentId: number;
        department_Name: string;
    }

    interface ProductType {
        productTypeId: number;
        product_Type: string;
    }

    interface SizeQuantity {
        size: string;
        quantity: string;
    }


    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [productTypeId, setSelectedProductType] = useState('');
    const [sizes, setSizes] = useState<SizeQuantity[]>([])
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentId, setSelectedDepartment] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { id } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleCategoryChange = (e) => {
        const newValue = e.target.value;
        if (productCategory === newValue) {
            setProductCategory('');
            e.target.checked = false; 
        } else {
            setProductCategory(newValue);
        }
    };

        const handleImageClick = () => {
            if (inputRef.current) {
                inputRef.current.click();
            }
        };

        //Upload Image
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

        const addNewSizeInput = () => {
            setSizes([...sizes, { size: '', quantity: ''}])
        };

    // Add Item
    const handleAddItem = () => {
        const selectedSizes = sizes.filter(({ size }) => size);
    
        const formData = new FormData();
        formData.append('ProductTypeId', productTypeId);
        formData.append('DepartmentId', departmentId);
        formData.append('ProductName', productName);
        formData.append('Description', productDescription);
        formData.append('Category', productCategory);
        formData.append('Price', productPrice);
        formData.append('Image', selectedImage as File);
        formData.append('SupplierId', id);
    
        axios.post('https://localhost:7017/Product/addproduct', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(async (productResponse) => {
            if (productResponse.status === 200) {
                toast.success('Successfully Added An Item');
                navigate(`/supplier_items/${id}`);
    
                const sizeApiCalls = selectedSizes.map(({ size, quantity }) => {
                    const sizeFormData = new FormData();
                    sizeFormData.append('size', size);
                    sizeFormData.append('productId', productResponse.data);
                    sizeFormData.append('quantity', quantity);
    
                    return axios.post('https://localhost:7017/SizeQuantity/createsizequantity', sizeFormData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                });
    
                try {
                    await Promise.all(sizeApiCalls);
                } catch (error) {
                    console.log(productResponse.data)
                    toast.warning('Network error or server not responding while adding sizes');
                }
            } else {
                toast.error(productResponse.data.message);
            }
        })
        .catch(() => {
            toast.error('Network error or server not responding');
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
                src={selectedImage ? URL.createObjectURL(selectedImage) : product}
                alt="Upload Product"
                style={{ width: "350px", cursor: "pointer" }}
                onClick={handleImageClick}
            />
            </div>
        <div className="col-md-3 item_deatils_container">           

            <div className="mb-3">
                <label className="productName-label">Product Name</label>
                <input 
                    type="email" 
                    className="form-control" 
                    id="productName" 
                    placeholder="Product Name" 
                    onChange={(e) => setProductName(e.target.value)} 
                    required
                />
            </div>

            <div className="mb-3">
                <label className="prodDescription-label">Description</label>
                <textarea 
                    className="form-control" 
                    aria-label="Product description" 
                    placeholder="Enter product description" 
                    onChange={(e) => setProductDescription(e.target.value)} 
                />
            </div>


            <div className='col-md-9 department-select' style={{ display:'flex', gap:'20px' }}>
                <p className="department-item">Department:</p>
                <select 
                    onChange={(e) => setSelectedDepartment(e.target.value)} 
                    value={departmentId} 
                    className="form-select select" 
                    style={{ width: '220px' }} 
                    required
                >
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
                    className="form-control" 
                    type='number' 
                    style={{ width:'28em' }} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                    required
                />
            </div>

            <div className="size-container">
                <p className="available-sizes">Sizes Available:</p>
                <div className="item-sizes-container" style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                {sizes.map((sizeObj, index) => (
                    <div className="form-check-shop" key={index}>
                        <input
                            className="form-control"
                            type="text"
                            id="sizeCheck1"
                            value={sizeObj.size}
                            placeholder="Enter size (e.g., S, M, L...)"
                            onChange={(e) => {
                                const newSize = e.target.value;
                                setSizes(sizes.map((s, i) => i === index ? { ...s, size: newSize } : s));
                            }}
                        />
                        <input 
                            className="form-control" 
                            type="number" 
                            name="prodSize" 
                            id="prodSize" 
                            value={sizeObj.quantity}
                            placeholder="Enter quantity"
                            onChange={(e) => {
                                const newQuantity = e.target.value;
                                setSizes(sizes.map((s, i) => i === index ? { ...s, quantity: newQuantity } : s));
                            }}
                        />
                    </div>
                ))}
                <button onClick={addNewSizeInput}>Add Another Size</button>
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
                                onClick={handleCategoryChange}
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
                                onClick={handleCategoryChange}
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
                                onClick={handleCategoryChange}
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
                onChange={(e) => setSelectedProductType (e.target.value)} 
                value={productTypeId} 
                className="form-select select" 
                style={{ color: 'black' }}
            >
            <option value="">Select Product Type</option>
                {productTypes.map((product_types, index) => (
                    <option key={index} value={product_types.productTypeId} style={{color: 'black'}}>
                        {product_types.product_Type}
                    </option>
                ))}
            </select>
            </div>

            <div className="item-btns-container">
            <button 
                type="button" 
                className="btn btn-lg btn-success" 
                onClick={handleAddItem}
            >
                Add Item
            </button>
            <button 
                type="button" 
                className="btn btn-lg btn-danger" 
                onClick={() => navigate(`/supplier_items/${id}`)}
            >
                Cancel
            </button>
            </div>

        </div>
    </div>

        

    </div>
}

export default Add_item