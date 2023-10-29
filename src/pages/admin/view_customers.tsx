import './view_customers.css'
import Profile from "../../assets/images/imageprofile.jpeg"
import customerIcon from "../../assets/images/icons/male-student.png"
import validIcon from "../../assets/images/icons/accept.png"
import invalidIcon from "../../assets/images/icons/remove.png"
import shopProf from "../../assets/images/imageprofile.jpeg"
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function View_Customers () {

  //   const [customer, setCustomer] = useState([]);
  //   const [selectedCustomer, setSelectedCustomer] = useState(null);
  //   const [departments, setDepartments] = useState([]);
  //   const [, setCustomerIsValid] = useState<boolean>(false);
  //   const [showPassword, setShowPassword] = useState(false);

  //   useEffect(() => {
  //     axios.get('https://localhost:7017/Users/getCustomers')
  //       .then(response => {
  //         setCustomer(response.data);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       })
  //   });

  //   useEffect(() => {
  //     axios.get('https://localhost:7017/Department')
  //         .then(res => {
  //             setDepartments(res.data);
  //         })
  //         .catch((err) => {console.error(err)
  //     });
  // }, []);

  //   const getDepartmentName = (departmentId) => {
  //     const department = departments.find(d => d.departmentId === departmentId);
  //     return department ? department.department_Name : 'Unknown Department';
  // };

  // const handleValidation = (customerId: number, currentStatus: boolean) => {
  //   const newValidationStatus = !currentStatus;

  //   axios.put(`https://localhost:7017/Users/validate/${customerId}`, { isValidate: newValidationStatus }, {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     if (response.status === 200) {
  //       toast.success("Validated");
  //       setCustomerIsValid(newValidationStatus);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     toast.error('Network error or server not responding');
  //   });
  // };


  //   return <div className="customers-container">
  //       <div className='supplier-table-container'>
  //       <div className='admin-supplierTitle-container'>
  //       <h1 className='customers-title'>CUSTOMERS</h1>
  //       </div>
  //       <div className='col-md-12 search-admin-container'>
  //       <div className='col-md-5' style={{ display:'flex', flexFlow:'row'}}>
                
  //       <input className="form-control me-1" type="search" placeholder="search shop name" aria-label="Search"/>
  //       <button className="col-md-3 btn btn-outline-primary" type="submit">Search</button>
  //       </div>
  //       <div className='status-filter-container'>
  //       <button className="btn btn-secondary dropdown-toggle dropdown-menu-dark" style={{ backgroundColor:'#020654' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
  //         Filter by Status
  //       </button>
  //       <ul className="dropdown-menu dropdown-menu-dark" style={{ backgroundColor:'#020654' }}>
  //       <li><a className="dropdown-item">Activated</a></li>
  //       <li><a className="dropdown-item">Deactivated</a></li>
  //       </ul>
  //       </div>
  //       </div>
        


  //       <div className='admin-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
  //       <table className="customer-table table table-hover table-bordered align-middle caption-bot table-xl">
  //       <caption>end of list of customers</caption>
  //       <thead className='table-dark align-middle'>
  //           <tr className='thead-row'>
  //           <th scope="col">Customer ID</th>
  //           <th scope="col">First Name</th>
  //           <th scope="col">Last Name</th>
  //           <th scope="col">Department</th>
  //           <th scope="col">Email</th>
  //           <th scope="col">Phone Number</th>
  //           <th scope="col">Status</th>
  //           <th scope='col'>Validation</th>
  //           </tr>
  //       </thead>
  //       <tbody className="table-group-divider">
  //       {customer.map((c, index) => (
  //           <tr key={index}>
  //           <th 
  //             scope="row"id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.id}
  //           </th>
  //           <td
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.firstName}
  //           </td>
  //           <td 
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.lastName}
  //           </td>
  //           <td 
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {getDepartmentName(c.departmentId)}
  //           </td>
  //           <td 
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.email}
  //           </td>
  //           <td 
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.phoneNumber}
  //           </td>
  //           <td
  //             id="offcanvasButton" 
  //             data-bs-toggle="offcanvas"
  //             data-bs-target="#CustomerOffcanvasRight"
  //             aria-controls="offcanvasRight"
  //             onClick={() => setSelectedCustomer(c)}
  //           >
  //             {c.isActive ? 'Activated' : 'Deactivated'}
  //           </td>
  //           <td>
  //             <div>
  //               <button 
  //                 className={`btn btn-sm ${c.isValidate ? 'btn-success' : 'btn-danger'}`}
  //                 onClick={() => handleValidation(c.id, c.isValidate)}
  //               >
  //                 {c.isValidate ? 'Valid' : 'Invalid'}
  //               </button>
  //             </div>
  //           </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //       </table>
  //       </div>
  //       </div>

  //       <div className="customer-offcanvas offcanvas offcanvas-end" tabIndex={-1} id="CustomerOffcanvasRight" aria-labelledby="offcanvasRightLabel">
  //       <div className="offcanvas-header">
  //         <h5 className="offcanvas-title" id="offcanvasRightLabel">
  //         <div className="supplier-info-group">
  //           {selectedCustomer && (
  //             <>
  //               <span className="supplier-info-label">Customer ID:</span>
  //               <p className="supplier-info">{selectedCustomer.id}</p>
  //             </>
  //           )}
  //         </div>
  //         </h5>
  //         <div data-bs-theme="dark">
  //           <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  //         </div>
  //       </div>
  //       <div className="offcanvas-body">
  //         {selectedCustomer && (
  //           <>
  //           <div className="profile-pic-container" style={{ padding:'20px' }}>
  //             <img className="mx-auto d-block" src={ Profile } style={{ height:'120px', width:'120px', borderStyle:'solid', borderRadius:"50%", borderColor:'white' }}/>
  //           </div>
  //             <span className="supplier-Status">
  //               Status: {selectedCustomer ? selectedCustomer.isActive ? "Activated" : "Deactivated" : ""}
  //             </span>
  //             <img src="" alt="" />
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 First Name:
  //               </span>
  //               <p className="supplier-info">
  //                 {selectedCustomer ? selectedCustomer.firstName : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 Last Name:
  //               </span>
  //               <p className="supplier-info">
  //               {selectedCustomer ? selectedCustomer.lastName : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 Gender:
  //               </span>
  //               <p className="supplier-info">
  //               {selectedCustomer ? selectedCustomer.gender : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 Department:
  //               </span>
  //               <p className="supplier-info">
  //               {selectedCustomer ? getDepartmentName(selectedCustomer.departmentId) : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 Email:
  //               </span>
  //               <p className="supplier-info">
  //               {selectedCustomer ? selectedCustomer.email : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //               <span className="supplier-info-label">
  //                 Phone number:
  //               </span>
  //               <p className="supplier-info">
  //               {selectedCustomer ? selectedCustomer.phoneNumber : ""}
  //               </p>
  //             </div>
  //             <div className="supplier-info-group">
  //                 <span className="supplier-info-label">
  //                     Password:
  //                 </span>
  //                 <p className="supplier-info">
  //                     {selectedCustomer ? (showPassword ? selectedCustomer.password : selectedCustomer.password.replace(/./g, '*')) : ""}
  //                 </p>
  //                 <button className='showButtonPassword' onClick={() => setShowPassword(!showPassword)}>
  //                     {showPassword ? 'Hide' : 'Show'}
  //                 </button>
  //             </div>
  //           </>
  //           )}
  //       </div>
  //     </div>
  //   </div>

  // NEW CODE
  return   <div className="view-customers-main-container">
  <div className='view-supp-header'>
      <div className='filter-customers-container'>
      <h2 style={{ borderRight:'solid 2px', padding:'15px' }}>
          <img className='supp-icon' src={ customerIcon }/>
          Customers</h2>
          <div className='customer-status-filter-container'>
          <h3
          style={{ marginRight:'30px', color:'#020654' }}>Sort by</h3>
              <label className='customerStatus-label' htmlFor="status">Status:</label>
              <select
              style={{ padding: '10px', border: '2px solid white' }}
              name="customerStatus" id="status">
                  <option value="Select Status">Select Status</option>
                  <option value="Validated">Validated</option>
                  <option value="Invalid">Invalid</option>
              </select>
          </div>

          <div className='gender-filter-container'>
            <label className='customerGender-label' htmlFor="status">Gender:</label>
                <select
                style={{ padding: '10px', border: '2px solid white' }}
                name="customerStatus" id="status">
                    <option value="Select Status">Select Gender</option>
                    <option value="Validated">Male</option>
                    <option value="Invalid">Female</option>
                </select>
          </div>

          <div className='department-filter-container'>
              <label className='customerDepartment-label' htmlFor="status">Department:</label>
              <select
              style={{ padding: '10px', border: '2px solid white' }}
              name="customerStatus" id="status">
                  <option value="Select Status">Select Department</option>
                  <option value="Validated">College of Computer Studies</option>
                  <option value="Invalid">Criminology</option>
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
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Gender</th>
          <th scope="col">Department</th>
          <th scope="col">Email</th>
          <th scope="col">Phone Number</th>
          <th scope="col">Status</th>
          <th scope="col">Validation</th>
      </tr>
  </thead>
  <tbody>
      <tr>
      <th scope="row" data-bs-toggle="modal" data-bs-target="#customerInfoModal">1</th>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Mark</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Mark</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">@mdo</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">@mdo</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td><button className='validation-btn-supp'>
          <img className='validation-icon' src={ validIcon }/>
          Validated</button></td>
      </tr>
      <tr>
      <th scope="row" data-bs-toggle="modal" data-bs-target="#customerInfoModal">1</th>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Mark</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Mark</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">@mdo</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">@mdo</td>
      <td data-bs-toggle="modal" data-bs-target="#customerInfoModal">Otto</td>
      <td><button className='validation-btn-supp'>
          <img className='validation-icon' src={ invalidIcon }/>
          Invalid</button></td>
      </tr>
  </tbody>
  </table>
 </div>

 {/* SUPPLIER INFO MODAL */}
  <div className="modal fade" id="customerInfoModal" tabIndex={-1} aria-labelledby="customerInfoModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
              <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Customer Details</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                  <div className='supplier-profile-container'>
                      <img className='customer-profile-img' src={ shopProf } alt="supplier profile picture" />
                      <div className='supplier-text-info'>
                          <h1 style={{ marginBottom:'20px' }}>First Name Last Name</h1>
                          <div className='supplier-info-container'>
                              <div className='supplier-info-labels'>
                                  <h5>Customer ID:</h5>
                                  <h5>Gender:</h5>
                                  <h5>Status:</h5>
                                  <h5>Department:</h5>
                                  <h5>Address:</h5>
                                  <h5>Email:</h5>
                                  <h5>Phone Number:</h5>
                              </div>
                              <div className='supplier-text-2'>
                                  <h5 className='info-2-supp'>1234</h5>
                                  <h5 className='info-2-supp'>Example Gender</h5>
                                  <h5 className='info-2-supp'>Example Department</h5>
                                  <h5 className='info-2-supp'>Validated</h5>
                                  <h5 className='info-2-supp'>Example Address</h5>
                                  <h5 className='info-2-supp'>exampleEmail@gmail.com</h5>
                                  <h5 className='info-2-supp'>0912334543</h5>
                              </div>
                          </div>
                      </div>
                  </div>

                          {/* EDIT SUPPLIER COLLAPSE BUTTON */}
                      <button className="col-md-12 edit-supplier-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePermit" aria-expanded="false" aria-controls="collapseExample">
                              View Study Load
                      </button>
                      <div className="collapse" id="collapsePermit" style={{ marginRight:'15px' }}>
                              <div className="card card-body">
                                  <a className='permits-link' href="">Study Load</a>
                              </div>
                          </div>
                      <button className="col-md-12 edit-customer-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseChangePass" aria-expanded="false" aria-controls="collapseExample">
                              Change Password
                      </button>
                          <div className="collapse" id="collapseChangePass" style={{ marginRight:'15px' }}>
                              <div className="card card-body">
                                  <label className='changePassLabel' htmlFor="changePass">New Password</label>
                                  <input className='input-changePass' type="text" 
                                  placeholder='Password must be at least 6 characters long.' 
                                  name="changePass" id="changePass" />

                                  <label className='changePassLabel' htmlFor="changePass"
                                  style={{ marginTop:'10px' }}
                                  >Confirm Password</label>
                                  <input className='input-changePass' type="text" 
                                  placeholder='Re-type New Password' 
                                  name="changePass" id="changePass" />

                                  <div className='saveChanges-btn-container'>
                                      <button className='saveChanges-btn'>Save Changes</button>
                                  </div>
                              </div>
                          </div>
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