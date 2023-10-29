import './suppliers.css'
import supplierIcon from "../../assets/images/icons/supplier-2.png"
import validIcon from "../../assets/images/icons/accept.png"
import invalidIcon from "../../assets/images/icons/remove.png"
import shopProf from "../../assets/images/imageprofile.jpeg"

function Suppliers () {
    return <div className="view-suppliers-main-container">
    <div className='view-supp-header'>
        <div className='filter-suppliers-container'>
        <h2 style={{ borderRight:'solid 2px', padding:'15px' }}>
            <img className='supp-icon' src={ supplierIcon }/>
            Suppliers</h2>
            <div className='status-filter-container'>
            <h3
            style={{ marginRight:'30px', color:'#020654' }}
            >Sort by</h3>
                <label className='supplierStatus-label' htmlFor="status">Status:</label>
                <select
                style={{ padding: '10px', border: '2px solid white' }}
                name="supplierStatus" id="status">
                    <option value="Select Status">Select Status</option>
                    <option value="Validated">Validated</option>
                    <option value="Invalid">Invalid</option>
                </select>
            </div>

            <div className='department-filter-container'>
                <label className='supplierDepartment-label' htmlFor="status">Department:</label>
                <select
                style={{ padding: '10px', border: '2px solid white' }}
                name="supplierStatus" id="status">
                    <option value="Select Status">Select Department</option>
                    <option value="Validated">College of Computer Studies</option>
                    <option value="Invalid">Criminology</option>
                </select>
            </div>

        </div>
    </div>

   <div className='supplier-list-wrapper'>
        {/* SUPPLIERS LIST */}
        <table className="table table-hover">
    <thead className='table-dark'>
        <tr>
        <th scope="col">Store ID</th>
            <th scope="col">Shop</th>
            <th scope="col">Email</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Address</th>
            <th scope="col">Status</th>
            <th scope="col">Validation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <th scope="row" data-bs-toggle="modal" data-bs-target="#supplierInfoModal">1</th>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Mark</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">@mdo</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td><button className='validation-btn-supp'>
            <img className='validation-icon' src={ validIcon }/>
            Validated</button></td>
        </tr>
        <tr>
        <th scope="row" data-bs-toggle="modal" data-bs-target="#supplierInfoModal">1</th>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Mark</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">@mdo</td>
        <td data-bs-toggle="modal" data-bs-target="#supplierInfoModal">Otto</td>
        <td><button className='validation-btn-supp'>
            <img className='validation-icon' src={ invalidIcon }/>
            Invalid</button></td>
        </tr>
    </tbody>
    </table>
   </div>

   {/* SUPPLIER INFO MODAL */}
    <div className="modal fade" id="supplierInfoModal" tabIndex={-1} aria-labelledby="supplierInfoModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Supplier Details</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className='supplier-profile-container'>
                        <img className='shop-profile-img' src={ shopProf } alt="supplier profile picture" />
                        <div className='supplier-text-info'>
                            <h1 style={{ marginBottom:'20px' }}>Example Shop Name</h1>
                            <div className='supplier-info-container'>
                                <div className='supplier-info-labels'>
                                    <h5>Store ID:</h5>
                                    <h5>Status:</h5>
                                    <h5>Address:</h5>
                                    <h5>Email:</h5>
                                    <h5>Phone Number:</h5>
                                </div>
                                <div className='supplier-text-2'>
                                    <h5 className='info-2-supp'>1234</h5>
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
                                View Permits
                        </button>
                        <div className="collapse" id="collapsePermit" style={{ marginRight:'15px' }}>
                                <div className="card card-body">
                                    <a className='permits-link' href="">BIR Permit</a>
                                    <a className='permits-link' href="">City Permit</a>
                                    <a className='permits-link' href="">School Permit</a>
                                </div>
                            </div>
                        <button className="col-md-12 edit-supplier-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseChangePass" aria-expanded="false" aria-controls="collapseExample">
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

export default Suppliers