import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, Briefcase, Building2, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate(`/browse?query=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left space-y-6"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#f4ecff] text-[#6A38C2] font-semibold text-sm shadow">
            🚀 No. 1 Job Hunt Website
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Find Your <span className="text-[#6A38C2]">Dream Job</span> <br />&
            Build Your <span className="text-[#F83002]">Career</span>
          </h1>

          <p className="text-gray-600 text-lg">
            Discover thousands of opportunities with top companies. Apply easily
            and take the next step towards your dream career.
          </p>

          {/* Search Bar */}
          <div className="flex w-full md:w-[70%] lg:w-[60%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-3 mx-auto md:mx-0 bg-white">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by job title, skills, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-2 py-3 outline-none border-none rounded-l-full"
            />
            <Button
              onClick={searchJobHandler}
              className="rounded-r-full bg-[#6A38C2] hover:bg-[#5a2fa5] px-6 py-2 text-white font-medium"
            >
              Search
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-6 pt-6">
            <div className="text-center">
              <Briefcase className="mx-auto text-[#6A38C2] h-6 w-6" />
              <p className="font-bold text-lg">100k+</p>
              <p className="text-gray-500 text-sm">Jobs Posted</p>
            </div>
            <div className="text-center">
              <Building2 className="mx-auto text-[#F83002] h-6 w-6" />
              <p className="font-bold text-lg">10k+</p>
              <p className="text-gray-500 text-sm">Companies</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto text-[#6A38C2] h-6 w-6" />
              <p className="font-bold text-lg">1M+</p>
              <p className="text-gray-500 text-sm">Job Seekers</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 hidden md:flex justify-center"
        >
          <img
            src="/public/job hunt.png"
            alt="Job Search"
            className="w-[80%] max-w-md rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
