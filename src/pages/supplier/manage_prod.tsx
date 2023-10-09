// import product2 from "../../assets/images/shop_products/product2.png"
import './manage_prod.css'

function Manage_Prod () {
    return <div className="supplier-prod-main-container">
        <h1 className="supplierShop-title">Manage Products</h1>
        <button className="button" type="button" data-bs-toggle="modal" data-bs-target="#addProdModal">
        <span className="button__text">Add Product</span>
        <span className="button__icon"><svg className="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg></span>
        </button>

        {/* product filter */}
<div className="supplierShop-filter-container">
    <div className="shop-sort-container" style={{ width:'1000px'}}>
        <h5>Sort by:</h5>
        <div className='filterShop-container-shop'>
            <div className="container">
                        <form  style={{ display:'flex', flexFlow:'row', gap:'10px' }}>
                            <label>
                                <input type="radio" name="radio"/>
                                <span>Male</span>
                            </label>
                            <label>
                                <input type="radio" name="radio"/>
                                <span>Female</span>
                            </label>
                            <label>
                                <input type="radio" name="radio"/>
                                <span>Unisex</span>
                            </label>
                        </form>
            </div>
            <div className='type-container'>
                <h5 style={{ marginRight:'5px' }}>Type: </h5>
                <select className="shop-form-select" style={{ width:'200px', fontSize:'20px' }}>         
                    <option value="1">School Uniform</option>
                    <option value="2">Department Shirt</option>
                    <option value="3">Event Shirt</option>
                    <option value="4">Accessories</option>
                    <option value="5">ID Sling</option>
                </select>
            </div>
            <div className='col-md-5 search-shop-container' style={{  display:'flex', flexFlow:'row' }}>
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="col-md-3 btn btn-outline-primary" type="submit">Search</button>
            </div>
        </div>
    </div>

        
</div>


            {/* product table list */}
<div className="col-md-10 supplier-prodTable-container">
    <div className='supplier-table-wrapper table-responsive-sm' style={{ marginTop:'20px'}}>
        <table className="table table-hover table-striped align-middle caption-bot table-xl">
            <caption>end of list of products</caption>
            <thead className='table-dark align-middle'>
                <tr className='thead-row'>
                <th scope="col">Product ID</th>
                <th scope="col">Product Name</th>
                <th scope="col">Stocks available</th>
                <th scope="col">Price</th>
                <th scope="col">Type</th>
                <th scope="col">Department</th>
                <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                <tr id="editProdBtn" data-bs-toggle="modal"
                        data-bs-target="#editProdModal">
                <th scope="row">3945893</th>
                <td>Department Shirt Set B</td>
                <td>4800</td>
                <td>250</td>
                <td>T-Shirt</td>
                <td>Computer Studies</td>
                <td>Activated</td>
                </tr>
                <tr id="editProdBtn" data-bs-toggle="modal"
                        data-bs-target="#editProdModal">
                <th scope="row">547562</th>
                <td>Department Shirt Set A</td>
                <td>4800</td>
                <td>250</td>
                <td>T-Shirt</td>
                <td>Computer Studies</td>
                <td>Deactivated</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


    {/* add product modal */}

    <div className="supplier-addProd modal fade" id="addProdModal" tabIndex={-1} aria-aria-labelledby="addProdModalLabel" aria-hidden='true'>
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="modal-title" id="addProdModalLabel" style={{ fontWeight:'700', fontSize:'30px', color:'#020654' }}>Add Product Details</span>
                    <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ display:'flex', justifyContent:'center', flexFlow:'column', alignItems:'center' }}>
                    <div className="details-main-container">
                        <div className="addProd-img-container">
                            {/* <img className="prod-img" src={ product2 }/> */}
                        </div>
                        <div className="details-main">
                            <div className="col-md-12 addProd-details-container">
                                <div className="col-md-4 details-1">
                                    <label className="details-label" htmlFor="prodName">Product Name:</label>
                                    <input className="details-input" type="text" id="prodName"/>
                                    <label className="details-label" htmlFor="prodPrice">Price:</label>
                                    <input className="details-input" type="text" id="prodPrice"/>
                                    <label className="details-label" htmlFor="prodType">Type:</label>
                                    {/* prod type */}
                                    <select className="form-select select" style={{ marginBottom:'20px' }}>         
                                        <option value="1">School Uniform</option>
                                        <option value="2">Department Shirt</option>
                                        <option value="3">Event Shirt</option>
                                        <option value="4">Accessories</option>
                                        <option value="5">ID Sling</option>
                                    </select>
                                    {/* department */}
                                    <label className="details-label" htmlFor="Department">Department:</label>
                                    <div className='col-md-12' >
                                        <select className="form-select select" style={{ marginTop:'5px', marginBottom:'20px' }} id="Department">
                                            <option selected>Select a department</option>
                                            <option value="1">Senior High School</option>
                                            <option value="2">Elementary and Junior High School</option>
                                            <option value="3">Criminology</option>
                                            <option value="4">Nursing</option>
                                            <option value="5">Allied Engineering</option>
                                            <option value="6">Customs Management</option>
                                            <option value="7">Computer Studies</option>
                                            <option value="8">Marine Transportation</option>
                                            <option value="9">Teacher Education</option>
                                            <option value="10">Marine Engineering</option>
                                            <option value="11">Computer Studies</option>
                                            <option value="12">Hotel and Tourism Management</option>
                                        </select>
                                    </div>
                                    {/* end of details-1 */}
                                </div>
                                <div className="details-2">
                                    {/* available sizes */}
                                <label className="details-label">Sizes Available:</label>
                                    <div className="sizes-prod-main-container">
                                    <div className="sizes-1">
                                        <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="18"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">18</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-18" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="20"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">20</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-20" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="S"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">S</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-S" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="M"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">M</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-M" />
                                            </div>
                                    </div>
                                        
                                        <div className="sizes-2">
                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="L"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">L</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-L" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-XL" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="2XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">2XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-2XL" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="3XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">3XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-3XL" />
                                            </div>

                                        </div>
                                    </div>
                                    {/* end of details-2 */}
                                </div>                           
                            </div>
                        </div>
                    </div>

                    <label className="details-label" htmlFor="prodStatus">Status:</label>
                        <div className="form-check form-switch" style={{ marginLeft:'15px' }}>
                            <label className="switch" role="switch">
                                <input type="checkbox"/>
                                <span className="slider"></span>
                            </label>
                        </div>
                </div>
                {/* modal footer */}
                <div className="modal-footer">
                    <button className="proceed-Btn"data-bs-toggle="modal" data-bs-target="#informModal">
                    Save
                    </button>
                </div>
            </div>
        </div>
    </div>


    {/* EDIT product modal */}

    <div className="supplier-editProd modal fade" id="editProdModal" tabIndex={-1} aria-aria-labelledby="editProdModalLabel" aria-hidden='true'>
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="modal-title" id="addProdModalLabel" style={{ fontWeight:'700', fontSize:'30px', color:'#020654' }}>Edit Product Details</span>
                    <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ display:'flex', justifyContent:'center', flexFlow:'column', alignItems:'center' }}>
                    <div className="details-main-container">
                        <div className="addProd-img-container">
                            {/* <img className="prod-img" src={ product2 }/> */}
                        </div>
                        <div className="details-main">
                            <div className="col-md-12 addProd-details-container">
                                <div className="col-md-4 details-1">
                                    <label className="details-label" htmlFor="prodName">Product Name:</label>
                                    <input className="details-input" type="text" id="prodName"/>
                                    <label className="details-label" htmlFor="prodPrice">Price:</label>
                                    <input className="details-input" type="text" id="prodPrice"/>
                                    <label className="details-label" htmlFor="prodType">Type:</label>
                                    {/* prod type */}
                                    <select className="form-select select" style={{ marginBottom:'20px' }}>         
                                        <option value="1">School Uniform</option>
                                        <option value="2">Department Shirt</option>
                                        <option value="3">Event Shirt</option>
                                        <option value="4">Accessories</option>
                                        <option value="5">ID Sling</option>
                                    </select>
                                    {/* department */}
                                    <label className="details-label" htmlFor="Department">Department:</label>
                                    <div className='col-md-12' >
                                        <select className="form-select select" style={{ marginTop:'5px', marginBottom:'20px' }} id="Department">
                                            <option selected>Select a department</option>
                                            <option value="1">Senior High School</option>
                                            <option value="2">Elementary and Junior High School</option>
                                            <option value="3">Criminology</option>
                                            <option value="4">Nursing</option>
                                            <option value="5">Allied Engineering</option>
                                            <option value="6">Customs Management</option>
                                            <option value="7">Computer Studies</option>
                                            <option value="8">Marine Transportation</option>
                                            <option value="9">Teacher Education</option>
                                            <option value="10">Marine Engineering</option>
                                            <option value="11">Computer Studies</option>
                                            <option value="12">Hotel and Tourism Management</option>
                                        </select>
                                    </div>
                                    {/* end of details-1 */}
                                </div>
                                <div className="details-2">
                                    {/* available sizes */}
                                <label className="details-label">Sizes Available:</label>
                                    <div className="sizes-prod-main-container">
                                    <div className="sizes-1">
                                        <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="18"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">18</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-18" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="20"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">20</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-20" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="S"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">S</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-S" />
                                            </div>

                                            <div className="content">
                                            <label className="checkBox">
                                                <input type="checkbox" id="M"/>
                                                <div className="transition"></div>
                                            </label>
                                            <span className="sizes">M</span>
                                            <input className="col-md-5 stocks-size" type="number" id="stocks-M" />
                                            </div>
                                    </div>
                                        
                                        <div className="sizes-2">
                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="L"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">L</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-L" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-XL" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="2XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">2XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-2XL" />
                                            </div>

                                            <div className="content">
                                                <label className="checkBox">
                                                    <input type="checkbox" id="3XL"/>
                                                    <div className="transition"></div>
                                                </label>
                                                <span className="sizes">3XL</span>
                                                <input className="col-md-5 stocks-size" type="number" id="stocks-3XL" />
                                            </div>

                                        </div>
                                    </div>
                                    {/* end of details-2 */}
                                </div>                           
                            </div>
                        </div>
                    </div>

                    <label className="details-label" htmlFor="prodStatus">Status:</label>
                        <div className="form-check form-switch" style={{ marginLeft:'15px' }}>
                            <label className="switch" role="switch">
                                <input type="checkbox"/>
                                <span className="slider"></span>
                            </label>
                        </div>
                </div>
                {/* modal footer */}
                <div className="modal-footer">
                    <button className="proceed-Btn"data-bs-toggle="modal" data-bs-target="#informModal">
                    Save
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    </div>
}

export default Manage_Prod