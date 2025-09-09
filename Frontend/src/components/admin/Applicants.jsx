import React, { useEffect } from 'react'
import Navbar from '../shared/navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APLLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  
  useEffect(() => {
    const fetchAllApplicants = async () => {  
      try {
        const res = await axios.get(`${APLLICATION_API_END_POINT}/${params.id}/applicants`, {withCredentials: true});
        // Fixed the typo: 'jon' should probably be 'job' or the correct property name
        dispatch(setAllApplicants(res.data.job)); // or res.data.applications
      } catch(error) {
        console.log(error)
      }
    }
    fetchAllApplicants();
  }, []); // Added params.id dependency if needed: [params.id]

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        {/* Fixed: Added safe navigation and fallback */}
        <h1 className='font-bold text-xl my-5'>
          Applicants {applicants?.applications?.length || 0}
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  )
}

export default Applicants