import { db } from "../index.js";
import { errorResponse, successResponse } from "../lib/utils.js";

export const getUserSavedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    const saves = db.get("saves");
    const jobs = db.get("jobs");

    const userSaves = saves.filter({ userId }).value();
    const jobIds = userSaves.map((save) => save.jobId);

    const savedJobs = jobs.filter((job) => jobIds.includes(job.id)).value();

    res.status(200).json(savedJobs);
  } catch (error) {
    console.log("🚀 ~ jobController.js:13 ~ error:", error);

    res.status(500).json({ message: "Something went wrong! Try again." });
  }
};

export const toggleJobSave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) return res.status(400).json({ message: "Job ID is required." });

    const jobs = db.get("jobs");

    const existingJob = jobs.find({ id }).value();

    if (!existingJob)
      return res.status(404).json({ message: "Job not found." });

    let message;

    const saves = db.get("saves");

    const savedJob = saves.find({ jobId: id, userId }).value();

    if (savedJob) {
      saves.remove({ jobId: id, userId }).write();
      message = "Job removed from bookmarks.";
    } else {
      const job = { jobId: id, userId };
      saves.push(job).write();
      message = "Job bookmarked.";
    }

    res.status(200).json({
      message,
      job: existingJob,
    });
  } catch (error) {
    console.log("🚀 ~ jobController.js:5 ~ error:", error);

    res.status(500).json({ message: "Something went wrong! Try again." });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const jobs = db.get("jobs");
    const existingJob = jobs.find({ id }).value();

    if (!existingJob) return errorResponse(res, "Job not found.", 404);

    const applications = db.get("applications");
    const existingApplication = applications
      .find({ jobId: id, userId })
      .value();

    if (existingApplication)
      return errorResponse(res, "Already applied to this job.", 400);

    const application = {
      id: Date.now().toString(),
      jobId: id,
      userId,
    };

    applications.push(application).write();

    successResponse(
      res,
      { job: existingJob },
      "Applied to job successfully.",
      201
    );
  } catch (error) {
    errorResponse(res);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    const applications = db.get("applications");
    const jobs = db.get("jobs");

    const userApplications = applications.filter({ userId }).value();
    const jobIds = userApplications.map((application) => application.jobId);

    const appliedJobs = jobs.filter((job) => jobIds.includes(job.id)).value();

    successResponse(res, { jobs: appliedJobs });
  } catch (error) {
    errorResponse(res);
  }
};

export const searchJob = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "")
      return errorResponse(res, "Query is required.", 400);

    const searchQuery = q.toLowerCase();

    const jobs = db
      .get("jobs")
      .value()
      .filter((job) => {
        const titleMatch = job.title.toLowerCase().includes(searchQuery);
        const tagsMatch = job.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery)
        );

        return titleMatch || tagsMatch;
      });

    successResponse(res, { jobs });
  } catch (error) {
    console.log("🚀 ~ jobController.js:142 ~ error:", error);

    errorResponse(res);
  }
};
