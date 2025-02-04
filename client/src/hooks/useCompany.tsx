import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContextWrapper";

const useCompany = () => {
  const { company } = useAuth();
  const [technicians, setTechnicians] = useState();
  const [jobs, setJobs] = useState();

  const getCompany = async () => {
    const data = await fetch(`http://localhost:3000/companies/${company?.id}`);
    const response = await data.json();

    setTechnicians(response.technicians);
    setJobs(response.technicians.jobs);
  };
  useEffect(() => {
    getCompany();
  }, []);

  return { technicians, jobs };
};

export default useCompany;
