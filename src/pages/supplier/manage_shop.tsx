import prodImage from "../../assets/images/shop_products/picture-2.png";
import addIcon from "../../assets/images/icons/plus-4.png";
import noProdsIcon from "../../assets/images/icons/empty-box.png";
import LoadingGif from "../../assets/images/icons/loadingscreen.svg";
import "./manage_shop.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import addProductEventEmitter from "../../helpers/AddProductEventEmitter";
import React from "react";
import { format } from "date-fns";

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

  // type ValidationErrors = {
  //   department?: string;
  //   productName?: string;
  //   description?: string;
  //   category?: string;
  //   image?: string | null;
  //   frontViewImage?: string | null;
  //   sideViewImage?: string | null;
  //   backViewImage?: string | null;
  //   sizeGuide?: string | null;
  //   price?: string;
  //   sizes?: string
  // }

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const [productName, setProductName] = useState("");
  const [newName, setNewName] = useState("");

  const [productDescription, setProductDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [productPrice, setProductPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [productCategory, setProductCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [productTypeId, setSelectedProductType] = useState("");
  const [newTypeId, setNewProductType] = useState("");

  const [sizes, setSizes] = useState<SizeQuantity[]>([]);
  const [Newsizes, setNewSizes] = useState([]);

  const [, setSelectedDepartment] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newSelectedImage, setNewSelectedImage] = useState<File | null>(null);

  const [selectedFrontImage, setSelectedFrontImage] = useState<File | null>(null);
  const [newSelectedFrontImage, setNewSelectedFrontImage] = useState<File | null>(null);

  const [selectedSideImage, setSelectedSideImage] = useState<File | null>(null);
  const [newSelectedSideImage, setNewSelectedSideImage] = useState<File | null>(null);

  const [selectedBackImage, setSelectedBackImage] = useState<File | null>(null);
  const [newSelectedBackImage, setNewSelectedBackImage] = useState<File | null>(null);

  const [sizeGuide, setSizeGuide] = useState<File | null>(null);
  const [newSizeGuide, setNewSizeGuide] = useState<File | null>(null);

  const [NewisActive, setNewIsActive] = useState();

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [newSelectedDepartments, setNewSelectedDepartments] = useState([]);
  const [lastErrorMessage, setLastErrorMessage] = useState("");
  //const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const frontImageRef = useRef<HTMLInputElement>(null);
  const sideImageRef = useRef<HTMLInputElement>(null);
  const backImageRef = useRef<HTMLInputElement>(null);
  const sizeGuideRef = useRef<HTMLInputElement>(null);

  const frontImageRef2 = useRef<HTMLInputElement>(null);

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // * Department Change for Add
  const handleDepartmentChange = (departmentId, isChecked) => {
    if (isChecked) {
      setSelectedDepartments([...selectedDepartments, departmentId]);
    } else {
      setSelectedDepartments(
        selectedDepartments.filter((id) => id !== departmentId)
      );
    }
  };

  // * Department Change for Edit
  const handleDepartmentChangeEdit = (departmentId, isChecked) => {
    const newDepartments = isChecked
      ? [...newSelectedDepartments, departmentId]
      : newSelectedDepartments.filter((id) => id !== departmentId);

    setNewSelectedDepartments(newDepartments);
  };

  // * When Select Product it will show deparments are selected
  const selectProductForEditing = (productItem) => {
    setNewSelectedDepartments(
      productItem.departments.map((dept) => dept.departmentId)
    );
  };

  // * Reset Button
  const HandleResetButton = () => {
    setSelectedDepartment("");
    setSelectedProductType("");
    setSizes([]);

    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");

    setSelectedImage(null);
    setSelectedFrontImage(null);
    setSelectedSideImage(null);
    setSelectedBackImage(null);
  };

  // * Price Onchange
  const handlePrice = (value) => {
    if (/^[0-9.]*$/.test(value)) {
      setProductPrice(value);
      setLastErrorMessage("");
    } else if (lastErrorMessage !== "Price must contain only numbers.") {
      toast.error("Price must contain only numbers.");
      setLastErrorMessage("Price must contain only numbers.");
    }
  };

  // * New Price Onchange
  const handleNewPrice = (value) => {
    if (/^[0-9.]*$/.test(value)) {
      setNewPrice(value);
      setLastErrorMessage("");
    } else if (lastErrorMessage !== "Price must contain only numbers.") {
      toast.error("Price must contain only numbers.");
      setLastErrorMessage("Price must contain only numbers.");
    }
  };

  // * Image Click
  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // * Front Image Click
  const handleFrontClick = () => {
    if (frontImageRef.current) {
      frontImageRef.current.click();
    }
  };

  // * Side Image Click
  const handleSideClick = () => {
    if (sideImageRef.current) {
      sideImageRef.current.click();
    }
  };

  // * Back Image Click
  const handleBackClick = () => {
    if (backImageRef.current) {
      backImageRef.current.click();
    }
  };

  // * Front Image Click For Edit
  const handleFrontClick2 = () => {
    frontImageRef2.current.click();
  };

  // * Category Change for Add
  const handleCategoryChange = (_e, gender) => {
    setProductCategory(productCategory === gender ? "" : gender);
  };

  // * Category Change for Edit
  const handleCategoryChange2 = (gender) => {
    if (productCategory === gender) {
      setNewCategory("");
    } else {
      setNewCategory(gender);
    }
  };

  // * Handle Size Guide Image for Add
  const handleSizeGuideChange = (event) => {
    setSizeGuide(event.target.files[0]);
  };

  // * Handle Size Guide Image for Edit
  const handleSizeGuideChange2 = (event) => {
    setNewSizeGuide(event.target.files[0]);
  };

  // ! Add
  // * Upload Main Image for Add
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // * Upload Front Image for Add
  const handleFrontImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFrontImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productFrontImage")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Upload Side Image for Add
  const handleSideImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedSideImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productSideImage")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Upload Back Image for Add
  const handleBackImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedBackImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productBackImage")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // ! Edit
  // * Upload Image for Edit
  const handleMainImageChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewSelectedImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productImage2")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Upload Front Image for Edit
  const handleFrontImageChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewSelectedFrontImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productFrontImage2")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Upload Side Image for Edit
  const handleSideImageChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewSelectedSideImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productSideImage2")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Upload Back Image for Edit
  const handleBackImageChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewSelectedBackImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          document
            .getElementById("productBackImage2")!
            .setAttribute("src", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // * Get All Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://localhost:7017/Department");
        setDepartments(response.data);
      } catch (error) {
        console.error(error);
        console.error("Error fetching departments");
      }
    };
    fetchDepartments();
  }, []);

  // * Get All Product Types
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await axios.get("https://localhost:7017/ProductType");
        setProductTypes(response.data);
      } catch (error) {
        console.error(error);
        console.error("Error fetching product types");
      }
    };
    fetchProductType();
  }, []);

  // * Get Product By Supplier Id
  useEffect(() => {
    setIsLoading(true);
    const fetchProductSupplierId = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7017/Product/bysupplier/${id}`
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        console.error("Error fetching products");
        setIsLoading(false);
      }
    };
    fetchProductSupplierId();
  }, [id]);

  // * Get Product Type Name
  const getProductTypeName = (productTypeId) => {
    const productType = productTypes.find(
      (p) => p.productTypeId === productTypeId
    );
    return productType ? productType.product_Type : "Unknown Type";
  };

  const addNewSizeInput = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const addNewSizeInput2 = () => {
    setNewSizes([...Newsizes, { size: "", quantity: "" }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  // * Handle Change Status
  const handleChangeStatus = (active) => {
    if (active == true) {
      const userConfirmed = window.confirm(
        "Do you want to Deactivate this product?"
      );
      if (userConfirmed) {
        axios.put(
          `https://localhost:7017/Product/deactivate/${selectedProduct.productId}`
        );
        window.location.reload();
      }
    } else if (active == false) {
      const userConfirmed = window.confirm(
        "Do you want to Activate this product?"
      );
      if (userConfirmed) {
        axios.put(
          `https://localhost:7017/Product/activate/${selectedProduct.productId}`
        );
        window.location.reload();
      }
    }
  };

  // * Handle Change Button
  const handleChangeButton = (active) => {
    if (active == true) {
      const button = document.getElementById("btnStatus");
      button.textContent = "Deactivate";
      button.style.color = "white";
      button.style.backgroundColor = "red";
      button.style.borderColor = "red";
    } else if (active == false) {
      const button = document.getElementById("btnStatus");
      button.textContent = "Activate";
      button.style.backgroundColor = "green";
      button.style.borderColor = "green";
      button.style.color = "white";
    }
  };

  // * Edit Item
  const handleEdit = async () => {
    const selectedSizes = Newsizes.filter(({ size }) => size);
    const errorMessages = [];

    if (!newName) errorMessages.push("Product Name is required");
    if (!newDescription) errorMessages.push("Product Description is required");
    if (!newPrice || isNaN(Number(productPrice)))
      errorMessages.push("Valid Product Price is required");
    if (!newCategory) errorMessages.push("Product Category is required");
    if (!newTypeId) errorMessages.push("Product Type is required");
    if (!newSelectedDepartments) errorMessages.push("Department is required");
    if (!newSelectedImage) errorMessages.push("Image is required");
    if (!newSelectedFrontImage) errorMessages.push("Front Image is required");
    if (!newSelectedSideImage) errorMessages.push("Side Image is required");
    if (!newSelectedBackImage) errorMessages.push("Back Image is required");
    if (!newSizeGuide) errorMessages.push("Size Guide is required");
    if (selectedSizes.length === 0)
      errorMessages.push("Sizes and Quantity is required");

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => toast.error(message));
      return;
    }

    const formData = new FormData();
    formData.append("ProductTypeId", newTypeId);
    formData.append("ProductName", newName);
    formData.append("Description", newDescription);
    formData.append("Category", newCategory);
    formData.append("Price", newPrice);
    formData.append("Image", newSelectedImage as File);
    formData.append("FrontViewImage", newSelectedFrontImage as File);
    formData.append("SideViewImage", newSelectedSideImage as File);
    formData.append("BackViewImage", newSelectedBackImage as File);
    formData.append("SizeGuide", newSizeGuide as File);
    formData.append("SupplierId", id);
    newSelectedDepartments.forEach((departmentId) => {
      formData.append("DepartmentIds", departmentId);
    });

    try {
      const productResponse = await axios.put(
        `https://localhost:7017/Product/${parseInt(selectedProduct.productId)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (productResponse.status === 200) {
        const productId = selectedProduct.productId;
        const updateSizeApiCalls = [];
        const createSizeApiCalls = [];

        selectedSizes.forEach(({ size, quantity, id }) => {
          if (id) {
            const sizeFormData = new FormData();
            sizeFormData.append("Size", size);
            sizeFormData.append("Quantity", quantity);
            sizeFormData.append("productId", productId);
            updateSizeApiCalls.push(
              axios.put(
                `https://localhost:7017/SizeQuantity/Update/${id}`,
                sizeFormData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
            );
          } else {
            const sizeData = {
              size: size,
              productId: productId,
              quantity: quantity,
            };
            createSizeApiCalls.push(
              axios.post(
                "https://localhost:7017/SizeQuantity/createsizequantity",
                sizeData,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
            );
          }
        });

        await Promise.all([...updateSizeApiCalls, ...createSizeApiCalls]);
        toast.success("Successfully Updated An Item");
        await sleep(1000);
        window.location.reload();
      } else {
        toast.error(productResponse.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error or server not responding");
    }
  };

  // * Add Item
  const handleAddItem = () => {
    const selectedSizes = sizes.filter(({ size }) => size);

    const errorMessages = [];

    if (!productName) errorMessages.push("Product Name is required");
    if (!productDescription) errorMessages.push("Product Description is required");
    if (!productPrice || isNaN(Number(productPrice))) errorMessages.push("Valid Product Price is required");
    if (!productCategory) errorMessages.push("Product Category is required");
    if (!productTypeId) errorMessages.push("Product Type is required");
    if (!selectedImage) errorMessages.push("Image is required");
    if (!selectedFrontImage) errorMessages.push("Front Image is required");
    if (!selectedSideImage) errorMessages.push("Side Image is required");
    if (!selectedBackImage) errorMessages.push("Back Image is required");
    if (!sizeGuide) errorMessages.push("Size Guide is required");
    if (selectedSizes.length === 0) errorMessages.push("Sizes and Quantity is required");

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => toast.error(message));
      return;
    }

    const formData = new FormData();
    formData.append("ProductTypeId", productTypeId);
    formData.append("ProductName", productName);
    formData.append("Description", productDescription);
    formData.append("Category", productCategory);
    formData.append("Price", productPrice);
    formData.append("Image", selectedImage as File);
    formData.append("FrontViewImage", selectedFrontImage as File);
    formData.append("SideViewImage", selectedSideImage as File);
    formData.append("BackViewImage", selectedBackImage as File);
    formData.append("SizeGuide", sizeGuide as File);
    formData.append("SupplierId", id);
    selectedDepartments.forEach((departmentId) => {
      formData.append("DepartmentIds", departmentId);
    });

    axios
      .post("https://localhost:7017/Product/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (productResponse) => {
        if (productResponse.status === 200) {
          addProductEventEmitter.emit("addProduct");

          const sizeApiCalls = selectedSizes.map(({ size, quantity }) => {
            const sizeFormData = new FormData();
            sizeFormData.append("size", size);
            sizeFormData.append("productId", productResponse.data);
            sizeFormData.append("quantity", quantity);

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
            addProductEventEmitter.emit("addProduct");
            await Promise.all(sizeApiCalls);
            toast.success("Successfully Added An Item");

            await sleep(2000);
            window.location.reload();
          } catch (error) {
            console.log(productResponse.data);
            toast.warning(
              "Network error or server not responding while adding sizes"
            );
          }
        } else {
          toast.error(productResponse.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          toast.error("Network error or server not responding");
        } else {
          toast.error("Error", error.message);
        }
      });
  };

  // * Total Stock Product
  const totalStock = (sizes) => {
    if (!sizes || sizes.length === 0) {
      return 0;
    }
    return sizes.reduce(
      (acc, currentSize) => acc + Number(currentSize.quantity),
      0
    );
  };

  // * Delete Size and Quantity
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7017/SizeQuantity/delete/${id}`, {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting the size quantity");
      }

      setNewSizes(Newsizes.filter((sizeQty) => sizeQty.id !== id));
    } catch (error) {
      console.error("Failed to delete the size quantity:", error);
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="mainloading-screen">
          <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
        </div>
      ) : (
        <div className="manage-shop-main-container">
        <div className="add-prod-btn-container">
          <h3
            style={{ marginBottom: "20px", color: "#020654", fontWeight: "600" }}
          >
            Manage Shop
          </h3>
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
              <div
                key={index}
                className="prod-card"
                data-bs-toggle="modal"
                data-bs-target="#editProductModal"
                onClick={() => {
                  setSelectedProduct(productItem);
                  setNewSizes(productItem.sizes);
                  setNewPrice(productItem.price);
                  setNewCategory(productItem.category);
                  setNewDescription(productItem.description);
                  setNewIsActive(productItem.isActive);
                  setNewName(productItem.productName);
                  setNewProductType(productItem.productTypeId);
                  setNewSelectedImage(productItem.image);
                  setNewSelectedFrontImage(productItem.frontViewImage);
                  setNewSelectedSideImage(productItem.sideViewImage);
                  setNewSelectedBackImage(productItem.backViewImage);
                  setNewSizeGuide(productItem.sizeGuide);
                  handleCategoryChange2(productItem.category);
                  selectProductForEditing(productItem);
                }}
              >
                <div className="prod-shop-image-container">
                  <img
                    className="supplier-shop-prod-image"
                    src={
                      productItem.image
                        ? `https://localhost:7017/${productItem.image}`
                        : prodImage
                    }
                  />
                </div>
                <div className="col-md-11 prod-shop-details">
                  <span
                    className="col-md-3 supplier-prod-details"
                    style={{ color: productItem.isActive ? "" : "black" }}
                  >
                    {productItem.productName}
                  </span>
                  <span
                    className="col-md-2 supplier-prod-details"
                    style={{ color: productItem.isActive ? "" : "black" }}
                  >
                    {getProductTypeName(productItem.productTypeId)}
                  </span>
                  <span
                    className="col-md-1 supplier-prod-details"
                    style={{ color: productItem.isActive ? "" : "black" }}
                  >
                    {productItem.category}
                  </span>
                  <span
                    className="col-md-1 supplier-prod-details"
                    style={{ color: productItem.isActive ? "" : "black" }}
                  >
                    {totalStock(productItem.sizes)}
                  </span>
                  <span
                    className="col-md-1 supplier-prod-details"
                    style={{
                      backgroundColor: productItem.isActive ? "green" : "red",
                      color: "white",
                    }}
                  >
                    {productItem.isActive ? "Active" : "Inactive"}
                  </span>
                  <h4
                    className="col-md-2 supplier-prod-price"
                    style={{ color: productItem.isActive ? "" : "black" }}
                  >
                    ₱{productItem.price.toLocaleString(2)}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <div className="no-productsShop-message">
              <img src={noProdsIcon} />
              <p>No products available</p>
            </div>
          )}
        </div>
  
        {/* ADD NEW PRODUCT - MODAL  */}
        <div
          className="modal fade"
          id="addProductModal"
          tabIndex={-1}
          aria-labelledby="addProductModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen">
            <div
              className="modal-content"
              style={{ padding: "15px", height: "100vh" }}
            >
              <div className="prod-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  Add New Product
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => window.location.reload()}
                ></button>
              </div>
              <div className="modal-basta-container">
                <span>You can add new products to your shop here</span>
                <div className="modal-btns-container">
                  <button
                    type="button"
                    className="cancel-btn-modal"
                    data-bs-dismiss="modal"
                    onClick={HandleResetButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="save-prod-btn"
                    onClick={handleAddItem}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div
                className="modal-body"
                style={{ display: "flex", flexFlow: "row" }}
              >
                <div>
                  <div className="thumbnail-container">
                    <h3 className="prod-info-titles">Main Image</h3>
                    <img
                      id="productImage"
                      alt="Upload Product"
                      className="supplier-modal-addprod-img"
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : prodImage
                      }
                      onClick={handleImageClick}
                    />
                    <i
                      className="overlay-icon fa fa-cloud-upload"
                      onClick={handleImageClick}
                    ></i>
                    <input
                      ref={inputRef}
                      type="file"
                      name="prodImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
  
                  <div className="thumbnail-container">
                    <h3 className="prod-info-titles">Front Image</h3>
                    <img
                      id="productFrontImage"
                      alt="Upload Product"
                      className="supplier-modal-addprod-img"
                      src={
                        selectedFrontImage
                          ? URL.createObjectURL(selectedFrontImage)
                          : prodImage
                      }
                      onClick={handleFrontClick}
                    />
                    <i
                      className="overlay-icon fa fa-cloud-upload"
                      onClick={handleFrontClick}
                    ></i>
                    <input
                      ref={frontImageRef}
                      type="file"
                      name="prodImage"
                      accept="image/*"
                      onChange={handleFrontImageChange}
                      style={{ display: "none" }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
  
                  <div className="thumbnail-container">
                    <h3 className="prod-info-titles">Side Image</h3>
                    <img
                      id="productSideImage"
                      alt="Upload Product"
                      className="supplier-modal-addprod-img"
                      src={
                        selectedSideImage
                          ? URL.createObjectURL(selectedSideImage)
                          : prodImage
                      }
                      onClick={handleSideClick}
                    />
                    <i
                      className="overlay-icon fa fa-cloud-upload"
                      onClick={handleSideClick}
                    ></i>
                    <input
                      ref={sideImageRef}
                      type="file"
                      name="prodImage"
                      accept="image/*"
                      onChange={handleSideImageChange}
                      style={{ display: "none" }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
  
                  <div className="thumbnail-container">
                    <h3 className="prod-info-titles">Back Image</h3>
                    <img
                      id="productBackImage"
                      alt="Upload Product"
                      className="supplier-modal-addprod-img"
                      src={
                        selectedBackImage
                          ? URL.createObjectURL(selectedBackImage)
                          : prodImage
                      }
                      onClick={handleBackClick}
                    />
                    <i
                      className="overlay-icon fa fa-cloud-upload"
                      onClick={handleBackClick}
                    ></i>
                    <input
                      ref={backImageRef}
                      type="file"
                      name="prodImage"
                      accept="image/*"
                      onChange={handleBackImageChange}
                      style={{ display: "none" }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
  
                <div className="col-md supplier-prod-details-modal">
                  <h3 className="col-md-12 prod-details-titles">
                    Product Details
                  </h3>
  
                  <label className="prod-details-labels" htmlFor="prodName">
                    Product Name
                  </label>
                  <input
                    className="modal-input-box"
                    type="text"
                    name="prodName"
                    placeholder="Enter product name"
                    id="prodName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
  
                  <label className="prodDescription-label">Description</label>
                  <textarea
                    className="form-control"
                    aria-label="Product description"
                    placeholder="Enter product description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
  
                  <label className="prod-details-labels">Department</label>
                  {/* DEPARTMENT CHECKBOX */}
                  <div className="suppliers-department-checkbox">
                    {departments.map((department, index) => (
                      <label key={index}>
                        <input
                          className="departmentCheckbox"
                          type="checkbox"
                          value={department.departmentId}
                          checked={selectedDepartments.includes(
                            department.departmentId
                          )}
                          onChange={(e) =>
                            handleDepartmentChange(
                              department.departmentId,
                              e.target.checked
                            )
                          }
                        />
                        {department.department_Name}
                      </label>
                    ))}
                  </div>
                  {/* GENDER OPTIONS */}
                  <label className="prod-details-labels">Gender</label>
                  <div className="department-option">
                    <input
                      className="genderRadio"
                      type="radio"
                      value="Male"
                      name="gender"
                      id="departmentCheck1"
                      checked={productCategory === "Male"}
                      onChange={(e) => handleCategoryChange(e, "Male")}
                      onKeyDown={handleKeyDown}
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
                      className="genderRadio"
                      type="radio"
                      value="Female"
                      name="gender"
                      id="departmentCheck2"
                      checked={productCategory === "Female"}
                      onChange={(e) => handleCategoryChange(e, "Female")}
                      onKeyDown={handleKeyDown}
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
                      className="genderRadio"
                      type="radio"
                      value="Unisex"
                      name="gender"
                      id="departmentCheck3"
                      checked={productCategory === "Unisex"}
                      onChange={(e) => handleCategoryChange(e, "Unisex")}
                      onKeyDown={handleKeyDown}
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
                    name="prodType"
                    id="prodType"
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      borderRadius: "10px",
                      width: "18rem",
                    }}
                    value={productTypeId}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="" disabled selected hidden>
                      Select Type of Product
                    </option>
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
                    value={productPrice}
                    onChange={(e) => handlePrice(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
  
                  <h2 className="prod-details-labels">Upload Size Guide:</h2>
                  <input
                    type="file"
                    ref={sizeGuideRef}
                    className="size-guide-img"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleSizeGuideChange}
                  />
  
                  {/* SIZES AVAILABLE */}
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
                        <span
                          className="close-btn-size"
                          onClick={() =>
                            setSizes(sizes.filter((_, i) => i !== index))
                          }
                          style={{ cursor: "pointer", color: "red" }}
                        >
                          X
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="addSizeBtn" onClick={addNewSizeInput}>
                    Add Size +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* EDIT PRODUCT INFO MODAL */}
        <div
          className="modal fade"
          id="editProductModal"
          tabIndex={-1}
          aria-labelledby="editProductModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen">
            {selectedProduct && (
              <div
                className="modal-content"
                style={{ padding: "15px", height: "100vh" }}
                onLoad={() => handleChangeButton(NewisActive)}
              >
                <div className="prod-header">
                  <h1 className="modal-title" id="exampleModalLabel">
                    Edit Product
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => window.location.reload()}
                  ></button>
                </div>
                <div className="modal-basta-container">
                  <span>You can edit product details here</span>
                  <div className="modal-btns-container">
                    <button
                      type="button"
                      className="cancel-btn-modal"
                      onClick={() => handleChangeStatus(NewisActive)}
                      id="btnStatus"
                    ></button>
                    <button
                      type="button"
                      className="cancel-btn-modal"
                      data-bs-dismiss="modal"
                      onClick={() => window.location.reload()}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="save-prod-btn"
                      onClick={handleEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
  
                <div
                  className="modal-body"
                  style={{ display: "flex", flexFlow: "row" }}
                >
                  <div>
                    <div className="thumbnail-container">
                      <h3 className="prod-info-titles">Main Image</h3>
                      <img
                        id="productImage2"
                        alt="Upload Product"
                        className="supplier-modal-addprod-img"
                        src={
                          newSelectedImage
                            ? `https://localhost:7017/${newSelectedImage}`
                            : prodImage
                        }
                        onClick={handleImageClick}
                      />
                      <i
                        className="overlay-icon fa fa-cloud-upload"
                        onClick={handleImageClick}
                      ></i>
                      <input
                        ref={inputRef}
                        type="file"
                        name="prodImage"
                        accept="image/*"
                        onChange={handleMainImageChange2}
                        style={{ display: "none" }}
                      />
                    </div>
  
                    <div className="thumbnail-container">
                      <h3 className="prod-info-titles">Front Image</h3>
                      <img
                        id="productFrontImage2"
                        alt="Upload Product"
                        className="supplier-modal-addprod-img"
                        src={
                          newSelectedFrontImage
                            ? `https://localhost:7017/${newSelectedFrontImage}`
                            : prodImage
                        }
                        onClick={handleFrontClick2}
                      />
                      <i
                        className="overlay-icon fa fa-cloud-upload"
                        onClick={handleFrontClick2}
                      ></i>
                      <input
                        ref={frontImageRef2}
                        type="file"
                        name="prodImage"
                        accept="image/*"
                        onChange={handleFrontImageChange2}
                        style={{ display: "none" }}
                      />
                    </div>
  
                    <div className="thumbnail-container">
                      <h3 className="prod-info-titles">Side Image</h3>
                      <img
                        id="productSideImage2"
                        alt="Upload Product"
                        className="supplier-modal-addprod-img"
                        src={
                          newSelectedSideImage
                            ? `https://localhost:7017/${newSelectedSideImage}`
                            : prodImage
                        }
                        onClick={handleSideClick}
                      />
                      <i
                        className="overlay-icon fa fa-cloud-upload"
                        onClick={handleSideClick}
                      ></i>
                      <input
                        ref={sideImageRef}
                        type="file"
                        name="prodImage"
                        accept="image/*"
                        onChange={handleSideImageChange2}
                        style={{ display: "none" }}
                      />
                    </div>
  
                    <div className="thumbnail-container">
                      <h3 className="prod-info-titles">Back Image</h3>
                      <img
                        id="productBackImage2"
                        alt="Upload Product"
                        className="supplier-modal-addprod-img"
                        src={
                          newSelectedBackImage
                            ? `https://localhost:7017/${newSelectedBackImage}`
                            : prodImage
                        }
                        onClick={handleBackClick}
                      />
                      <i
                        className="overlay-icon fa fa-cloud-upload"
                        onClick={handleBackClick}
                      ></i>
                      <input
                        ref={backImageRef}
                        type="file"
                        name="prodImage"
                        accept="image/*"
                        onChange={handleBackImageChange2}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
  
                  <div className="col-md supplier-prod-details-modal">
                    <h3 className="prod-details-titles">Product Details</h3>
  
                    <label className="prod-details-labels" htmlFor="prodName">
                      Product Name
                    </label>
                    <input
                      className="modal-input-box"
                      type="text"
                      name="prodName"
                      id="prodName"
                      placeholder="Enter product name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
  
                    <label className="prodDescription-label">Description</label>
                    <textarea
                      className="form-control"
                      aria-label="Product description"
                      placeholder="Enter product description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
  
                    {/* DEPARTMENT CHECKBOX */}
                    <label className="prod-details-labels">Department</label>
                    <div className="suppliers-department-checkbox">
                      {departments.map((department, index) => (
                        <label key={index}>
                          <input
                            type="checkbox"
                            value={department.departmentId}
                            checked={newSelectedDepartments.includes(
                              department.departmentId
                            )}
                            onChange={(e) =>
                              handleDepartmentChangeEdit(
                                department.departmentId,
                                e.target.checked
                              )
                            }
                          />
                          {department.department_Name}
                        </label>
                      ))}
                    </div>
  
                    {/* GENDER OPTIONS */}
                    <label className="prod-details-labels">Gender</label>
                    <div className="department-option">
                      <input
                        type="radio"
                        value="Male"
                        name="gender"
                        id="departmentCheck1"
                        checked={newCategory === "Male"}
                        onChange={(e) => handleCategoryChange(e, "Male")}
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
                        checked={newCategory === "Female"}
                        onChange={(e) => handleCategoryChange(e, "Female")}
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
                        checked={newCategory === "Unisex"}
                        onChange={(e) => handleCategoryChange(e, "Unisex")}
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
                      style={{
                        padding: "5px",
                        fontSize: "12px",
                        borderRadius: "10px",
                        width: "18rem",
                      }}
                      onChange={(e) => setNewProductType(e.target.value)}
                    >
                      <option value="" disabled selected hidden>
                        Select Type of Product
                      </option>
                      {productTypes.map((productType, index) => (
                        <option
                          key={index}
                          value={productType.productTypeId}
                          selected={
                            selectedProduct.productTypeId ===
                            productType.productTypeId
                          }
                        >
                          {productType.product_Type}
                        </option>
                      ))}
                    </select>
  
                    <h2 className="prod-details-labels">Upload Size Guide:</h2>
                    <input
                      type="file"
                      ref={sizeGuideRef}
                      className="size-guide-img"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleSizeGuideChange2}
                    />
  
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
                            onChange={(e) => {
                              const newSizeQty = {
                                ...sizeQty,
                                size: e.target.value,
                              };
                              setNewSizes(
                                Newsizes.map((sq) =>
                                  sq.id === sizeQty.id ? newSizeQty : sq
                                )
                              );
                            }}
                          />
                          <input
                            className="supplier-size-avail-checkbox"
                            type="text"
                            placeholder="Quantity"
                            defaultValue={sizeQty.quantity}
                            onChange={(e) => {
                              const newSizeQty = {
                                ...sizeQty,
                                quantity: e.target.value,
                              };
                              setNewSizes(
                                Newsizes.map((sq) =>
                                  sq.id === sizeQty.id ? newSizeQty : sq
                                )
                              );
                            }}
                          />
                          <span
                            onClick={() => handleDelete(sizeQty.id)}
                            style={{ cursor: "pointer", color: "red" }}
                          >
                            X
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="addSizeBtn" onClick={addNewSizeInput2}>
                      Add Size +
                    </button>
                    <label className="prod-details-labels">Price</label>
                    <input
                      className="modal-input-box"
                      type="text"
                      name="prodPrice"
                      id="prodPrice"
                      placeholder="Enter product price"
                      value={newPrice}
                      onChange={(e) => handleNewPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </React.Fragment>
  );
}

export default Manage_Shop;
