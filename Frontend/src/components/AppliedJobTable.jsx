import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  
  // Debug logging
  console.log("🏪 Full Redux Store Job State:", useSelector((store) => store.job));
  console.log("📋 All Applied Jobs:", allAppliedJobs);
  console.log("🔢 Applied Jobs Length:", allAppliedJobs?.length);
  console.log("🔍 Applied Jobs Type:", typeof allAppliedJobs);
  console.log("📊 Is Array:", Array.isArray(allAppliedJobs));
  
  // Additional safety check
  const safeAppliedJobs = Array.isArray(allAppliedJobs) ? allAppliedJobs : [];
  
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You have not applied for any job
              </TableCell>
            </TableRow>
          ) : (
            safeAppliedJobs.map((appliedJob, index) => (
              <TableRow key={appliedJob._id || appliedJob.id || index}>
                <TableCell>
                  {appliedJob?.createdAt 
                    ? new Date(appliedJob.createdAt).toLocaleDateString() 
                    : appliedJob?.dateApplied 
                    ? new Date(appliedJob.dateApplied).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {appliedJob.job?.title || 
                   appliedJob.jobTitle || 
                   appliedJob.title || 
                   'N/A'}
                </TableCell>
                <TableCell>
                  {appliedJob.job?.company?.name || 
                   appliedJob.company?.name || 
                   appliedJob.companyName || 
                   appliedJob.company || 
                   'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={`${appliedJob?.status ==="rejected"?'bg-red-400' :appliedJob.status ==='pending'?'bg-gray-400' :'bg-green-400'}`}>
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;