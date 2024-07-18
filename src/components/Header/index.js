import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login'); // Use navigate to redirect after logout
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
              <img
                className="smIcon"
                alt="home logo"
                src="https://png.pngtree.com/element_our/sm/20180516/sm_5afc76eed0142.jpg"
              />
            </Link>
          </li>
          <li className="smTabLi">
            <Link className="headerLinks" to="/jobs">
              <img
                src="https://png.pngtree.com/png-vector/20191026/ourmid/pngtree-work-bag-icon-png-image_1871545.jpg"
                className="locIntIcon"
                alt="employee bag"
              />
            </Link>
          </li>
          <li className="smTabLi">
            <button
              onClick={onClickLogout}
              type="button"
              className="smLogoutBtn"
            >
              <img
                className="smIcon"
                alt="logout"
                src="https://www.shutterstock.com/image-vector/logout-icon-design-isolated-on-260nw-2014215185.jpg"
              />
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
