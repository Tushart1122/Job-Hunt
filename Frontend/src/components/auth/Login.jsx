import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        console.log(res.data.user)
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 my-12 transition-transform transform hover:scale-[1.02]"
        >
          <h1 className="font-extrabold text-3xl text-center text-blue-700 mb-6">Welcome Back 👋</h1>
          
          <div className="my-3">
            <Label className="text-gray-700">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@gmail.com"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="my-3">
            <Label className="text-gray-700">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
              className="mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-center">
            {loading ? (
              <Button className="w-full my-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2" disabled>
                <Loader2 className="h-5 w-5 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                Login
              </Button>
            )}
          </div>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
