import React, { useEffect, useState, useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const FilterCard = () => {
  const { allJobs } = useSelector((store) => store.job);
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  // Extract unique Locations, Roles, Salaries dynamically
  const { locations, roles, salaries } = useMemo(() => {
    const locSet = new Set();
    const roleSet = new Set();
    const salarySet = new Set();

    allJobs.forEach((job) => {
      if (job.location) locSet.add(job.location);
      if (job.title) roleSet.add(job.title);
      if (job.salary) salarySet.add(job.salary);
    });

    return {
      locations: Array.from(locSet),
      roles: Array.from(roleSet),
      salaries: Array.from(salarySet),
    };
  }, [allJobs]);

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {/* Location Filter */}
        <div>
          <h1 className="font-bold text-lg mt-4">Location</h1>
          {locations.map((item, idx) => {
            const itemId = `loc-${idx}`;
            return (
              <div className="flex items-center space-x-2 my-2" key={itemId}>
                <RadioGroupItem value={item} id={itemId} />
                <Label htmlFor={itemId}>{item}</Label>
              </div>
            );
          })}
        </div>

        {/* Role Filter */}
        <div>
          <h1 className="font-bold text-lg mt-4">Role</h1>
          {roles.map((item, idx) => {
            const itemId = `role-${idx}`;
            return (
              <div className="flex items-center space-x-2 my-2" key={itemId}>
                <RadioGroupItem value={item} id={itemId} />
                <Label htmlFor={itemId}>{item}</Label>
              </div>
            );
          })}
        </div>

        {/* Salary Filter */}
        <div>
          <h1 className="font-bold text-lg mt-4">Salary</h1>
          {salaries.map((item, idx) => {
            const itemId = `salary-${idx}`;
            return (
              <div className="flex items-center space-x-2 my-2" key={itemId}>
                <RadioGroupItem value={item} id={itemId} />
                <Label htmlFor={itemId}>{item}</Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
