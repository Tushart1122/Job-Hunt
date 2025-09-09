import React, { use, useEffect } from 'react'
import Navbar from './shared/navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'; // Custom hook to fetch all jobs
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home= () => {
  useGetAllJobs(); // Custom hook to fetch all jobs
  const {user} =useSelector((store)=>store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if(user?.role === "recuriter"){
      navigate("/admin/companies");
    }
  },[]);
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
      <Footer/>
    </div>
  )
}

export default Home
