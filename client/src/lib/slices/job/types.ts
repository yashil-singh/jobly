export type Job = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  company: string;
  location: string;
  experienceRequired: string;
  jobType: string;
  salary: string;
  salaryBasis: string;
  deadlineDate: string;
  createdAt: string;
};

export type UserJobState = {
  saves: Job[];
  applications: Job[];
};
