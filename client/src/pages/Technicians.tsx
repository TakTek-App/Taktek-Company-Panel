import { useEffect, useState } from "react";
import { Rating, Switch, useMediaQuery } from "@mui/material";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../contexts/AuthContextWrapper";
import { Star } from "@mui/icons-material";
import axios from "axios";

const Technicians = () => {
  const [technicians, setTechnicians] = useState();
  const navigate = useNavigate();
  const { company } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  const getTechnicians = async () => {
    const data = await fetch(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}/technicians`
    );
    const response = await data.json();
    setTechnicians(response);
  };

  const handleReceiveCalls = async (value: boolean, technicianId: number) => {
    try {
      axios.patch(
        `https://admin-panel-pple.onrender.com/technicians/${technicianId}`,
        {
          canReceiveCalls: value,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Technician Id", flex: 0.5 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    {
      field: "services.name",
      headerName: "Services",
      flex: 1,
      valueGetter: (_, row) => row.services.map((service: any) => service.name),
    },
    {
      field: "jobs",
      headerName: "Jobs",
      flex: 1,
      valueGetter: (_, row) => row.services.length,
    },
    {
      field: "calls",
      headerName: "Calls",
      flex: 1,
      valueGetter: (_, row) => row.calls.length,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 2,
      renderCell: (params) => (
        <Rating
          name="text-feedback"
          value={params.row.rating}
          readOnly
          precision={0.5}
          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
      ),
    },
    {
      field: "canReceiveCalls",
      headerName: "Can Receive Calls",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.canReceiveCalls}
          onChange={(e) => handleReceiveCalls(e.target.checked, params.row.id)}
        />
      ),
    },
  ];

  const columnsMobile: GridColDef[] = [
    { field: "id", headerName: "Technician Id", minWidth: 120 },
    { field: "firstName", headerName: "First Name", minWidth: 120 },
    { field: "lastName", headerName: "Last Name", minWidth: 120 },
    {
      field: "services.name",
      headerName: "Services",
      minWidth: 120,
      valueGetter: (_, row) => row.services.map((service: any) => service.name),
    },
    {
      field: "jobs",
      headerName: "Jobs",
      minWidth: 120,
      valueGetter: (_, row) => row.services.length,
    },
    {
      field: "calls",
      headerName: "Calls",
      minWidth: 120,
      valueGetter: (_, row) => row.calls.length,
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 180,
      renderCell: (params) => (
        <Rating
          name="text-feedback"
          value={params.row.rating}
          readOnly
          precision={0.5}
          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
      ),
    },
  ];

  useEffect(() => {
    getTechnicians();
  }, [technicians]);

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Technicians">
      <DataGrid
        columns={isMobile ? columnsMobile : columns}
        rows={technicians}
      />
    </ContentWraper>
  );
};

export default Technicians;
