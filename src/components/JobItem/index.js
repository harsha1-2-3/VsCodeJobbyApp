import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { FaLocationDot } from "react-icons/fa6";
import { IoBagHandle } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import Cookies from 'js-cookie';
import { ThreeDots } from 'react-loader-spinner';
import Header from '../Header';
import './index.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
};

const JobItem = () => {
  const [jobDetailsApiStatus, setJobDetailsApiStatus] = useState(
    apiStatusConstants.initial
  );
  const [jobDetailsObj, setJobDetailsObj] = useState({});
  const [similarJobsList, setSimilarJobsList] = useState([]);
  const { id } = useParams(); // Access id from route parameters

  useEffect(() => {
    const fetchJobDetails = async () => {
      setJobDetailsApiStatus(apiStatusConstants.loading);

      const jwtToken = Cookies.get('jwt_token');
      const url = `https://apis.ccbp.in/jobs/${id}`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }

        const data = await response.json();
        const updatedData = {
          jobDetails: data.job_details,
          similarJobs: data.similar_jobs,
        };
        const { jobDetails, similarJobs } = updatedData;
        const { lifeAtCompany, skills } = jobDetails;

        const updatedSkills = skills.map((eachSkill) => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        }));

 
        const updatedLifeAtCompany = lifeAtCompany ? {
          description: lifeAtCompany.description,
          imageUrl: lifeAtCompany.image_url,
      } : {};
      

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
        };

        const updatedSimilarJobs = similarJobs.map((eachJob) => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        }));

        setJobDetailsApiStatus(apiStatusConstants.success);
        setJobDetailsObj(updatedJobDetailsObj);
        setSimilarJobsList(updatedSimilarJobs);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJobDetailsApiStatus(apiStatusConstants.failure);
      }
    };

    fetchJobDetails();
  }, [id]);

  const clickedJobRetry = () => (
    console.log('retry')
  );

  const renderLifeAtCompany = () => {
    const { description, imageUrl } = jobDetailsObj.lifeAtCompany || {};
    if (description && imageUrl) {
      return (
        <div className="lifeCompanyCont">
          <h1 className="lifeHead">Life at Company</h1>
          <div className="lifeParaImgCont">
            <p className="lifePara">{description}</p>
            <img
              className="lifeImg"
              alt="life at company"
              src={imageUrl}
            />
          </div>
        </div>
      );
    } else {
      return <p className='lifePara'>No life at company information available.</p>;
    }
  };
  

  const renderJobSuccess = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
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
               <FaStar className='ratingStar' />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="locIntSalCont">
            <div className="locIntCont">
              <div className="locInt">
           
                <FaLocationDot className='locIntIcon'/>
                <p className="locIntPara">{location}</p>
              </div>
              <div className="locInt">
          
                <IoBagHandle className='locIntIcon' />
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
                 
                  <FaShare className="shareIcon" />
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
          {renderLifeAtCompany()}
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
                 
                      <FaStar className='ratingStar' />
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
              <FaLocationDot className='locIntIcon'/>
                      <p className="locIntPara">{similarJob.location}</p>
                    </div>
                    <div className="locInt">
                    <IoBagHandle className='locIntIcon'/>

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

 const renderJobLoading = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height="50" width="50" />
    </div>
  )

 const renderJobFailure = () => (
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
            onClick={clickedJobRetry}
            type="button"
            className="failBtn"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  const renderAllJobPages = () => {
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.success:
        return renderJobSuccess();
      case apiStatusConstants.loading:
        return renderJobLoading();
      case apiStatusConstants.failure:
        return renderJobFailure();
      default:
        return null;
    }
  };

  return (
    <div className="bgJobItem">
    <Header />
    {renderAllJobPages()}
  </div>
  )
}

export default JobItem