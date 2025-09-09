import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company._id.toLowerCase() === value
    );
    if (!selectedCompany) {
      console.warn("Company not found for value:", value);
      return;
    }
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-8 my-10 transition-all hover:scale-[1.01]"
        >
          <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
            🚀 Post a New Job
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Job Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="e.g. Software Engineer"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Brief job description"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="text-gray-700">Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="Skills, tools, etc."
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="e.g. 10 LPA"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="text-gray-700">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g. Remote / Bangalore"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full-time, Internship, Contract"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="text-gray-700">Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="e.g. 2+ years"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                placeholder="e.g. 5"
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {companies.length > 0 && (
              <div className="md:col-span-2">
                <Label className="text-gray-700">Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-semibold text-center my-4">
              *Please register a company first, before posting a job
            </p>
          )}

          {loading ? (
            <Button
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
              disabled
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              Posting Job...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Post New Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
