import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { PlusCircle } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full md:w-1/3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="🔍 Filter companies by name..."
            />

            {/* New Company Button */}
            <Button
              onClick={() => navigate("/admin/companies/create")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 shadow-md transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              New Company
            </Button>
          </div>

          {/* Table Section */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Registered Companies</h2>
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
