import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 my-12 transition-all hover:scale-[1.02]"
        >
          <h1 className="font-extrabold text-3xl text-center text-purple-700 mb-6">Create Account ✨</h1>
          
          <div className="my-3">
            <Label className="text-gray-700">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your name"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="my-3">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@gmail.com"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="my-3">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="9876543210"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="my-3">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="********"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <RadioGroup className="flex items-center gap-6 my-5 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <Input
                type="radio"
                name="role"
                value="student"
                checked={input.role === "student"}
                onChange={changeEventHandler}
                className="cursor-pointer"
                required
              />
              <span>🎓 Student</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
                className="cursor-pointer"
                required
              />
              <span>💼 Recruiter</span>
            </label>
          </RadioGroup>

          <div className="flex items-center gap-3 mt-3">
            <Label>Profile</Label>
            <Input
              type="file"
              accept="image/*"
              name="file"
              onChange={changeFileHandler}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            {loading ? (
              <Button className="w-full my-4 bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2" disabled>
                <Loader2 className="h-5 w-5 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">
                Sign Up
              </Button>
            )}
          </div>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
