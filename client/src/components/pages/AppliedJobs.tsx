import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../ui/Loading";
import JobCard from "../ui/JobCard";
import { handleResponseError } from "@/lib/utils";
import { getAppliedJobs } from "@/services/job/api";
import { setApplications } from "@/lib/slices/job/jobSlice";

const AppliedJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector(
    (state: RootState) => state.userJob.applications,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const response = await getAppliedJobs();
        dispatch(setApplications(response.jobs));
      } catch (error) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [dispatch]);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-black">Jobs Applications</h1>
      {loading ? (
        <Loading logoClassName="h-[50px]" />
      ) : (
        applications &&
        (applications.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center">
            <span className="text-center font-medium">
              You have not applied to any jobs yet.
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default AppliedJobs;
