import { useNavigate, useParams } from "react-router-dom";
import { applyToJob, fetchJobById, toggleSave } from "../../services/job/api";
import { useEffect, useState } from "react";
import { Bookmark, Calendar, Hourglass, Loader2, MapPin } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import { formatDate } from "date-fns";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Loading from "../ui/Loading";
import { cn, handleResponseError } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  addApplication,
  removeSavedJob,
  saveJob,
} from "@/lib/slices/job/jobSlice";
import { Job } from "@/lib/slices/job/types";

const JobDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();

  const saves = useSelector((state: RootState) => state.userJob.saves);
  const isSaved = saves.some((save) => save.id === id);

  const applications = useSelector(
    (state: RootState) => state.userJob.applications,
  );
  const isApplied = applications.some((application) => application.id === id);

  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(true);

  const [isApplying, setIsApplying] = useState(false);

  const onSave = async () => {
    try {
      // Optimistic UI update
      if (isSaved) {
        dispatch(removeSavedJob(job!));
      } else {
        dispatch(saveJob(job!));
      }

      await toggleSave(id!);
    } catch (error) {
      // Revert optimistic UI update
      if (isSaved) {
        dispatch(saveJob(job!));
      } else {
        dispatch(removeSavedJob(job!));
      }

      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  };

  const onApplyToJob = async () => {
    try {
      setIsApplying(true);
      const response = await applyToJob(id!);
      dispatch(addApplication(response.job));
      toast.success(response.message);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    const getJobDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchJobById(id!);

        if (!response) navigate("/not-found");

        setJob(response);
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

    getJobDetails();
  }, [id, navigate]);

  return (
    <div className="fluid px-4">
      {loading && <Loading logoClassName="h-[50px]" />}

      {job && (
        <div className="flex flex-col gap-6">
          <div className="bg-accent relative h-40 rounded-xl">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
              className="bg-accent absolute -bottom-5 left-5 size-20 rounded-full border object-cover"
            />
          </div>

          <section className="flex justify-between gap-1 px-4">
            <div>
              <h1 className="text-2xl font-extrabold">{job.title}</h1>

              <p className="text-foreground font-medium">{job.company}</p>

              <span className="text-muted-foreground">
                {job.location} • {job.jobType}
              </span>
            </div>

            <Button
              className="size-10"
              variant="ghost"
              size="icon"
              onClick={onSave}
            >
              <Bookmark
                className={cn("size-5", isSaved && "fill-foreground")}
              />
            </Button>
          </section>

          <Separator />

          <div className="flex h-full flex-col gap-4 md:flex-row">
            <section className="col-span-2 flex-1 space-y-8 px-4">
              <div>
                <h2 className="text-xl font-bold">Job Description</h2>
                <p className="text-muted-foreground">{job.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold">Top Skills</h2>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.tags.map((tag) => (
                    <Badge key={tag} className="rounded-full px-3 py-1 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>

            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className="md:hidden" />

            <section className="w-full space-y-4 px-4 md:max-w-[320px]">
              <p className="text-xl font-bold">
                Rs. {job.salary} {job.salaryBasis}
              </p>

              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <MapPin className="size-5" /> {job.location}
              </span>

              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-3">
                  <span className="bg-accent flex size-10 items-center justify-center rounded-full">
                    <Calendar className="size-5" />
                  </span>

                  <div className="flex flex-col text-sm">
                    <span className="font-bold">
                      {formatDate(job.createdAt, "d MMM yyyy")}
                    </span>
                    <span className="text-muted-foreground">Posted</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3">
                  <span className="bg-accent flex size-10 items-center justify-center rounded-full">
                    <Hourglass className="size-5" />
                  </span>

                  <div className="flex flex-col text-sm">
                    <span className="font-bold">
                      {formatDate(job.deadlineDate, "d MMM yyyy")}
                    </span>
                    <span className="text-muted-foreground">Expiry Date</span>
                  </div>
                </div>
              </div>

              <Button
                className="mt-5 w-full"
                size="lg"
                onClick={onApplyToJob}
                disabled={isApplied}
              >
                {isApplying ? (
                  <Loader2 className="animate-spin" />
                ) : isApplied ? (
                  "Applied"
                ) : (
                  "Apply Now"
                )}
              </Button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
