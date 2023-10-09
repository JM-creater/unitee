import logo from '../../assets/images/unitee.png'
import './header.css'

function Header() {
    return (
        <div className='header-container'>
            <img src={logo} className='logo'/>
        </div>
    )
}

export default Header