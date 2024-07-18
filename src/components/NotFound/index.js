import './index.css'

const NotFound = () => (
  <div className="bgNotFound">
    <img
      className="nfImg"
      alt="not found"
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
    />
    <h1 className="nfHead">Page Not Found</h1>
    <p className="nfPara">
      We are sorry, the page you requested could not be found.
    </p>
  </div>
)
export default NotFound
