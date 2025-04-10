import { fetchJobs } from "../../services/job/api";
import JobCard from "../ui/JobCard";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";
import { Job } from "@/lib/slices/job/types";

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobs();
        setJobs(response);
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
  }, []);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold">What are you looking for?</h1>

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
              There are no job listings yet.
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
