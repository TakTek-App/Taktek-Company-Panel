import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContextWrapper";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMediaQuery } from "@mui/material";

const Jobs = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState();
  const isMobile = useMediaQuery("(max-width:600px)");

  const getJobs = async () => {
    const data = await fetch(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}/jobs`
    );
    const response = await data.json();
    setJobs(response);
  };
  useEffect(() => {
    getJobs();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Job Id", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (value) =>
        new Date(value).toLocaleString("en-us", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }),
      flex: 1,
    },
    {
      field: "completed",
      headerName: "Completed",
      flex: 1,
      valueFormatter: (value) => {
        if (value) return "Yes";
        else {
          return "No";
        }
      },
    },
    {
      field: "firstName",
      headerName: "User Name",
      flex: 1,
      valueGetter: (_, row) => row.user.firstName,
    },
    {
      field: "technician.firstName",
      headerName: "Technician Name",
      flex: 1,
      valueGetter: (_, row) => row.technician.firstName,
    },
    {
      field: "service.name",
      headerName: "Service",
      flex: 1,
      valueGetter: (_, row) => row.service.name,
    },
  ];
  const columnsMobile: GridColDef[] = [
    { field: "id", headerName: "Job Id", flex: 0.5 },
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (value) =>
        new Date(value).toLocaleString("en-us", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }),
      minWidth: 180,
    },
    {
      field: "completed",
      headerName: "Completed",
      minWidth: 150,
      valueFormatter: (value) => {
        if (value) return "Yes";
        else {
          return "No";
        }
      },
    },
    {
      field: "firstName",
      headerName: "User Name",
      minWidth: 120,
      valueGetter: (_, row) => row.user.firstName,
    },
    {
      field: "technician.firstName",
      headerName: "Technician Name",
      minWidth: 120,
      valueGetter: (_, row) => row.technician.firstName,
    },
    {
      field: "service.name",
      headerName: "Service",
      minWidth: 120,
      valueGetter: (_, row) => row.service.name,
    },
  ];

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Jobs">
      <DataGrid rows={jobs} columns={isMobile ? columnsMobile : columns} />
    </ContentWraper>
  );
};

export default Jobs;
