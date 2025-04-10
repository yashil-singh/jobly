import { getSavedJobs } from "@/services/job/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import JobCard from "../ui/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import Loading from "../ui/Loading";
import { setSaved } from "@/lib/slices/job/jobSlice";

const SavedJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.userJob.saves);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const response = await getSavedJobs();
        dispatch(setSaved(response));
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Oops! Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [dispatch]);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-black">Saved Jobs</h1>
      {loading ? (
        <Loading logoClassName="h-[50px]" />
      ) : (
        jobs &&
        (jobs.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center">
            <span className="text-center font-medium">
              You have no saved jobs yet.
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
