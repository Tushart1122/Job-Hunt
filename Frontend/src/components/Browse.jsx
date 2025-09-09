import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useLocation } from "react-router-dom";

// 🔹 Normalization helper
const normalize = (text) => text.toLowerCase().replace(/\s+/g, " ").trim();

// 🔹 Aliases for better matching
const aliases = {
  sde: "software development engineer",
  "full stack developer": "fullstack developer",
  "frontend dev": "frontend developer",
  "backend dev": "backend developer",
};

const getSearchQuery = (query) => {
  const normalized = normalize(query);
  return aliases[normalized] || normalized;
};

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const location = useLocation();

  // Get query from URL or Redux
  const params = new URLSearchParams(location.search);
  const queryFromUrl = params.get("query") || searchedQuery || "";

  // Apply normalization + alias
  const searchQuery = getSearchQuery(queryFromUrl);

  // Filter jobs
  const filteredJobs = allJobs.filter((job) =>
    normalize(job.title).includes(searchQuery)
  );

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          {queryFromUrl
            ? `Search Results for "${queryFromUrl}" (${filteredJobs.length})`
            : `All Jobs (${allJobs.length})`}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <p className="col-span-3 text-gray-500">
              No jobs found for "{queryFromUrl}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
