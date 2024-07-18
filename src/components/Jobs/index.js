import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const locationsList = [
  {
    locationId: 'HYDERABAD',
    label: 'Hyderabad',
  },
  {
    locationId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    label: 'Mumbai',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeEmployeeType: [],
    activeSalaryRange: '',
    profileObj: {},
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    checkedItems: [],
    activeLocation: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onChangeEmploymentType = event => {
    const {checkedItems} = this.state
    let updatedEmployeeType
    if (
      event.target.checked &&
      checkedItems.includes(event.target.value) === false
    ) {
      updatedEmployeeType = [...checkedItems, event.target.value]
    } else {
      updatedEmployeeType = checkedItems.filter(
        item => item !== event.target.value,
      )
    }
    this.setState({activeEmployeeType: updatedEmployeeType}, this.getJobsList)
  }

  onChangeSalaryRange = event => {
    this.setState({activeSalaryRange: event.target.value}, this.getJobsList)
  }

  onChangeLocation = event => {
    const {checkedItems} = this.state
    if (event.target.checked) {
      const updatedLocation = [...checkedItems, event.target.value].join(',')
      this.setState({activeLocation: updatedLocation}, this.getJobsList)
    } else {
      const normalChecked = checkedItems
        .filter(item => item !== event.target.value)
        .join(',')
      this.setState({activeLocation: normalChecked}, this.getJobsList)
    }
  }

  clickedSearch = () => {
    this.getJobsList()
  }

  clickedRetryProfile = () => {
    this.getProfileDetails()
  }

  clickedRetryJobs = () => {
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.loading})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfilePbj = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileObj: updatedProfilePbj,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.loading})
    const {
      searchInput,
      activeSalaryRange,
      activeEmployeeType,
      activeLocation,
    } = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${activeEmployeeType}&minimum_package=${activeSalaryRange}&location=${activeLocation}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    console.log(activeEmployeeType)
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsList = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: updatedJobsList,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getSearchResults = () => {
    const {searchInput, jobsList} = this.state
    const searchResultsList = jobsList.filter(
      each => each.title === searchInput,
    )
    this.setState({jobsList: searchResultsList})
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobs = () => (
    <div className="bgNoJobs">
      <div className="noJobs">
        <img
          className="noJobsImg"
          alt="no jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        />
        <h1 className="noJobsHead">No Jobs Found</h1>
        <p className="noJobsPara">
          We could not find any jobs. Try other filters
        </p>
      </div>
    </div>
  )

  renderSuccessProfile = () => {
    const {profileObj} = this.state
    const {name, profileImageUrl, shortBio} = profileObj

    return (
      <div className="profileCont">
        <img className="profile" alt="profile" src={profileImageUrl} />
        <h1 className="profileName">{name}</h1>
        <p className="profileBio">{shortBio}</p>
      </div>
    )
  }

  renderFailureProfile = () => (
    <div className="failBtnCont">
      <button
        type="button"
        onClick={this.clickedRetryProfile}
        className="failBtn"
      >
        Retry
      </button>
    </div>
  )

  renderSuccessJobs = () => {
    const {jobsList} = this.state

    return (
      <>
        <div>
          {jobsList.length === 0 ? (
            this.renderNoJobs()
          ) : (
            <ul className="jobsListSideUl">
              {jobsList.map(eachJob => (
                <Link
                  to={`/jobs/${eachJob.id}`}
                  className="headerLinks"
                  key={eachJob.id}
                >
                  <li className="jobLi">
                    <div className="jobLogoNamesCont">
                      <img
                        className="jobLogo"
                        alt="company logo"
                        src={eachJob.companyLogoUrl}
                      />
                      <div className="nameRatingsCont">
                        <h1 className="jobName">{eachJob.title}</h1>
                        <div className="ratingCont">
                          <img
                            className="ratingStar"
                            alt="rating star"
                            src="https://img.freepik.com/free-vector/3d-metal-star-isolated_1308-117760.jpg"
                          />
                          <p className="rating">{eachJob.rating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="locIntSalCont">
                      <div className="locIntCont">
                        <div className="locInt">
                          <img
                            className="locIntIcon"
                            alt="loaction dot"
                            src="https://t3.ftcdn.net/jpg/05/11/35/32/240_F_511353245_j5F7qWnhZu6VNNGQFbYNhsjWCwxs1WQ4.jpg"
                          />
                          <p className="locIntPara">{eachJob.location}</p>
                        </div>
                        <div className="locInt">
                          <img
                            src="https://png.pngtree.com/png-vector/20191026/ourmid/pngtree-work-bag-icon-png-image_1871545.jpg"
                            className="locIntIcon"
                            alt="employee bag"
                          />
                          <p className="locIntPara">{eachJob.employmentType}</p>
                        </div>
                      </div>
                      <p className="salPara">{eachJob.packagePerAnnum}</p>
                    </div>
                    <div className="descCont">
                      <h1 className="description">Description</h1>
                      <p className="descriptionPara">
                        {eachJob.jobDescription}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  renderFailureJobs = () => (
    <div className="bgJobItemFail">
      <div className="jobItemFail">
        <img
          className="failImg"
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        />
        <h1 className="failHead">Oops! Something Went Wrong</h1>
        <p className="failPara">
          We cannot seem to find the page you are looking for
        </p>
        <div className="failBtnCont">
          <button
            type="button"
            onClick={this.clickedRetryJobs}
            className="failBtn"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  renderAllProfilePages = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessProfile()
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailureProfile()
      default:
        return null
    }
  }

  renderAllJobsListPages = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessJobs()
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailureJobs()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="bgJobs">
        <Header />
        <div className="jobs">
          <div className="jobsFilterSide">
            <div className="jobsInputContSm">
              <input
                value={searchInput}
                onChange={this.onChangeSearch}
                className="jobsInputBoxSm"
                placeholder="Search..."
                type="search"
              />
              <button
                onClick={this.clickedSearch}
                data-testid="searchButton"
                type="button"
                className="jobsSearchBtnSm"
              >
                <img
                  alt="search icon"
                  src="https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-vector-search-icon-png-image_966647.jpg"
                  className="jobsSearchIconSm"
                />
              </button>
            </div>
            {this.renderAllProfilePages()}
            <div className="filtersCont">
              <h1 className="filterHead">Type of Employment </h1>
              <ul className="filterUl">
                {employmentTypesList.map(eachType => (
                  <li key={eachType.employmentTypeId} className="filterLi">
                    <input
                      value={eachType.employmentTypeId}
                      name="employmentType"
                      onChange={this.onChangeEmploymentType}
                      id={eachType.employmentTypeId}
                      className="filterInput"
                      type="checkbox"
                    />
                    <label
                      className="filterLabel"
                      htmlFor={eachType.employmentTypeId}
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filtersCont">
              <h1 className="filterHead">Salary Range </h1>
              <ul className="filterUl">
                {salaryRangesList.map(eachRange => (
                  <li key={eachRange.salaryRangeId} className="filterLi">
                    <input
                      value={eachRange.salaryRangeId}
                      onChange={this.onChangeSalaryRange}
                      id={`${eachRange.salaryRangeId}`}
                      className="filterInput"
                      name="range"
                      type="radio"
                    />
                    <label
                      className="filterLabel"
                      htmlFor={`${eachRange.salaryRangeId}`}
                    >
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filtersCont">
              <h1 className="filterHead">Desired Location</h1>
              <ul className="filterUl">
                {locationsList.map(each => (
                  <li key={each.locationId} className="filterLi">
                    <input
                      onChange={this.onChangeLocation}
                      id={each.locationId}
                      className="filterInput"
                      type="checkbox"
                      value={each.locationId}
                    />
                    <label className="filterLabel" htmlFor={each.locationId}>
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobsListSide">
            <div className="jobsInputContLg">
              <input
                onChange={this.onChangeSearch}
                className="jobsInputBoxLg"
                placeholder="Search..."
                type="search"
              />
              <button
                data-testid="searchButton"
                onClick={this.clickedSearch}
                type="button"
                className="jobsSearchBtnLg"
              >
                <img
                  alt="search icon"
                  src="https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-vector-search-icon-png-image_966647.jpg"
                  className="jobsSearchIconSm"
                />
              </button>
            </div>
            {this.renderAllJobsListPages()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs