import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APLLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        console.log("🔍 Fetching applied jobs from:", `${APLLICATION_API_END_POINT}/get`);
        
        const res = await axios.get(`${APLLICATION_API_END_POINT}/get`, {
          withCredentials: true
        });
        
        // console.log("📡 Full API Response:", res);
        // console.log("📋 Response Data:", res.data);
        // console.log("✅ Success Status:", res.data.success);
        // console.log("📄 Applications Array:", res.data.applications); // Changed to plural
        
        if (res.data.success) {
          // FIXED: Changed from res.data.application to res.data.applications (plural)
          const applications = res.data.applications || [];
          // console.log("🎯 Dispatching to Redux:", applications);
          // console.log("📊 Number of applications:", applications.length);
          
          dispatch(setAllAppliedJobs(applications));
        } else {
          console.log("❌ API call unsuccessful:", res.data.message);
          dispatch(setAllAppliedJobs([]));
        }
      } catch (error) {
        console.error("🚨 Error fetching applied jobs:", error);
        console.error("📄 Error response data:", error.response?.data);
        console.error("📊 Error status:", error.response?.status);
        console.error("🔗 Request URL:", error.config?.url);
        
        dispatch(setAllAppliedJobs([]));
      }
    };
    
    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;