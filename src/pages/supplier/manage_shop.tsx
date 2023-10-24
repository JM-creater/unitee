import prodImage from "../../assets/images/shop_products/product2.png";
import addIcon from "../../assets/images/icons/plus-4.png";
import "./manage_shop.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Manage_Shop() {
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
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productTypeId, setSelectedProductType] = useState("");
  const [sizes, setSizes] = useState<SizeQuantity[]>([]);
  const [Newsizes, setNewSizes] = useState([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setSelectedDepartment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { id } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  
    const handleImageClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleCategoryChange = (e, gender) => {
        if (productCategory === gender) {
            setProductCategory('');
            e.target.checked = false; 
        } else {
            setProductCategory(gender);
        }
    };

  // Upload Image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productImage")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Read All Departments
  useEffect(() => {
    axios
      .get("https://localhost:7017/Department")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching departments");
      });
  }, []);

  // Read All Product Types
  useEffect(() => {
    axios
      .get("https://localhost:7017/ProductType")
      .then((res) => {
        setProductTypes(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching product types");
      });
  }, []);

  const getProductTypeName = (productTypeId) => {
    const productType = productTypes.find((p) => p.productTypeId === productTypeId);
    return productType ? productType.product_Type : "Unknown Type";
  };

  const addNewSizeInput = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const addNewSizeInput2 = () => {
    setNewSizes([...Newsizes, { size: "", quantity: "" }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  }

  // Edit Item
  const handleEdit = () => {
    console.log(selectedProduct)
    const selectedSizes = sizes.filter(({ size }) => size);

    const errorMessages = [];

    if (!productName) errorMessages.push("Product Name is required");
    if (!productDescription) errorMessages.push("Product Description is required");
    if (!productPrice || isNaN(Number(productPrice))) errorMessages.push("Valid Product Price is required");
    if (!productCategory) errorMessages.push("Product Category is required");
    if (!productTypeId) errorMessages.push("Product Type is required");
    if (!departmentId) errorMessages.push("Department is required");
    if (!selectedImage) errorMessages.push("Image is required");
    if (!isActive) errorMessages.push("Status is required");
    if (selectedSizes.length === 0) errorMessages.push("Sizes and Quantity is required");

    if (errorMessages.length > 0) {
      errorMessages.forEach(message => toast.error(message));
      return;
    }

    const formData = new FormData();
    formData.append("ProductTypeId", productTypeId);
    formData.append("DepartmentId", departmentId);
    formData.append("ProductName", productName);
    formData.append("Description", productDescription);
    formData.append("Category", productCategory);
    formData.append("Price", productPrice);
    formData.append("Image", selectedImage as File);
    formData.append("SupplierId", id);
    formData.append("isActive", isActive);

    axios
      .put(`https://localhost:7017/Product/${selectedProduct.productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (productResponse) => {
        if (productResponse.status === 200) {
          toast.success("Successfully Added An Item");

          const sizeApiCalls = selectedSizes.map(({ size, quantity }) => {
            const sizeFormData = new FormData();
            sizeFormData.append("size", size);
            sizeFormData.append("productId", productResponse.data);
            sizeFormData.append("quantity", quantity);
            window.location.reload();

            return axios.post(
              "https://localhost:7017/SizeQuantity/createsizequantity",
              sizeFormData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          });

          try {
            await Promise.all(sizeApiCalls);
          } catch (error) {
            console.log(productResponse.data);
            toast.warning("Network error or server not responding while adding sizes");
          }
        } else {
          toast.error(productResponse.data.message);
        }
      })
      .catch(() => {
        toast.error("Network error or server not responding");
      });
  };

  // Add Item
  const handleAddItem = () => {
    const selectedSizes = sizes.filter(({ size }) => size);

    const errorMessages = [];

    if (!productName) errorMessages.push("Product Name is required");
    if (!productDescription) errorMessages.push("Product Description is required");
    if (!productPrice || isNaN(Number(productPrice))) errorMessages.push("Valid Product Price is required");
    if (!productCategory) errorMessages.push("Product Category is required");
    if (!productTypeId) errorMessages.push("Product Type is required");
    if (!departmentId) errorMessages.push("Department is required");
    if (!selectedImage) errorMessages.push("Image is required");
    if (!isActive) errorMessages.push("Status is required");
    if (selectedSizes.length === 0) errorMessages.push("Sizes and Quantity is required");

    if (errorMessages.length > 0) {
      errorMessages.forEach(message => toast.error(message));
      return;
    }

    const formData = new FormData();
    formData.append("ProductTypeId", productTypeId);
    formData.append("DepartmentId", departmentId);
    formData.append("ProductName", productName);
    formData.append("Description", productDescription);
    formData.append("Category", productCategory);
    formData.append("Price", productPrice);
    formData.append("Image", selectedImage as File);
    formData.append("SupplierId", id);
    formData.append("isActive", isActive);

    axios
      .post("https://localhost:7017/Product/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (productResponse) => {
        if (productResponse.status === 200) {
          toast.success("Successfully Added An Item");

          const sizeApiCalls = selectedSizes.map(({ size, quantity }) => {
            const sizeFormData = new FormData();
            sizeFormData.append("size", size);
            sizeFormData.append("productId", productResponse.data);
            sizeFormData.append("quantity", quantity);
            window.location.reload();

            return axios.post(
              "https://localhost:7017/SizeQuantity/createsizequantity",
              sizeFormData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          });

          try {
            await Promise.all(sizeApiCalls);
          } catch (error) {
            console.log(productResponse.data);
            toast.warning("Network error or server not responding while adding sizes");
          }
        } else {
          toast.error(productResponse.data.message);
        }
      })
      .catch(() => {
        toast.error("Network error or server not responding");
      });
  };

  useEffect(() => {
    axios
      .get(`https://localhost:7017/Product/bysupplier/${id}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error fetching products");
      });
  }, [id]);

  const totalStock = (sizes) => {
    if (!sizes || sizes.length === 0) {
      return 0;
    }
    return sizes.reduce((acc, currentSize) => acc + Number(currentSize.quantity), 0);
  };

  return (
    <div className="manage-shop-main-container">
      <div className="add-prod-btn-container">
        <h1>Manage Shop</h1>
        <button
          className="supplier-add-prod-btn"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          <img className="addbtnIcon" src={addIcon} alt="" />
          Add New Product
        </button>
      </div>
      
        {/* PRODUCTS */}
        <div className="col-md-12 supplier-prods-container">
          {products.length > 0 ? (
              products.map((productItem, index) => (
                  <div key={index} className="prod-card" data-bs-toggle="modal" data-bs-target="#editProductModal" onClick={() => {setSelectedProduct(productItem); setNewSizes(productItem.sizes);}}>
                      <div className="prod-shop-image-container">
                          <img className="supplier-shop-prod-image" src={ productItem.image ? `https://localhost:7017/${productItem.image}` : prodImage }/>
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
              ))
          ) : (
              <div className="no-productsShop-message">
                  <i className="no-productsShop-icon fa fa-exclamation-circle"></i>
                  <p>No products available</p>
              </div>
          )}
        </div>

        
      {/* ADD NEW PRODUCT - MODAL  */}
      <div className="modal fade" id="addProductModal" tabIndex={-1} aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content" style={{ padding: "15px", height: "100vh" }}>
            <div className="prod-header">
              <h1 className="modal-title" id="exampleModalLabel">
                Add New Product
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => window.location.reload()}></button>
            </div>
            <div className="modal-basta-container">
              <span>You can add new products to your shop here</span>
              <div className="modal-btns-container">
                <button type="button" className="cancel-btn-modal" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="save-prod-btn" onClick={handleAddItem}>
                  Save
                </button>
              </div>
            </div>
            <div className="modal-body" style={{ display: "flex", flexFlow: "row" }}>
              <div>
              <div className="thumbnail-container">
                <h3 className="prod-info-titles">Product Image</h3>
                <img
                    id="productImage"
                    alt="Upload Product"
                    className="supplier-modal-addprod-img"
                    src={selectedImage ? URL.createObjectURL(selectedImage) : prodImage}
                    onClick={handleImageClick}
                />
                <i className="overlay-icon fa fa-cloud-upload" onClick={handleImageClick}></i> 
                <input
                    ref={inputRef}
                    type="file"
                    name="prodImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    onKeyDown={handleKeyDown}
                />
              </div>

              

                {/* status */}
                <div className="supplier-prod-status">
                    <h3 className="prod-info-titles">Status</h3>
                    <select 
                        name="prodStatus" 
                        id="prodStatus" 
                        style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'18rem', marginTop:'5px' }}
                        onKeyDown={handleKeyDown}
                    >
                      <option value="" defaultChecked>Select a Status</option>
                      <option value="Active" onClick={() => setIsActive(true)}>Activate</option>
                      <option value="Inactive" onClick={() => setIsActive(false)}>Deactivate</option>
                    </select>
                </div>
              </div>

                <div className="col-md supplier-prod-details-modal">
                    <h3 className="prod-details-titles">Product Details</h3>

                    <label className="prod-details-labels" htmlFor="prodName">Product Name</label>
                    <input 
                      className="modal-input-box" 
                      type="text" 
                      name="prodName" 
                      placeholder="Enter product name"
                      id="prodName" 
                      onChange={(e) => setProductName(e.target.value)} 
                      onKeyDown={handleKeyDown}
                    />

                    <label className="prodDescription-label">Description</label>
                    <textarea 
                        className="form-control" 
                        aria-label="Product description" 
                        placeholder="Enter product description" 
                        onChange={(e) => setProductDescription(e.target.value)} 
                        onKeyDown={handleKeyDown}
                    />

                <label className="prod-details-labels">Department</label>
                {/* DEPARTMENT CHECKBOX */}
                <div className="suppliers-department-checkbox">
                  <select
                    name="prodGender"
                    id="prodGender"
                    style={{ padding: "5px", fontSize: "12px", borderRadius: "10px", width: "18rem" }}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="" defaultChecked>Select a Department</option>
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
                            type="radio" 
                            value="Male" 
                            name="gender"
                            id="departmentCheck1"
                            onChange={(e) => handleCategoryChange(e, 'Male')}
                            onKeyDown={handleKeyDown}
                        />
                        <label className="departmentCheckLabel" htmlFor="departmentCheck1">
                            Male
                        </label>
                    </div>
                    <div className="department-option">
                        <input 
                            type="radio" 
                            value="Female" 
                            name="gender"
                            id="departmentCheck2"
                            onChange={(e) => handleCategoryChange(e, 'Female')}
                            onKeyDown={handleKeyDown}
                        />
                        <label className="departmentCheckLabel" htmlFor="departmentCheck2">
                            Female
                        </label>
                    </div>
                    <div className="department-option">
                        <input 
                            type="radio" 
                            value="Unisex" 
                            name="gender"
                            id="departmentCheck3"
                            onChange={(e) => handleCategoryChange(e, 'Unisex')}
                            onKeyDown={handleKeyDown}
                        />
                        <label className="departmentCheckLabel" htmlFor="departmentCheck3">
                            Unisex
                        </label>
                    </div>

                <label className="prod-details-labels">Product Type</label>
                <select 
                    name="prodGender" 
                    id="prodGender" 
                    style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'18rem' }}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                    onKeyDown={handleKeyDown}
                >
                    <option value="" defaultChecked>Select Type of Product</option>
                    {productTypes.map((productType, index) => (
                        <option key={index} value={productType.productTypeId}>
                            {productType.product_Type}
                        </option>
                    ))}
                </select>

                <label className="prod-details-labels">Price</label>
                <input 
                  className="modal-input-box" 
                  type="text" 
                  name="prodPrice" 
                  placeholder="Enter product price"
                  id="prodPrice" 
                  onChange={(e) => setProductPrice(e.target.value)} 
                  onKeyDown={handleKeyDown}
                />

                {/* SIZES AVAILABLE CHECKBOX */}
                <label className="prod-details-labels">Sizes Available</label>
                <div className="suppliers-sizes-avail-checkbox">
                  {sizes.map((sizeQty, index) => (
                    <div key={index} className="supplier-size-avail-item">
                      <input
                        className="supplier-size-avail-checkbox"
                        type="text"
                        placeholder="Size"
                        onChange={(e) => (sizeQty.size = e.target.value)}
                      />
                      <input
                        className="supplier-size-avail-checkbox"
                        type="text"
                        placeholder="Quantity"
                        onChange={(e) => (sizeQty.quantity = e.target.value)}
                      />
                      <span onClick={() => setSizes(sizes.filter((_, i) => i !== index))} style={{ cursor: "pointer", color: "red" }}>
                        X
                      </span>
                    </div>
                  ))}
                </div>
                <button className="addSizeBtn" onClick={addNewSizeInput}>Add Size +</button>
              </div>
            </div>    
            </div>
        </div>
        </div>

        {/* EDIT PRODUCT INFO MODAL */}
        <div className="modal fade" id="editProductModal" tabIndex={-1} aria-labelledby="editProductModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
            {selectedProduct && (
            <div className="modal-content" style={{ padding:'15px', height:'100vh' }}>
            <div className="prod-header">
                <h1 className="modal-title" id="exampleModalLabel">Edit Product</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => window.location.reload()}></button>
            </div>
            <div className="modal-basta-container">
                <span>You can edit product details here</span>
                <div className="modal-btns-container">
                    <button type="button" className="cancel-btn-modal" data-bs-dismiss="modal" onClick={() => window.location.reload()}>Cancel</button>
                    <button type="button" className="save-prod-btn" onClick={handleEdit}>Save</button>
                </div>
            </div>
            <div className="modal-body" style={{ display:'flex', flexFlow:'row' }}>
                <div>
                    <div className="thumbnail-container">
                        <h3 className="prod-info-titles">Product Image</h3>
                        <img
                          id="productImage"
                          alt="Upload Product"
                          className="supplier-modal-addprod-img"
                          src={`https://localhost:7017/${selectedProduct.image}`}
                          onClick={handleImageClick}
                        />
                        <i className="overlay-icon fa fa-cloud-upload" onClick={handleImageClick}></i> 
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
                    <select 
                        name="prodStatus" 
                        id="prodStatus" 
                        style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'18rem', marginTop:'5px' }}
                    >
                        <option value="" defaultChecked disabled hidden>Select a Status</option>
                        <option value="Active" selected={selectedProduct.isActive === true} onClick={() => setIsActive(true)}>Activate</option>
                        <option value="Inactive" selected={selectedProduct.isActive === false} onClick={() => setIsActive(false)}>Deactivate</option>
                    </select>
                  </div>

                </div>

                <div className="col-md supplier-prod-details-modal">
                    <h3 className="prod-details-titles">Product Details</h3>

                    <label className="prod-details-labels" htmlFor="prodName">Product Name</label>
                    <input className="modal-input-box" type="text" name="prodName" id="prodName" placeholder="Enter product name" defaultValue={selectedProduct.productName} />

                    <label className="prodDescription-label">Description</label>
                    <textarea 
                        className="form-control" 
                        aria-label="Product description" 
                        placeholder="Enter product description" 
                        defaultValue={selectedProduct.description}
                        onChange={(e) => setProductDescription(e.target.value)} 
                    />

                    <label className="prod-details-labels">Department</label>
                    {/* DEPARTMENT CHECKBOX */}
                    <div className="suppliers-department-checkbox">
                        <select 
                            name="prodGender" 
                            id="prodGender" 
                            style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'18rem' }}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            
                            {departments.map((department, index) => (
                                <option key={index} value={department.departmentId} selected={selectedProduct.departmentId === department.departmentId}>
                                    {department.department_Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* GENDER OPTIONS */}
                    <label className="prod-details-labels">Gender</label>
                    <div className="department-option">
                        <input 
                            type="radio" 
                            value="Male" 
                            name="gender"
                            id="departmentCheck1"
                            defaultChecked={selectedProduct.category === 'Male'}
                            onClick={(e) => handleCategoryChange(e, 'Male')}
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
                            type="radio" 
                            value="Female" 
                            name="gender"
                            id="departmentCheck2"
                            defaultChecked={selectedProduct.category === 'Female'}
                            onClick={(e) => handleCategoryChange(e, 'Female')}
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
                            type="radio" 
                            value="Unisex" 
                            name="gender"
                            id="departmentCheck3"
                            defaultChecked={selectedProduct.category === 'Unisex'}
                            onClick={(e) => handleCategoryChange(e, 'Unisex')}
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
                        style={{ padding:'5px', fontSize:'12px', borderRadius:'10px', width:'18rem' }}
                        onChange={(e) => setSelectedProductType(e.target.value)}
                    >
                        <option value="0" selected>Select Type of Product</option>
                        {productTypes.map((productType, index) => (
                            <option key={index} value={productType.productTypeId} selected={selectedProduct.productTypeId === productType.productTypeId}>
                                {productType.product_Type}
                            </option>
                        ))}
                    </select>

                    {/* SIZES AVAILABLE CHECKBOX */}
                    <label className="prod-details-labels">Sizes Available</label>
                <div className="suppliers-sizes-avail-checkbox">
                  {Newsizes.map((sizeQty, index) => (
                    <div key={index} className="supplier-size-avail-item">
                      <input
                        className="supplier-size-avail-checkbox"
                        type="text"
                        placeholder="Size"
                        defaultValue={sizeQty.size}
                        onChange={(e) => (sizeQty.size = e.target.value)}
                      />
                      <input
                        className="supplier-size-avail-checkbox"
                        type="text"
                        placeholder="Quantity"
                        defaultValue={sizeQty.quantity}
                        onChange={(e) => (sizeQty.quantity = e.target.value)}
                      />
                      <span onClick={() => setNewSizes(Newsizes.filter((_, i) => i !== index))} style={{ cursor: "pointer", color: "red" }}>
                        X
                      </span>
                    </div>
                  ))}
                </div>
                <button className="addSizeBtn" onClick={addNewSizeInput2}>Add Size +</button>
                    <label className="prod-details-labels">Price</label>
                    <input className="modal-input-box" type="text" name="prodPrice" id="prodPrice" placeholder="Enter product price" defaultValue={selectedProduct.price}/>
                </div>
            </div>    
            </div>
            )}
        </div>
        </div>

      </div>
  );
}

export default Manage_Shop;
