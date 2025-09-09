import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import { toast } from "sonner";
import { Building2 } from "lucide-react"; 

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { name: companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error("Failed to register company. Try again.");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 mt-12 hover:shadow-2xl transition-all">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Building2 className="h-12 w-12 text-blue-600 mb-3" />
            <h1 className="font-extrabold text-3xl text-gray-800 text-center">
              Register Your Company
            </h1>
            <p className="text-gray-500 mt-2 text-center max-w-lg">
              Give your company a name. You can always change this later in settings.
            </p>
          </div>

          {/* Input */}
          <div className="mb-6">
            <Label className="text-gray-700">Company Name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. JobHunt, Microsoft, etc."
              className="mt-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={registerNewCompany}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
              disabled={!companyName.trim()}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
