import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import Cookies from 'js-cookie';
import './index.css';

const Header = () => {
  const navigate = useNavigate(); 

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
    console.log("Logged Out")
  };

  return (
    <nav className="bgHeader">
      <div className="headerSm">
        <Link className="headerLinks headerLogoBtn" to="/">
          <img
            className="headerLogo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
        <ul className="smTabsUl">
          <li className="smTabLi">
            <Link className="headerLinks" to="/">

            <FaHome className='smIcon' />
            </Link>
          </li>
          <li className="smTabLi">
            <Link className="headerLinks" to="/jobs">
              <IoBag className='smIcon' />
            </Link>
          </li>
          <li className="smTabLi">
            <button
              onClick={onClickLogout}
              type="button"
              className="smLogoutBtn"
            >
            <LuLogOut className='smIcon' />
            </button>
          </li>
        </ul>
      </div>
      <div className="headerLg">
        <Link className="headerLinks headerLogoBtn" to="/">
          <img
            className="headerLogo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
        <ul className="lgTabsUl">
          <Link to="/" className="headerLinks">
            <li className="lgTabLi">Home</li>
          </Link>
          <Link className="headerLinks" to="/jobs">
            <li className="lgTabLi">Jobs</li>
          </Link>
        </ul>
        <button onClick={onClickLogout} type="button" className="lgLogoutBtn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
