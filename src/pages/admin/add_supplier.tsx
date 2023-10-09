import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import './add_supplier.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Add_supplier() {

    const [supplier, setSupplier] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [IDNumber, setIDNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');   
    const [confirmPassword, setConfirmPassword] = useState('');  
    const [image, setImage] = useState(null);       
    const [isActive, setIsActive] = useState(false);
    const [supplierIsActive, setSupplierIsActive] = useState('');
    const [, setCustomerIsValid] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleIDNumber = (value) => {
        setIDNumber(value);
    }

    const handleFirstName = (value) => {
        setFirstName(value);
    }

    const handleLastName = (value) => {
        setLastName(value);
    }

    const handleEmail = (value) => {
        setEmail(value);
    }

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value);
    }  
    
    const handleShopeName = (value) => {
        setShopName(value);
    }

    const handleAddress = (value) => {
        setAddress(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }

    const handleConfirmPassword = (value) => {
        setConfirmPassword(value);
    }
    
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    // Add Supplier Function
    const handleAddSupplier = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const formData = new FormData();
        formData.append('Id', IDNumber);
        formData.append('FirstName', firstName);
        formData.append('LastName', lastName);
        formData.append('Email', email);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('ShopName', shopName);
        formData.append('Address', address);
        formData.append('Password', password);
        formData.append('Image', image);
        formData.append('isActive', isActive.toString());

        try {
            const response = await axios.post('https://localhost:7017/Supplier/addSupplier', formData);
            
            if (response.status === 200 && response.data) {
                toast.success('Successfully Added Supplier.');
                navigate(`/admin_main/${id}`);
            } else {
                toast.error('Error while adding supplier. Please try again.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    // Read All Suppliers
    useEffect(() => {
        axios.get('https://localhost:7017/Users/getSuppliers')
        .then(res => {
            setSupplier(res.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    // Edit Supplier Details
    

    // Update Supplier
    const handleUpdateSupplier = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('Id', IDNumber);
        formData.append('FirstName', firstName);
        formData.append('LastName', lastName);
        formData.append('Email', email);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('ShopName', shopName);
        formData.append('Address', address);
        formData.append('Password', password);
        formData.append('Image', image);

        axios.put(`https://localhost:7017/Supplier/updateSupplier/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((result) => {
            if (result.status === 200) {
                alert('Successfully Updated A Supplier');
            } else {
                alert(result.data.message);
                alert("Error");
            }
        })
        .catch(() => {
            alert('Network error or server not responding');
        });
    }; 

    const handleImageUpdate = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    useEffect(() => {
        if (selectedSupplier) {
            setIDNumber(selectedSupplier.id || "");
            setFirstName(selectedSupplier.firstName || "");
            setLastName(selectedSupplier.lastName || "");
            setShopName(selectedSupplier.shopName || "");
            setAddress(selectedSupplier.address || "");
            setPhoneNumber(selectedSupplier.phoneNumber || "");
            setEmail(selectedSupplier.email || "");
            setPassword(selectedSupplier.password || "");
            setConfirmPassword(selectedSupplier.password || "");
            setImage(selectedSupplier.image || null); 
            setIsActive(!selectedSupplier.isActive);
        }
    }, [selectedSupplier]);


    // Activate/Deactivate Supplier
    const handleDeactivateActivate = () => {
        const newActivationStatus = supplierIsActive === 'true' ? 'false' : 'true';

        axios.put(
            `https://localhost:7017/Supplier/activate/${id}`,
            newActivationStatus,
            { headers: 
                { 
                    'Content-Type': 'application/json' 
                } 
        })
        .then((result) => {
            if (result.status === 200) {
                console.log("Success");
                setSupplierIsActive(newActivationStatus);
            } else {
                alert(result.data.message);
                alert("Error");
            }
        })
        .catch(() => {
            alert('Network error or server not responding');
        });
    };

    // Handle Validation for Supplier
    const handleValidation = (customerId: number, currentStatus: boolean) => {
        const newValidationStatus = !currentStatus;
    
        axios.put(`https://localhost:7017/Users/validate/${customerId}`, { isValidate: newValidationStatus }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                toast.success("Validated");
                setCustomerIsValid(newValidationStatus);
            } else {
                toast.error(response.data.message);
            }
        })
        .catch(error => {
            console.log(error);
            toast.error('Network error or server not responding');
        });
    };


    return <div className="admin-container">
        
        <div className='supplier-table-container'>
        <div className='admin-supplierTitle-container'>
        <h1 className='suppliers-title'>SUPPLIERS</h1>
        </div>
        <div className='col-md-12 search-admin-container'>
        <div className='col-md-5' style={{ display:'flex', flexFlow:'row'}}>
                
        <input className="form-control me-1" type="search" placeholder="search shop name" aria-label="Search"/>
        <button className="col-md-3 btn btn-outline-primary" type="submit">Search</button>
        </div>
        <div className='status-filter-container'>
        <button className="btn btn-secondary dropdown-toggle dropdown-menu-dark" style={{ backgroundColor:'#020654' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Filter by Status
        </button>
        <ul className="dropdown-menu dropdown-menu-dark" style={{ backgroundColor:'#020654' }}>
        <li><a className="dropdown-item">Activated</a></li>
        <li><a className="dropdown-item">Deactivated</a></li>
        </ul>
        </div>
        <button className="button" type="button" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
        <span className="button__text">Add Supplier</span>
        <span className="button__icon">
                <svg 
                        className="svg" 
                        fill="none" 
                        height="24" 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        width="24" 
                        xmlns="http://www.w3.org/2000/svg"
                >
                        <line x1="12" x2="12" y1="5" y2="19"></line>
                        <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
        </span>
        </button>
        </div>
        


        <div className='admin-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
        <table className="table table-hover table-bordered align-middle caption-bot table-xl">
        <caption>end of list of suppliers</caption>
        <thead className='table-dark align-middle'>
            <tr className='thead-row'>
            <th scope="col">Store ID</th>
            <th scope="col">Shop</th>
            <th scope="col">Email</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Status</th>
            <th scope="col">Validation</th>
        </tr>
        </thead>
        <tbody className="table-group-divider">
            {supplier.map((s, index) => (
                <tr key={index} >
                    <th 
                        scope="row"
                        id="offcanvasButton" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight" 
                        onClick={() => setSelectedSupplier(s)}
                    >
                        {s.id}
                    </th>
                    <td
                        id="offcanvasButton" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight" 
                        onClick={() => setSelectedSupplier(s)}
                    >
                        {s.shopName}
                    </td>
                    <td
                        id="offcanvasButton" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight" 
                        onClick={() => setSelectedSupplier(s)}
                    >
                        {s.email}
                    </td>
                    <td 
                        id="offcanvasButton" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight" 
                        onClick={() => setSelectedSupplier(s)}
                    >
                        {s.phoneNumber}
                    </td>
                    <td
                        id="offcanvasButton" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight" 
                        onClick={() => setSelectedSupplier(s)}
                    >
                        {s.isActive ? 'Activated' : 'Deactivated'}
                    </td>
                    <td>
                        <div>
                            <button 
                                className={`btn btn-sm ${s.isValidate ? 'btn-success' : 'btn-danger'}`}
                                onClick={() => handleValidation(s.id, s.isValidate)}
                            >
                                {s.isValidate ? 'Valid' : 'Invalid'}
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
        </div>
        </div>
    <div 
        className="supplier-offcanvas offcanvas offcanvas-end" 
        tabIndex={-1} 
        id="offcanvasRight" 
        aria-labelledby="offcanvasRightLabel"
    >
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasRightLabel">
                <div className="supplier-info-group">
                    <span className="supplier-info-label">Supplier ID:</span>
                    <p className="supplier-info">{selectedSupplier ? selectedSupplier.id : ""}</p>
                </div>
            </h5>
            <div data-bs-theme="dark">
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        </div>
        <div className="offcanvas-body">
            <div className="profile-pic-container" style={{ padding:'20px' }}>
                {selectedSupplier && selectedSupplier.image ?
                    <img 
                    className="mx-auto d-block" 
                    src={selectedSupplier ? `https://localhost:7017/${selectedSupplier.image}` : ""}  
                    style={{ height:'120px', width:'120px', borderStyle:'solid', borderRadius:"50%", borderColor:'white' }}
                />
                : null }
            </div>
            <span className={`supplier-Status ${selectedSupplier ? (selectedSupplier.isActive ? "active" : "not-active") : ""}`}>
                Status: {selectedSupplier ? selectedSupplier.isActive ? "Activated" : "Deactivated" : ""}
            </span>
            <img src="" alt="" />
            <div className="supplier-info-group">
                <span className="supplier-info-label">Shop:</span>
                <p className="supplier-info">{selectedSupplier ? selectedSupplier.shopName : ""}</p>
            </div>
            <div className="supplier-info-group">
                <span className="supplier-info-label">Email:</span>
                <p className="supplier-info">{selectedSupplier ? selectedSupplier.email : ""}</p>
            </div>
            <div className="supplier-info-group">
                <span className="supplier-info-label">Phone number:</span>
                <p className="supplier-info">{selectedSupplier ? selectedSupplier.phoneNumber : ""}</p>
            </div>
            <div className="supplier-info-group">
                <span className="supplier-info-label">Account Status:</span>
                <p className="supplier-info">{selectedSupplier ? selectedSupplier.isActive ? "Activated" : "Deactivated" : ""}</p>
            </div>
            <div className="supplier-info-group">
                <span className="supplier-info-label">Validation:</span>
                <p className="supplier-info">{selectedSupplier ? selectedSupplier.isValidate ?  "Valid" : "Invalid" : ""}</p>
            </div>
            <div className="supplier-info-group">
                <span className="supplier-info-label">
                    Password:
                </span>
                <p className="supplier-info">
                    {selectedSupplier ? (showPassword ? selectedSupplier.password : selectedSupplier.password.replace(/./g, '*')) : ""}
                </p>
                <button className='showButtonPassword' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            <span className="supplier-editInfo-btn">
                <button 
                    className="btn btn-lg btn-primary" 
                    style={{ marginTop:'20px' }} 
                    data-bs-toggle="modal" 
                    data-bs-target="#editSupplierDetailsModal"
                >
                    Edit Supplier
                </button>
            </span>
        </div>
    </div>

    <div 
        className="edit-supplier-modal modal fade" 
        id="editSupplierDetailsModal" 
        data-bs-backdrop="static" 
        data-bs-keyboard="false" 
        tabIndex={-1} 
        aria-labelledby="editSupplierDetailsModalLabel" 
        aria-hidden="true"
    >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ backgroundColor:'#ffff' }}>
                <div className="modal-header">
                    <h3 className='modal-supplier-title'>Edit Supplier Details</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                    <div className='col-md-12 row'>
                        <div className="modal-body">
                            <div style={{ display:'flex', flexFlow:'row' }}>
                                <div className="col-md-12 supplier-details-container">
                                    <div className="col-md-3">
                                        <label className="form-label">ID Number</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="exampleFormControlInput1" 
                                            value={IDNumber}
                                            onChange={(e) => setIDNumber(e.target.value)}
                                        />
                                        <label className="form-label">Shop</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="exampleFormControlInput1"
                                            value={shopName}
                                            onChange={(e) => setShopName(e.target.value)}
                                        />
                                        <label className="form-label">Address</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="exampleFormControlInput1"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        <label className="form-label">Phone Number</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="exampleFormControlInput1"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="exampleFormControlInput1" 
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label className="form-label">Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="exampleFormControlInput1"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label className="form-label">Confirm Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="exampleFormControlInput1"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <div style={{ marginTop:'15px' }}>
                                            <label className="col-md-8 form-label">Profile Picture</label>
                                            <label className="file-display" htmlFor="fileInput">
                                            {image && typeof image === 'object' ? (
                                                    <img src={URL.createObjectURL(image)} alt="Uploaded Image" />
                                            ) : selectedSupplier && selectedSupplier.image ? (
                                                    <img src={`https://localhost:7017/${selectedSupplier.image}`} alt="Saved Supplier Image" />
                                            ) : (
                                                    <span>Choose a file...</span>
                                            )}
                                            </label>
                                            <input 
                                                    id="fileInput"
                                                    className="hidden-file-input" 
                                                    type="file" 
                                                    accept="image/png, image/jpg, image/gif, image/jpeg, image/heic"
                                                    onChange={handleImageUpdate}
                                            />
                                        </div> 
                                        <label className="form-label">Status</label>
                                        <div className="form-check form-switch" style={{ marginLeft:'15px' }}>
                                            <label className="switch" role="switch">
                                                    <input 
                                                            type="checkbox" 
                                                            checked={selectedSupplier ? selectedSupplier.isActive : false}
                                                            onChange={handleDeactivateActivate}
                                                    />
                                                    <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>         
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="modal-footer">
                    <div className="d-grid gap-2 col-3 mx-auto">
                        <button type="button" className="btn btn-lg btn-primary" onClick={handleUpdateSupplier}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div 
        className="add-supplier-modal modal fade" 
        id="addSupplierModal" 
        data-bs-backdrop="static" 
        data-bs-keyboard="false" 
        tabIndex={-1} 
        aria-labelledby="addSupplierModalLabel" 
        aria-hidden="true"
    >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ backgroundColor:'#ffff' }}>
                <div className="add-supplier-modal-header modal-header">
                    <h3 className='modal-supplier-title'>Add Supplier Details</h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className='col-md-12 row'>
                    <div className="modal-body">
                        <div style={{ display:'flex', flexFlow:'row' }}>
                            <div className="col-md-12 supplier-details-container" style={{ display:'flex', flexFlow:'row', gap:'15em'}}>
                                <div className="col-md-3">
                                    <label className="form-label">ID Number</label>
                                    <input type="number" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleIDNumber(e.target.value)}/>
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleFirstName(e.target.value)}/>
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleLastName(e.target.value)}/>
                                    <label className="form-label">Shop</label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleShopeName(e.target.value)}/>
                                    <label className="form-label">Address</label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleAddress(e.target.value)}/>
                                    <label className="form-label">Phone Number</label>
                                    <input type="number" className="form-control" id="exampleFormControlInput1" onChange={(e) => handlePhoneNumber(e.target.value)}/>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" onChange={(e) => handleEmail(e.target.value)}/>
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" id="exampleFormControlInput1" onChange={(e) => handlePassword(e.target.value)}/>
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="exampleFormControlInput1" onChange={(e) => handleConfirmPassword(e.target.value)}/>
                                    <div style={{ marginTop:'15px' }}>
                                    <label className="col-md-8 form-label">Profile Picture</label>
                                    <input className="upload-profile-btn" type="file" accept="image/png, image/jpg, image/gif, image/jpeg, image/heic" onChange={handleImageChange}/>
                                    </div>
                                </div>         
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="d-grid gap-2 col-3 mx-auto">
                        <button type="button" className="btn btn-lg btn-primary" onClick={handleAddSupplier}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>     
</div>
}

export default Add_supplier