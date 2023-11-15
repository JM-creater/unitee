import './view_customers.css'
import customerIcon from "../../assets/images/icons/male-student.png"
import validIcon from "../../assets/images/icons/accept.png"
import invalidIcon from "../../assets/images/icons/remove.png"
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import validationEventEmitter from '../../helpers/ValidationEmitter'
import registerUsersEventEmitter from '../../helpers/RegisterUsersEmitter'

function View_Customers () {

    const [customer, setCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [, setCustomerIsValid] = useState<boolean>(false);

    // * Filtered By Status, Gender, Departments
    const filteredCustomers = customer.filter((customerItem) => {
        const matchesStatus = selectedStatus === 'All' || (customerItem.isValidate ? 'Validated' : 'Invalid') === selectedStatus;
        const matchesGender = selectedGender === 'All' || customerItem.gender === selectedGender;
        const matchesDepartment = selectedDepartments === 'All' || customerItem.departmentId === parseInt(selectedDepartments);

        return matchesStatus && matchesGender && matchesDepartment;
    });

    // * Get All Customers with Event Emitter
    useEffect(() => {
        const validationRequest = async () => {
            try {
                const response = await axios.get('https://localhost:7017/Users/getCustomers');
                setCustomer(response.data);
            } catch (error) {
                toast.error('Network error or server not responding');
            }
        };
        const validationListener = () => {
            validationRequest();
        };
    
        validationEventEmitter.on("validInvalid", validationListener);
        registerUsersEventEmitter.on("registerCustomer", validationListener)
        validationRequest();
    
        return () => {
            validationEventEmitter.off("validInvalid", validationListener);
            registerUsersEventEmitter.off("registerCustomer", validationListener)
        };
    }, []);
    

    // * Windows Event Listener Focus
    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get('https://localhost:7017/Users/getCustomers');
                setCustomer(response.data);
            } catch (error) {
                toast.error('Network error or server not responding');
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

    // * Get All Departments
    useEffect(() => {
        axios.get('https://localhost:7017/Department')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error(error)
            }
        );
    }, []);

    // * Get the Department Name
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.departmentId === departmentId);
        return department ? department.department_Name : 'Unknown Department';
    };

    // * Validation for Customers
    const handleValidation = async (customerId: number, currentStatus: boolean, activeStatus: boolean) => {
        const newValidationStatus = !currentStatus;
        const newIsActive = !activeStatus;

        try {
            const response = await axios.put(`https://localhost:7017/Users/validateCustomer/${customerId}`, { isValidate: newValidationStatus, isActive: newIsActive }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setCustomerIsValid(newValidationStatus);
                setCustomerIsValid(newIsActive);
                validationEventEmitter.emit("validInvalid");
                toast.success("Successfully Updated the Password");
            } else {
                toast.error(response.data.message);
            }
        }  catch (error) {
            toast.error('Network error or server not responding');
        }
    };

    // * Update Password
    const handleUpdatePassword = async (customerId) => {
        if (!newPassword) {
            toast.error("New Password must be required");
            return;
        }

        if (!confirmPassword) {
            toast.error("Confirm Password must be required");
            return;
        }

        if (newPassword === confirmPassword) {
            try {
                const response = await axios.put(`https://localhost:7017/Supplier/updatePassword/${customerId}`, { Password: newPassword }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    setNewPassword("");
                    setConfirmPassword("");
                    validationEventEmitter.emit("validInvalid");
                    toast.success("Successfully Updated the Password");
                } else {
                    toast.error(`Error: ${response.status} - ${response.data.message}`);
                }
            } catch (error) {
                toast.error(`Network error or server not responding: ${error}`);
            }
        } else {
            toast.error("Passwords do not match");
        }
    };

    // * Reset Modal
    useEffect(() => {
        const modalElement = document.getElementById('customerInfoModal');

        const handleModalClose = () => {
            setNewPassword('');
            setConfirmPassword('');

            const collapsePermit = document.getElementById('collapsePermit');
            const collapseChangePass = document.getElementById('collapseChangePass');
            
            if (collapsePermit.classList.contains('show')) {
                collapsePermit.classList.remove('show');
            }

            if (collapseChangePass.classList.contains('show')) {
                collapseChangePass.classList.remove('show');
            }
        };

        modalElement.addEventListener('hidden.bs.modal', handleModalClose);
  
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
        };
    }, []);
    

  // NEW CODE
  return   <div className="view-customers-main-container">
  <div className='view-supp-header'>
      <div className='filter-customers-container'>
        <h2 style={{ borderRight:'solid 2px', padding:'15px' }}>
            <img className='supp-icon' src={ customerIcon }/>
            Customers
        </h2>

        <div className='customer-status-filter-container'>
            <h3 style={{ marginRight:'30px', color:'#020654' }}>Sort by</h3>
            <label className='customerStatus-label' htmlFor="status">Status:</label>
            <select
                style={{ padding: '10px', border: '2px solid white' }}
                name="customerStatus" id="status"
                onChange={(e) => setSelectedStatus(e.target.value)}
            >
                <option value="Select Status" disabled selected hidden>Select Status</option>
                <option value="All">All</option>
                <option value="Validated">Valid</option>
                <option value="Invalid">Invalid</option>
            </select>
        </div>

        <div className='gender-filter-container'>
            <label className='customerGender-label' htmlFor="status">Gender:</label>
                <select
                    style={{ padding: '10px', border: '2px solid white' }}
                    name="customerStatus" id="status"
                    onChange={(e) => setSelectedGender(e.target.value)}
                >
                    <option value="Select Status" disabled selected hidden>Select Gender</option>
                    <option value="All">All</option>
                    <option value="Validated">Male</option>
                    <option value="Invalid">Female</option>
                </select>
        </div>

        <div className='department-filter-container'>
            <label className='customerDepartment-label' htmlFor="status">Department:</label>
                <select
                    style={{ padding: '10px', border: '2px solid white' }}
                    name="customerStatus" id="status"
                    onChange={(e) => setSelectedDepartments(e.target.value)}
                >
                    <option disabled selected hidden>Select Department</option>
                    <option value="All">All</option>
                    {departments.map((department) => (
                        <option key={department.departmentId} value={department.departmentId}>
                            {department.department_Name}
                        </option>
                    ))}
            </select>
        </div>

      </div>
  </div>

 <div className='customer-list-wrapper'>
      {/* CUSTOMER LIST */}
      <table className="table table-hover">
  <thead className='table-dark'>
      <tr>
      <th scope="col">Customer ID</th>
          <th className='text-center' scope="col">First Name</th>
          <th className='text-center' scope="col">Last Name</th>
          <th className='text-center' scope="col">Gender</th>
          <th className='text-center' scope="col">Department</th>
          <th className='text-center' scope="col">Email</th>
          <th className='text-center' scope="col">Phone Number</th>
          <th className='text-center' scope="col">Status</th>
          <th className='text-center' scope="col">Validation</th>
      </tr>
  </thead>
  <tbody>
    {filteredCustomers.map(customerItem => (
        <tr key={customerItem.id}>
            <th scope="row" data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.id}</th>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.firstName}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.lastName}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.gender}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{getDepartmentName(customerItem.departmentId)}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.email}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.phoneNumber}</td>
            <td className='text-center' data-bs-toggle="modal" data-bs-target="#customerInfoModal" onClick={() => setSelectedCustomer(customerItem)}>{customerItem.isActive ? "Active" : "Not Active"}</td>
            <td className='text-center'>
                <button 
                    className={`validation-btn-supp btn btn-sm ${customerItem.isValidate ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleValidation(customerItem.id, customerItem.isValidate, customerItem.isActive)}
                >
                    <img className='validation-icon' src={customerItem.isValidate ? validIcon : invalidIcon }/>
                    {customerItem.isValidate ? 'Valid' : 'Invalid'}
                </button>
            </td>
        </tr>
    ))}
  </tbody>
  </table>
 </div>

 {/* CUSTOMER INFO MODAL */}
  <div className="modal fade" id="customerInfoModal" tabIndex={-1} aria-labelledby="customerInfoModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
              <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Customer Details</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedCustomer && (
                    <div className='supplier-profile-container'>
                        <img className='customer-profile-img' src={ `https://localhost:7017/${selectedCustomer.image}` } alt="supplier profile picture" />
                        <div className='supplier-text-info'>
                            <h1 style={{ marginBottom:'20px' }}>{selectedCustomer.firstName} {selectedCustomer.lastName}</h1>
                            <div className='supplier-info-container'>
                                <div className='supplier-info-labels'>
                                    <h5>Customer ID:</h5>
                                    <h5>Gender:</h5>
                                    <h5>Status:</h5>
                                    <h5>Department:</h5>
                                    <h5>Email:</h5>
                                    <h5>Phone Number:</h5>
                                </div>
                                <div className='supplier-text-2'>
                                    <h5 className='info-2-supp'>{selectedCustomer.id}</h5>
                                    <h5 className='info-2-supp'>{selectedCustomer.gender}</h5>
                                    <h5 className='info-2-supp'>{selectedCustomer.isActive ? "Active" : "Not Active"}</h5>
                                    <h5 className='info-2-supp'>{getDepartmentName(selectedCustomer.departmentId)}</h5>
                                    <h5 className='info-2-supp'>{selectedCustomer.email}</h5>
                                    <h5 className='info-2-supp'>{selectedCustomer.phoneNumber}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* EDIT SUPPLIER COLLAPSE BUTTON */}
                    <button className="col-md-12 edit-supplier-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePermit" aria-expanded="false" aria-controls="collapseExample">
                        View Study Load
                    </button>
                    {selectedCustomer && (
                        <div className="collapse" id="collapsePermit" style={{ marginRight:'15px' }}>
                            <div className="card card-body">
                                <a 
                                    className='permits-link' 
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={`https://localhost:7017/${selectedCustomer.studyLoad}`}
                                >
                                    <span>Study Load: </span>
                                    {selectedCustomer.studyLoad.split('\\').pop()}
                                </a>
                            </div>
                        </div>
                    )}
                    <button className="col-md-12 edit-customer-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseChangePass" aria-expanded="false" aria-controls="collapseExample">
                        Change Password
                    </button>
                        {selectedCustomer && (
                            <div className="collapse" id="collapseChangePass" style={{ marginRight:'15px' }}>
                                <div className="card card-body">
                                    <label className='changePassLabel' htmlFor="changePass">New Password</label>
                                    <input 
                                        className='input-changePass' 
                                        type="password" 
                                        placeholder='Password must be at least 6 characters long.' 
                                        name="changePass" 
                                        id="changePass" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />

                                    <label className='changePassLabel' htmlFor="changePass" style={{ marginTop:'10px' }}>Confirm Password</label>
                                    <input 
                                        className='input-changePass' 
                                        type="password" 
                                        placeholder='Re-type New Password' 
                                        name="changePass" 
                                        id="changePass"
                                        value={confirmPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />

                                    <div className='saveChanges-btn-container'>
                                        <button className='saveChanges-btn' onClick={() => handleUpdatePassword(selectedCustomer.id)}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}
              </div>
          </div>
      </div>
  </div>


    {/* CHANGE PASSWORD CONFIRMATION MODAL
    <div className="modal fade" id="changeConfirmationModal" aria-hidden="true" aria-labelledby="changeConfirmationModalLabel" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <div className="modal-header">
              <h1 className="modal-title fs-5" id="changeConfirmationModal">Modal 2</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
              Hide this modal and show the first with the button below.
          </div>
          <div className="modal-footer">
              <button className="btn btn-primary"data-bs-dismiss="supplierInfoModal" data-bs-toggle="modal">Back to first</button>
          </div>
          </div>
      </div>
  </div> */}



  
</div>
  
}

export default View_Customers