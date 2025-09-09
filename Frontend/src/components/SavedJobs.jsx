import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeJobFromDB,
  clearSavedJobsFromDB,
  fetchSavedJobs,
} from "../redux/savedJobSlice"; // ✅ updated actions
import { Button } from "./ui/button";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.savedJobs);

  // ✅ Load saved jobs from backend when component mounts
  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
        {jobs.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => dispatch(clearSavedJobsFromDB())}
          >
            Clear All
          </Button>
        )}
      </div>

      {loading && <p className="text-gray-500">Loading saved jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {jobs.length === 0 && !loading ? (
        <p className="text-gray-500">No jobs saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border p-4 rounded-md shadow-sm bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold">{job.title}</h2>
                <p className="text-gray-600">{job.company?.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {job.description?.substring(0, 100)}...
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => dispatch(removeJobFromDB(job._id))}
                >
                  Remove
                </Button>
                <Button
                  className="bg-[#7209b7]"
                  onClick={() =>
                    (window.location.href = `/description/${job._id}`)
                  }
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
