import React, { useEffect, useState } from "react";
import ContentWraper from "../components/ContentWraper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../contexts/AuthContextWrapper";
import { useNavigate } from "react-router-dom";

const Calls = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [calls, setCalls] = useState();

  const getCalls = async () => {
    const data = await fetch(
      `http://localhost:3000/companies/${company?.id}/calls`
    );
    const response = await data.json();
    setCalls(response);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Call Id", flex: 0.5 },
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
      field: "firstName",
      headerName: "User Name",
      flex: 1,
      valueGetter: (_, row) => row.user.firstName,
    },
    {
      field: "firstName",
      headerName: "Technician Name",
      flex: 1,
      valueGetter: (_, row) => row.technician.firstName,
    },
  ];

  useEffect(() => {
    getCalls();
  }, []);

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Calls">
      <DataGrid columns={columns} rows={calls} />
    </ContentWraper>
  );
};

export default Calls;
