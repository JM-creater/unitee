import './App.css'
import Login from './pages/login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import NotFound from './pages/common/not-found'
import Main from './pages/main/main'
// import Home from './pages/main/home'
import Shop from './pages/main/shop'
import Search_Product from './pages/main/search_product'
import Cart from './pages/main/cart'
import Order_Tracking from './pages/main/order_tracking'
import User_Profile from './pages/main/user_profile'
import Visit_Shop from './pages/main/visit_shop'
//import Supplier from './pages/supplier/supplier_items'
import Add_item from './pages/supplier/add_item'
import Update_item from './pages/supplier/update_item'
import Admin_Dashboard from './pages/admin/admin-dashboard'
import Suppliers from './pages/admin/suppliers'
import Add_supplier from './pages/admin/add_supplier'
import View_Customers from './pages/admin/view_customers'
import Admin_Shops from './pages/admin/admin_shops'
import Admin_Main from './pages/admin/admin_main'
import Admin_Reports from './pages/admin/admin_reports'
import Purchase_History from './pages/main/purchase_history'
import AccountType from './pages/accountType'
import Notif from './pages/main/notif'
//import Manage_Prod from './pages/supplier/manage_prod'
import Supplier_Order from './pages/supplier/supplier_orders'
import { ToastContainer } from 'react-toastify'
import RegisterSupplier from './pages/register_supplier'
import Manage_Shop from './pages/supplier/manage_shop'
import Supplier_Main from './pages/supplier/supplier_main'
import Supplier from './pages/supplier/supplier_dashboard'
import Reports from './pages/supplier/reports'
import Forgot_Password from './pages/forgot_password'
// import Unauthorized_Error from './pages/common/unauthorized_error'
// import Internal_Error from './pages/common/internal_error'
// import Bad_Request from './pages/common/bad_request'


function App() {
  return (
    <div>
      <ToastContainer 
        position="top-center" 
        autoClose={800} 
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="custom-toast"
      />
      <Router>
        <Routes>
          <Route index element={ <Login/> }/>
          <Route path='/accountType' element={ <AccountType /> }/>
          <Route path='/register' element={ <Register/> }/>
          <Route path='/register_supplier' element={ <RegisterSupplier/> }/>
          <Route path='/forgot_password' element={ <Forgot_Password/> }/>
          <Route path='/shop/:userId' element={ <Main/> }>
            {/* <Route index element={ <Home/> }/> */}
             {/* CUSTOMER */}
            <Route index element={ <Shop/> }/>
            <Route path='visit_shop/:id' element={ <Visit_Shop/> }/>
            <Route path='cart' element={ <Cart/> }/>
            <Route path='search_product' element={ <Search_Product/> }/>
            <Route path='user_profile/:id' element={ <User_Profile/> }></Route>
            <Route path='notif' element={ <Notif/> }></Route>
            <Route path='order_tracking' element={ <Order_Tracking/> }></Route>
            <Route path='purchase_history' element={ <Purchase_History/> }></Route>
            <Route path='notif' element={ <Notif/> }></Route>
            {/* <Route path='/main/:id' element={ <Main/> }></Route>   */}
          </Route>
          
          {/* ADMIN */}
          <Route path='admin_dashboard/:id' element={ <Admin_Main/> }>
            <Route index element={ <Admin_Dashboard /> } />
            <Route path='suppliers' element={ <Suppliers/> }></Route>
            <Route path='view_customers' element={ <View_Customers/> }/>
            <Route path='admin_reports' element={ <Admin_Reports/> }/>
            <Route path='admin_shops' element={ <Admin_Shops/> }/>
            <Route path='add_supplier' element={ <Add_supplier/> }/>
          </Route>
          
          {/* SUPPLIER */}
          <Route path='supplier_dashboard/:id' element={ <Supplier_Main/> }>
            <Route index element={ <Supplier/> }/>
            <Route path='supplier_orders' element={ <Supplier_Order/> }/>
            <Route path='manage_shop' element={ <Manage_Shop/> }/>
            <Route path='reports' element={ <Reports/> }/>
          </Route>

          <Route path='/update_item/:id/:productId' element={ <Update_item/> }></Route>

          {/* <Route path='supplier_items/:id' element={ <Supplier/> }></Route> */}

          <Route path='/add_item/:id' element={ <Add_item/> }></Route>

          {/* ERROR WEBPAGES        */}
          <Route path='*' element={ <NotFound/> }/>
          {/* <Route path='*' element={ <Unauthorized_Error/> }/> */}
          {/* <Route path='*' element={ <Internal_Error/> }/> */}
          {/* <Route path='*' element={ <Bad_Request/> }/> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
