import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="bgHome">
    <Header />
    <div className="home">
      <h1 className="homeHead">Find The Job That Fits Your Life</h1>
      <p className="homePara">
        Millions of people are searching for jobs, salary information, company
        reviews. Find th job that fits your abilities and potential.
      </p>
      <Link className="headerLinks" to="/jobs">
        <button type="button" className="homeFindJobsBtn">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)
export default Home
