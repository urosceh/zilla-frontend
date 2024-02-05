import { useEffect, useState } from "react";

export const useIssue = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createIssue = async () => {};
  const deleteIssue = async () => {};
  const updateIssue = async () => {};

  return {
    createIssue,
    deleteIssue,
    updateIssue,
  };
};

export const useGetIssue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [issue, setIssue] = useState(undefined);

  const getIssue = async ({
    issueId,
    projectKey,
  }: {
    issueId: string;
    projectKey: string;
  }) => {
    setIsLoading(true);
    //API poziv
    setIsLoading(false);
  };

  return {
    getIssue,
    issue,
    isLoading,
  };
};

export const useIssues = ({ immediately }: { immediately: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState([]);

  const getIssues = async ({ filters }: { filters?: string[] } = {}) => {
    // API poziv
  };

  useEffect(() => {
    if (immediately) {
      getIssues();
    }
  });

  return {
    getIssues,
    issues,
  };
};
