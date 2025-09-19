import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Debug logs
  console.log("Current user data:", user);
  console.log("Resume ID:", user?.profile?.resumeId);
  console.log("Resume filename:", user?.profile?.resumeOriginalName);
  console.log("Profile photo ID:", user?.profile?.profilePhotoId);

  // Handle viewing resume
  const handleResumeView = (e) => {
    e.preventDefault();
    
    console.log("Resume click - Resume ID:", user?.profile?.resumeId);
    
    if (!user?.profile?.resumeId) {
      alert("No resume available to view.");
      return;
    }

    // Make sure the API endpoint matches your backend route
    const resumeUrl = `http://localhost:8000/api/v1/user/files/${user.profile.resumeId}`;
    console.log("Opening resume URL:", resumeUrl);
    
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  // Get profile photo URL
  const getProfilePhotoUrl = () => {
    if (user?.profile?.profilePhotoId) {
      return `http://localhost:8000/api/v1/user/files/${user.profile.profilePhotoId}`;
    }
    return "/default-avatar.png"; // Make sure you have this default image
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        {/* Top section: Avatar + Info */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={getProfilePhotoUrl()}
                alt="profile" 
                onError={(e) => {
                  console.log("Image load error, using default");
                  e.target.src = "/default-avatar.png";
                }}
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname || "No Name"}</h1>
              <p className="text-gray-600">{user?.profile?.bio || "No bio provided"}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        {/* Contact Info */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber || "No phone number"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="my-5">
          <h1 className="font-bold">Skills</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.profile?.skills && user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-black text-white px-3 py-1 rounded-full"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">No skills added</span>
            )}
          </div>
        </div>

        {/* Resume Section */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {user?.profile?.resumeId ? (
            <div className="space-y-2">
              <button
                onClick={handleResumeView}
                className="text-blue-500 hover:underline cursor-pointer text-left block transition-colors"
              >
                📄 {user?.profile?.resumeOriginalName || user?.profile?.resumeFilename || "View Resume"}
              </button>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Resume ID: {user.profile.resumeId}</p>
                <p>Filename: {user.profile.resumeFilename}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <p>No resume uploaded</p>
              <p className="text-sm">Click the edit button to upload your resume</p>
            </div>
          )}
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;