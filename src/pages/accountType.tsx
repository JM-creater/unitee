import studentPic from "../../src/assets/images/studentRole.png"
import supplierPic from "../../src/assets/images/supplierRole.png"
import "./accountType.css"

function AccountType() {

    return (
        <div className="col-md-12 role-main-container">
            <div className="col-md-6 role-1">
                <img className="student-pic" src={ studentPic } alt="" />
                <h1 className="role-text-1">Register as Customer</h1>
            </div>
            <div className="col-md-6 role-2">
                <img className="supplier-pic" src={ supplierPic } alt="" />
                <h1 className="role-text-2">Register as Supplier</h1>
            </div>
        </div>
    )
}

export default AccountType;
