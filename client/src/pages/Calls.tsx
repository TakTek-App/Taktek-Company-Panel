import { useEffect, useState } from "react";
import ContentWraper from "../components/ContentWraper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../contexts/AuthContextWrapper";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import axios from "axios";

const Calls = () => {
  const { company, setCompany } = useAuth();
  const navigate = useNavigate();
  const [calls, setCalls] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const companyId = company?.id;

  const getCalls = async () => {
    const data = await fetch(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}/calls`
    );
    const response = await data.json();
    setCalls(response);
  };

  useEffect(() => {
    getCalls();
  }, []);

  const updateCompany = async () => {
    const data = await axios.get(
      `https://admin-panel-pple.onrender.com/companies/${companyId}`
    );
    const response = data.data;
    setCompany(response);
  };

  useEffect(() => {
    localStorage.removeItem("company");
    updateCompany();
  }, []);

  useEffect(() => {
    const today = new Date().getDay(); // 5 = Viernes
    if (today !== 5) return;

    const lastCharged = company ? company?.lastPaymentDate : "";
    if (lastCharged === new Date().toDateString()) return;

    const customerId = company ? company?.customerId : "";
    if (!customerId) {
      console.error("Error: No se encontró customerId en localStorage.");
      return;
    }

    // 🔹 Obtener llamadas ya cobradas
    const lastChargedCalls = company ? company?.lastChargedCalls : 0;

    // 🔹 Calcular llamadas pendientes
    const pendingCalls = calls.length - lastChargedCalls;
    if (pendingCalls <= 0) return; // No hay nuevas llamadas por cobrar

    // 🔹 Guardar la fecha y la cantidad de llamadas cobradas
    // localStorage.setItem("lastPaymentDate", new Date().toDateString());
    // localStorage.setItem("lastChargedCalls", calls.length.toString());

    axios.patch(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}`,
      {
        lastChargedCalls: calls.length,
        lastPaymentDate: new Date().toDateString(),
      }
    );
    updateCompany();

    fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}charge-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        amount: pendingCalls * 10, // ✅ Solo cobramos por las nuevas llamadas
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(`Pago exitoso por ${pendingCalls} llamadas!`);
        }
      })
      .catch((err) => console.error("Error en el cobro:", err));
  }, [calls]); // ✅ Se ejecuta cuando cambian las llamadas

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
      field: "user.firstName",
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
  ];

  const columnsMobile: GridColDef[] = [
    { field: "id", headerName: "Call Id", flex: 1 },
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
      field: "user.firstName",
      headerName: "User Name",
      minWidth: 120,
      valueGetter: (_, row) => row.user.firstName,
    },
    {
      field: "technician.firstName",
      headerName: "Technician Name",
      minWidth: 150,
      valueGetter: (_, row) => row.technician.firstName,
    },
  ];

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Calls">
      <DataGrid columns={isMobile ? columnsMobile : columns} rows={calls} />
    </ContentWraper>
  );
};

export default Calls;
