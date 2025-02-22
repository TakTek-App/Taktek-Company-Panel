import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContextWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { People, Phone } from "@mui/icons-material";

const Home = () => {
  const [completedJobs, setCompletedJobs] = useState(0);
  const [incompletedJobs, setIncompletedJobs] = useState(0);
  const [calls, setCalls] = useState(0);
  const [technicians, setTechnicians] = useState(0);
  const navigate = useNavigate();
  const { company } = useAuth();
  console.log(company);

  const getJobs = async () => {
    try {
      const { data } = await axios.get(
        `https://admin-panel-pple.onrender.com/companies/${company?.id}/jobs`
      );
      const completed = data?.filter(
        (job: any) => job.completed === true
      ).length;
      const incompleted = data?.filter(
        (job: any) => job.completed === false
      ).length;
      setIncompletedJobs(incompleted);
      setCompletedJobs(completed);
    } catch (error) {
      console.error(error);
    }
  };

  const getCalls = async () => {
    const { data } = await axios.get(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}/calls`
    );
    const response = data;
    setCalls(response.length);
  };

  const getTechnicians = async () => {
    const { data } = await axios.get(
      `https://admin-panel-pple.onrender.com/companies/${company?.id}/technicians`
    );
    const response = data;
    setTechnicians(response.length);
  };

  useEffect(() => {
    getJobs();
    getCalls();
    getTechnicians();
  }, []);

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Home">
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: `
          "jobs calls"
          "technicians ."
          `,
          gridTemplateColumns: "repeat(2,1fr)",
          gridTemplateRows: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            gridArea: "jobs",
            minWidth: "100%",
            backgroundColor: "#f1f1f1",
            borderRadius: "5px",
            height: "300px",
          }}
        >
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: completedJobs, label: "Completed" },
                  { id: 1, value: incompletedJobs, label: "Incompleted" },
                ],
                outerRadius: 100,
              },
            ]}
          />
        </Box>
        <Box
          sx={{
            gridArea: "calls",
            backgroundColor: "#f1f1f1",
            borderRadius: "5px",
            display: "grid",
            gridTemplateAreas: `
            "icon . ."
            ". calls ."
            `,
            gridTemplateColumns: "repeat(3,1fr)",
            gridTemplateRows: "repeat(3,1fr)",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              gridArea: "icon",
              backgroundColor: "#1d71bf",
              width: "fit-content",
              height: "fit-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              color: "#fff",
            }}
          >
            <Phone />
          </Box>
          <Typography
            sx={{
              gridArea: "calls",
              textAlign: "center",
            }}
          >
            You have received {calls} calls in total
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "technicians",
            width: "100%",
            backgroundColor: "#f1f1f1",
            borderRadius: "5px",
            display: "grid",
            gridTemplateAreas: `
            "icon . ."
            ". calls ."
            `,
            gridTemplateColumns: "repeat(3,1fr)",
            gridTemplateRows: "repeat(3,1fr)",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              gridArea: "icon",
              backgroundColor: "#1d71bf",
              width: "fit-content",
              height: "fit-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              color: "#fff",
            }}
          >
            <People />
          </Box>
          <Typography
            sx={{
              gridArea: "calls",
              textAlign: "center",
            }}
          >
            You have {technicians} active technicians in total
          </Typography>
        </Box>
      </Box>
    </ContentWraper>
  );
};

export default Home;
