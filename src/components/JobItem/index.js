import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class JobItem extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetailsObj: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = updatedData
      const lifeAtCompany = jobDetails.life_at_company
      const {skills} = jobDetails
      const updatedSkills = skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const updatedLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }
      const updatedJobDetailsObj = {
        title: jobDetails.title,
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        location: jobDetails.location,
        rating: jobDetails.rating,
        packagePerAnnum: jobDetails.package_per_annum,
      }
      const updatedSimilarJobs = similarJobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetailsApiStatus: apiStatusConstants.success,
        jobDetailsObj: updatedJobDetailsObj,
        similarJobsList: updatedSimilarJobs,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  clickedJobRetry = () => {
    this.getJobDetails()
  }

  renderJobSuccess = () => {
    const {jobDetailsObj, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      rating,
      packagePerAnnum,
      title,
    } = jobDetailsObj

    return (
      <div>
        <div className="jobItem">
          <div className="jobLogoNamesCont">
            <img
              className="jobLogo"
              alt="job details company logo"
              src={companyLogoUrl}
            />
            <div className="nameRatingsCont">
              <h1 className="jobName">{title}</h1>
              <div className="ratingCont">
                <img
                  className="ratingStar"
                  alt="rating star"
                  src="https://img.freepik.com/free-vector/3d-metal-star-isolated_1308-117760.jpg"
                />
                <p className="rating">{rating}</p>
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
                <p className="locIntPara">{location}</p>
              </div>
              <div className="locInt">
                <img
                  src="https://png.pngtree.com/png-vector/20191026/ourmid/pngtree-work-bag-icon-png-image_1871545.jpg"
                  className="locIntIcon"
                  alt="employee bag"
                />
                <p className="locIntPara">{employmentType}</p>
              </div>
            </div>
            <p className="salPara">{packagePerAnnum}</p>
          </div>
          <div className="descParaCont">
            <div className="descVisitCont">
              <h1 className="description">Description</h1>
              <div className="visitCont">
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="visitLink"
                >
                  Visit
                  <img
                    className="shareIcon"
                    src="https://png.pngtree.com/png-clipart/20221115/ourmid/pngtree-share-icon-button-png-image_6454552.png"
                    alt="share icon"
                  />
                </a>
              </div>
            </div>
            <p className="descriptionPara">{jobDescription}</p>
          </div>
          <div className="skillsCont">
            <h1 className="skillsHead">Skills</h1>
            <ul className="skillsListCont">
              {skills.map(skill => (
                <li key={skill.name} className="skill">
                  <img
                    className="skillImg"
                    alt={skill.name}
                    src={skill.imageUrl}
                  />
                  <h1 className="skillName">{skill.name}</h1>
                </li>
              ))}
            </ul>
          </div>
          <div className="lifeCompanyCont">
            <h1 className="lifeHead">Life at Company</h1>
            <div className="lifeParaImgCont">
              <p className="lifePara">{lifeAtCompany.description}</p>
              <img
                className="lifeImg"
                alt="life at company"
                src={lifeAtCompany.imageUrl}
              />
            </div>
          </div>
        </div>
        <div className="similarJobsCont">
          <h1 className="similarJobsHead">Similar Jobs</h1>
          <ul className="similarJobsList">
            {similarJobsList.map(similarJob => (
              <li key={similarJob.id} className="jobLi">
                <div className="jobLogoNamesCont">
                  <img
                    className="jobLogo"
                    alt="similar job company logo"
                    src={similarJob.companyLogoUrl}
                  />
                  <div className="nameRatingsCont">
                    <h1 className="jobName">{similarJob.title}</h1>
                    <div className="ratingCont">
                      <img
                        className="ratingStar"
                        alt="rating star"
                        src="https://img.freepik.com/free-vector/3d-metal-star-isolated_1308-117760.jpg"
                      />
                      <p className="rating">{similarJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="descParaContSimilar">
                  <h1 className="description">Description</h1>
                  <p className="descriptionPara">{similarJob.jobDescription}</p>
                </div>
                <div className="locIntSalCont">
                  <div className="locIntCont">
                    <div className="locInt">
                      <img
                        className="locIntIcon"
                        alt="loaction dot"
                        src="https://t3.ftcdn.net/jpg/05/11/35/32/240_F_511353245_j5F7qWnhZu6VNNGQFbYNhsjWCwxs1WQ4.jpg"
                      />
                      <p className="locIntPara">{similarJob.location}</p>
                    </div>
                    <div className="locInt">
                      <img
                        src="https://png.pngtree.com/png-vector/20191026/ourmid/pngtree-work-bag-icon-png-image_1871545.jpg"
                        className="locIntIcon"
                        alt="employee bag"
                      />
                      <p className="locIntPara">{similarJob.employmentType}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobFailure = () => (
    <div className="bgJobItemFail">
      <div className="jobItemFail">
        <img
          className="failImg"
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        />
        <h1 className="failHead">Oops! Something Went Wrong</h1>
        <p className="failPara">
          We cannot seem to find the page you are looking for.
        </p>
        <div className="failBtnCont">
          <button
            onClick={this.clickedJobRetry}
            type="button"
            className="failBtn"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  renderAllJobPages = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobSuccess()
      case apiStatusConstants.loading:
        return this.renderJobLoading()
      case apiStatusConstants.failure:
        return this.renderJobFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bgJobItem">
        <Header />
        {this.renderAllJobPages()}
      </div>
    )
  }
}
export default JobItem