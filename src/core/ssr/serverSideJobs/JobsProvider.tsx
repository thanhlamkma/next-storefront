import { createContext, ReactNode, useContext } from "react";

export interface JobData<D = any> {
  data: D | null;
  error?: any;
}

type JobsContextType = {
  jobsData: Record<string, JobData>;
};

const JobsContext = createContext<JobsContextType | undefined>(undefined);

interface JobsProviderProps {
  data?: Record<string, JobData>;
  children: ReactNode;
}

export default function JobsProvider({
  data = {},
  children,
}: JobsProviderProps) {
  return (
    <JobsContext.Provider value={{ jobsData: data }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useServerJobData(name: string) {
  const context = useContext(JobsContext);

  if (!context) {
    throw new Error("useJobsData must be used in JobsProvider");
  }

  return context.jobsData[name];
}
