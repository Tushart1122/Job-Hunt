import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Building2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6">
        <form
          onSubmit={SubmitHandler}
          className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 mt-12 hover:shadow-2xl transition-all"
        >
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              type="button"
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-2xl text-gray-800 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Company Setup
              </h1>
              <p className="text-gray-500 text-sm">
                Update your company details and logo below.
              </p>
            </div>
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
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
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="text-gray-700">Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
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
                className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-gray-700">Company Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="mt-1 cursor-pointer rounded-lg border-gray-300"
              />
              {input.file && typeof input.file === "string" && (
                <img
                  src={input.file}
                  alt="Company Logo"
                  className="mt-3 h-20 rounded-md object-contain"
                />
              )}
            </div>
          </div>

          {/* Action Button */}
          {loading ? (
            <Button
              className="w-full my-6 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              disabled
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              Updating...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Update Company
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
