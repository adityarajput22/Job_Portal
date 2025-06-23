import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const JobDescription = () => {
  //const isApplied=true
  const params = useParams();
  const jobId = params.id;
  //useGetSingleJob(jobId); //custom hook to get single job
  const { singleJob } = useSelector((store) => store.job);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  //application.applicant =>USER
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); //update the local state
        const updatedSingleJob = {
          ...singleJob,
          application: [
            ...(singleJob.application || []),
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update(usi time pe)
        toast.success(res.data.message);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  //console.log(applications.length)
  //pehle ye chalefa fir applyhandler
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.application.some(
              (application) => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        } //if user id and application id ll match then changes ll be applied
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="'flex items-center gap-2 mt-4'">
            <Badge className={"text-blue-700 font-bold"} variant={"ghost"}>
              {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#f83002]  font-bold"} variant={"ghost"}>
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209B7] font-bold"} variant={"ghost"}>
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
  onClick={isApplied ? null : applyJobHandler}
  disabled={isApplied}
  className={`rounded-xl ${
    isApplied
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-[#2563EB] hover:bg-[#1E40AF]"
  }`}
>
  {isApplied ? "Application Submitted" : "Apply for this Job"}
</Button>

      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.application?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {" "}
            {singleJob?.createdAt
              ? new Date(singleJob.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
