import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        
        console.log('📋 API Response:', res.data); // Debug log
        
        if (res.data.success) {
          // ✅ FIXED: Use res.data.jobs instead of res.data.companies
          dispatch(setAllAdminJobs(res.data.jobs));
          console.log('✅ Jobs dispatched to Redux:', res.data.jobs);
        }
      } catch (error) {
        console.log('❌ Error fetching admin jobs:', error);
      }
    };
    
    fetchAllAdminJobs();
  }, [dispatch]); // ✅ Added dispatch to dependency array
};

export default useGetAllAdminJobs;