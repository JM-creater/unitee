import './suppliers.css'
import supplierIcon from "../../assets/images/icons/supplier-2.png"
import validIcon from "../../assets/images/icons/accept.png"
import invalidIcon from "../../assets/images/icons/remove.png"

function Suppliers () {
    return <div className="view-suppliers-main-container">
    <div className='view-supp-header'>
        <div className='filter-suppliers-container'>
        <h2 style={{ borderRight:'solid 2px', padding:'15px' }}>
            <img className='supp-icon' src={ supplierIcon }/>
            Suppliers</h2>
            <div className='status-filter-container'>
            <h3
            style={{ marginRight:'15px', color:'#020654' }}
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
                    <option value="Validated">Validated</option>
                    <option value="Invalid">Saab</option>
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
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>Otto</td>
        <td><button className='validation-btn-supp'>
            <img className='validation-icon' src={ validIcon }/>
            Validated</button></td>
        </tr>
        <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>Otto</td>
        <td><button className='validation-btn-supp'>
            <img className='validation-icon' src={ invalidIcon }/>
            Invalid</button></td>
        </tr>
    </tbody>
    </table>
   </div>
</div>
}

export default Suppliers