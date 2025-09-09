import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { APLLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected", "Pending"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APLLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleResumeClick = (url) => {
    if (!url) return;
    // Open resume in a new tab (PDFs will render inline, DOC/DOCX may download)
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of recent applied user</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell>{item.applicant?.fullname || "Full Name"}</TableCell>
              <TableCell>{item.applicant?.email || "Email"}</TableCell>
              <TableCell>{item.applicant?.phoneNumber || "Contact"}</TableCell>
              <TableCell className="text-blue-600 cursor-pointer">
                {item.applicant?.profile?.resume ? (
                  <span
                    onClick={() => handleResumeClick(item.applicant.profile.resume)}
                    className="hover:underline"
                  >
                    {item.applicant.profile.resumeOriginalName || "View Resume"}
                  </span>
                ) : (
                  "No Resume"
                )}
              </TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString() || "Date"}
              </TableCell>
              <TableCell className="float-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, statusIndex) => (
                      <div
                        onClick={() => statusHandler(status, item?._id)}
                        key={statusIndex}
                        className="flex w-fit items-center my-2 cursor-pointer"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
