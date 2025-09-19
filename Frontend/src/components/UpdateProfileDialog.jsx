import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    
    // Log file details for debugging
    if (file) {
      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    console.log("Submitting profile update:", {
      fullname: input.fullname,
      email: input.email,
      phoneNumber: input.phoneNumber,
      bio: input.bio,
      skills: input.skills,
      hasFile: !!input.file,
      fileName: input.file?.name,
      fileType: input.file?.type
    });
    
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    
    // Handle skills - ensure it's sent as comma-separated string
    const skillsString = Array.isArray(input.skills) 
      ? input.skills.join(",") 
      : input.skills.toString();
    formData.append("skills", skillsString);
    
    if (input.file) {
      formData.append("file", input.file);
      console.log("File added to FormData:", input.file.name);
    }

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data" 
          },
          withCredentials: true,
        }
      );
      
      console.log("Profile update response:", res.data);
      
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
        
        // Reset form
        setInput({
          fullname: res.data.user.fullname || "",
          email: res.data.user.email || "",
          phoneNumber: res.data.user.phoneNumber || "",
          bio: res.data.user.profile?.bio || "",
          skills: res.data.user.profile?.skills || [],
          file: null,
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || "Update failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSkillsChange = (e) => {
    const skillsValue = e.target.value;
    const skillsArray = skillsValue
      .split(",")
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setInput({ ...input, skills: skillsArray });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your full name"
              />
            </div>
            
            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Phone Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your phone number"
              />
            </div>
            
            {/* Bio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Tell us about yourself"
              />
            </div>
            
            {/* Skills */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input
                id="skills"
                name="skills"
                value={Array.isArray(input.skills) ? input.skills.join(",") : input.skills}
                onChange={handleSkillsChange}
                className="col-span-3"
                placeholder="Enter skills separated by commas"
              />
            </div>
            
            {/* File Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Resume/Photo
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif"
                onChange={fileChangeHandler}
                className="col-span-3"
              />
            </div>
            
            {/* Current Resume Info */}
            {user?.profile?.resumeId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm text-gray-500">
                  Current Resume
                </Label>
                <div className="col-span-3 text-sm text-gray-600">
                  {user.profile.resumeOriginalName || user.profile.resumeFilename || "Uploaded"}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;