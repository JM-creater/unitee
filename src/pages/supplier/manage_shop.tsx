import prodImage from "../../assets/images/shop_products/product2.png"
import addIcon from "../../assets/images/icons/plus-4.png"
import "./manage_shop.css"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Manage_Shop () {

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

    const [products, setProducts] = useState([]);
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

    const getProductTypeName = (productTypeId) => {
        const productType = productTypes.find(p => p.productTypeId === productTypeId);
        return productType ? productType.product_Type : 'Unknown Type';
    }

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

    useEffect(() => {
        axios.get(`https://localhost:7017/Product/bysupplier/${id}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [id]);

    const totalStock = (sizes) => {
        if (!sizes || sizes.length === 0) {
            return 0;
        }
        return sizes.reduce((acc, currentSize) => acc + currentSize.quantity, 0);
    };

    return <div className="manage-shop-main-container">

        <div className="add-prod-btn-container">
            <h1>Manage Shop</h1>
            <button 
                className="supplier-add-prod-btn" 
                data-bs-toggle="modal" 
                data-bs-target="#addProductModal"
            >
                <img className="addbtnIcon" src={ addIcon } alt="" />
                Add New Product
            </button>
        </div>

        {/* PRODUCTS */}
       
            <div className="col-md-12 supplier-prods-container">
            {products.map((productItem, index) => (
                <div key={index} className="prod-card" data-bs-toggle="modal" data-bs-target="#editProductModal">
                    <div className="prod-shop-image-container">
                        <img className="supplier-shop-prod-image" src={ `https://localhost:7017/${productItem.image}` }/>
                    </div>
                    <div className="col-md-11 prod-shop-details">
                        <span className="col-md-3 supplier-prod-details">{productItem.productName}</span>
                        <span className="col-md-2 supplier-prod-details">{getProductTypeName(productItem.productTypeId)}</span>
                        <span className="col-md-1 supplier-prod-details">{productItem.category}</span>
                        <span className="col-md-1 supplier-prod-details">{totalStock(productItem.sizes)}</span>
                        <span className="col-md-1 supplier-prod-details">{productItem.isActive ? 'Active' : 'Inactive'}</span>
                        <h4 className="col-md-2 supplier-prod-price">₱{productItem.price}</h4>
                    </div>
                </div>
                ))}
            </div>
        
        

        {/* ADD NEW PRODUCT - MODAL  */}
        <div className="modal fade" id="addProductModal" tabIndex={-1} aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content" style={{ padding:'15px', height:'100vh' }}>
            <div className="prod-header">
                <h1 className="modal-title" id="exampleModalLabel">Add New Product</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-basta-container">
                <span>You can add new products to your shop here</span>
                <div className="modal-btns-container">
                    <button type="button" className="cancel-btn-modal" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="save-prod-btn" onClick={handleAddItem}>Save</button>
                </div>
            </div>
            <div className="modal-body" style={{ display:'flex', flexFlow:'row' }}>
                <div>
                <div className="thumbnail-container">
                    <h3 className="prod-info-titles">Thumbnail</h3>
                    <img
                        id="productImage"
                        alt="Upload Product"
                        className="supplier-modal-addprod-img" 
                        src={selectedImage ? URL.createObjectURL(selectedImage) : prodImage}
                        onClick={handleImageClick}
                    />
                    <input
                        ref={inputRef}
                        type="file" 
                        name="prodImage" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>

                {/* status */}
                <div className="supplier-prod-status">
                    <h3 className="prod-info-titles">Status</h3>
                    <select name="prodStatus" id="prodStatus" style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'10rem', marginTop:'5px' }}>
                        <option value="0" selected>Set Status</option>
                        <option value="1">Activate</option>
                        <option value="2">Deactivate</option>
                    </select>
                </div>
                </div>

                <div className="col-md supplier-prod-details-modal">
                    <h3 className="prod-details-titles">Product Details</h3>
                    <label className="prod-details-labels" htmlFor="prodName">Product Name</label>
                    <input className="modal-input-box" type="text" name="prodName" id="prodName" onChange={(e) => setProductName(e.target.value)} />
                    <label className="prodDescription-label">Description</label>
                    <textarea 
                        className="form-control" 
                        aria-label="Product description" 
                        placeholder="Enter product description" 
                        onChange={(e) => setProductDescription(e.target.value)} 
                    />

                    <label className="prod-details-labels">Department</label>
                    {/* DEPARTMENT CHECKBOX */}
                    <div className="suppliers-department-checkbox">
                        <select 
                            name="prodGender" 
                            id="prodGender" 
                            style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'12rem' }}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option defaultChecked>Select a Department</option>
                            {departments.map((department, index) => (
                                <option key={index} value={department.departmentId}>
                                    {department.department_Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* GENDER OPTIONS */}
                    <label className="prod-details-labels">Gender</label>
                    <div className="department-option">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            value="Male" 
                            id="departmentCheck1"
                            defaultChecked={productCategory === 'Male'}
                            onChange={(e) => setProductCategory(e.target.value)}
                        />
                        <label 
                            className="departmentCheckLabel" 
                            htmlFor="departmentCheck1"
                        >
                            Male
                        </label>
                    </div>
                    <div className="department-option">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            value="Female" 
                            id="departmentCheck2"
                            defaultChecked={productCategory === 'Female'}
                            onChange={(e) => setProductCategory(e.target.value)}
                        />
                        <label 
                            className="departmentCheckLabel" 
                            htmlFor="departmentCheck2"
                        >
                            Female
                        </label>
                    </div>
                    <div className="department-option">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            value="Unisex" 
                            id="departmentCheck3"
                            defaultChecked={productCategory === 'Unisex'}
                            onChange={(e) => setProductCategory(e.target.value)}
                        />
                        <label 
                            className="departmentCheckLabel" 
                            htmlFor="departmentCheck3"
                        >
                            Unisex
                        </label>
                    </div>

                    <label className="prod-details-labels">Product Type</label>
                    <select 
                        name="prodGender" 
                        id="prodGender" 
                        style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'12rem' }}
                        onChange={(e) => setSelectedProductType(e.target.value)}
                    >
                        <option value="0" selected>Select Type of Product</option>
                        {productTypes.map((productType, index) => (
                            <option key={index} value={productType.productTypeId}>
                                {productType.product_Type}
                            </option>
                        ))}
                    </select>

                    {/* SIZES AVAILABLE CHECKBOX */}
                    <label className="prod-details-labels">Sizes Available</label>
                    <div className="suppliers-sizes-avail-checkbox">
                        {sizes.map((sizeObj, index) => (
                            <div className="sizes-option" key={index}>
                                <input 
                                    className="form-control" 
                                    type="text" 
                                    value={sizeObj.size}
                                    id="sizeCheck1"
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
                                    placeholder="Enter quantity"
                                    onChange={(e) => {
                                        const newQuantity = e.target.value;
                                        setSizes(sizes.map((s, i) => i === index ? { ...s, quantity: newQuantity } : s));
                                    }}
                                />
                            </div>
                        ))}
                        <button className="addSizeBtn" onClick={addNewSizeInput}>Add Another Size</button>
                    </div>

                    <label className="prod-details-labels">Price</label>
                    <input className="modal-input-box" type="text" name="prodPrice" id="prodPrice" onChange={(e) => setProductPrice(e.target.value)}/>
                </div>
                
            </div>    
            </div>
        </div>
        </div>

            {/* EDIT PRODUCT INFO MODAL */}
        <div className="modal fade" id="editProductModal" tabIndex={-1} aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content" style={{ padding:'15px', height:'100vh' }}>
            <div className="prod-header">
                <h1 className="modal-title" id="exampleModalLabel">Edit Product</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-basta-container">
                <span>You can edit product details here</span>
                <div className="modal-btns-container">
                    <button type="button" className="cancel-btn-modal" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="save-prod-btn">Save</button>
                </div>
            </div>
            <div className="modal-body" style={{ display:'flex', flexFlow:'row' }}>
                <div>
                    <div className="thumbnail-container">
                        <h3 className="prod-info-titles">Thumbnail</h3>
                        <img className="supplier-modal-addprod-img" src={prodImage}/>
                        <input type="file" name="prodImage" accept="image/*" />
                    </div>

                    {/* status */}
                    <div className="supplier-prod-status">
                        <h3 className="prod-info-titles">Status</h3>
                        <select name="prodStatus" id="prodStatus" style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'10rem', marginTop:'5px' }}>
                            <option value="0" selected>Set Status</option>
                            <option value="1">Activate</option>
                            <option value="2">Deactivate</option>
                        </select>
                    </div>
                </div>

                <div className="col-md supplier-prod-details-modal">
                    <h3 className="prod-details-titles">Product Details</h3>
                    <label className="prod-details-labels" htmlFor="prodName">Product Name</label>
                    <input className="modal-input-box" type="text" name="prodName" id="prodName" />

                    <label className="prod-details-labels">Department</label>
                    {/* DEPARTMENT CHECKBOX */}
                    <div className="suppliers-department-checkbox">
                    <div className="department-option">
                        <input className="form-check-input" type="checkbox" value="" id="departmentCheck1"/>
                            <label className="departmentCheckLabel" htmlFor="departmentCheck1">
                                College of Computer Studies
                            </label>
                    </div>
                        <div className="department-option">
                            <input className="form-check-input" type="checkbox" value="" id="departmentCheck2"/>
                            <label className="departmentCheckLabel" htmlFor="departmentCheck2">
                                College of Criminology
                            </label>
                        </div>
                        <div className="department-option">
                            <input className="form-check-input" type="checkbox" value="" id="departmentCheck3"/>
                            <label className="departmentCheckLabel" htmlFor="departmentCheck3">
                                College of Nursing
                            </label>
                        </div>
                    </div>

                    {/* GENDER OPTIONS */}
                    <label className="prod-details-labels">Gender</label>
                    <select name="prodGender" id="prodGender" style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'12rem' }}>
                        <option value="0" selected>Select a gender</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Unisex</option>
                    </select>

                    {/* SIZES AVAILABLE CHECKBOX */}
                    <label className="prod-details-labels">Sizes Available</label>
                    <div className="suppliers-sizes-avail-checkbox">
                    <div className="sizes-option">
                        <input className="form-check-input" type="checkbox" value="" id="sizeCheck1"/>
                            <label className="sizeCheckLabel" htmlFor="sizeCheck1">
                                Small
                            </label>
                            <input className="modal-size-input-box" type="text" name="prodSize" id="prodSize" />
                    </div>
                        <div className="sizes-option">
                            <input className="form-check-input" type="checkbox" value="" id="sizeCheck2"/>
                            <label className="sizeCheckLabel" htmlFor="sizeCheck2">
                                Medium
                            </label>
                            <input className="modal-size-input-box" type="text" name="prodSize" id="prodSize" />
                        </div>
                        <div className="sizes-option">
                            <input className="form-check-input" type="checkbox" value="" id="sizeCheck3"/>
                            <label className="sizeCheckLabel" htmlFor="sizeCheck3">
                                Large
                            </label>
                            <input className="modal-size-input-box" type="text" name="prodSize" id="prodSize" />
                        </div>
                    </div>
                    <label className="prod-details-labels">Price</label>
                    <input className="modal-input-box" type="text" name="prodPrice" id="prodPrice" />
                </div>
            </div>    
            </div>
        </div>
        </div>
    </div>
}

export default Manage_Shop