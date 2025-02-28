import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContextWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { CreditCard, Paid, People, Phone, Work } from "@mui/icons-material";

const Home = () => {
  const [completedJobs, setCompletedJobs] = useState(0);
  const [incompletedJobs, setIncompletedJobs] = useState(0);
  const [calls, setCalls] = useState(0);
  const [technicians, setTechnicians] = useState(0);
  const [lastWeekCharged, setLastWeekCharged] = useState(0);
  const [pendingCalls, setPendingCalls] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { company } = useAuth();
  const theme = useTheme();

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

  const getCompany = async () => {
    try {
      const data = await axios.get(
        `https://admin-panel-pple.onrender.com/companies/${company?.id}`
      );
      const response = data;
      console.log(response.status);
      if (response.status === 200) {
        setLastWeekCharged(response.data.lastChargedCalls);
        const pending = calls - lastWeekCharged;
        if (pending) {
          setPendingCalls(pending);
        } else {
          setPendingCalls(0);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompany();
  }, [pendingCalls, lastWeekCharged]);
  useEffect(() => {
    getJobs();
  }, []);
  useEffect(() => {
    getCalls();
  }, []);
  useEffect(() => {
    getTechnicians();
  }, []);

  if (loading) {
    return (
      <ContentWraper onBack={() => navigate(-1)} name="Home">
        <Box sx={{ display: "flex" }}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      </ContentWraper>
    );
  }

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Home">
      <Box
        sx={{
          display: { xs: "flex", sm: "grid" },
          flexDirection: "column",
          gridTemplateAreas: `
          "jobs calls calls"
          "jobs lastweek thisweek"
          "technicians . ."
          `,
          gridTemplateColumns: "repeat(3,1fr)",
          gridTemplateRows: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            gridArea: "jobs",
            minWidth: "100%",
            backgroundColor:
              theme.palette.mode === "light" ? "#f1f1f1" : "#ffffff15",
            borderRadius: "5px",
            height: "400px",
            display: "grid",
            gridTemplateAreas: `
            "icon . ."
            "text text text"
            "chart chart chart"
            "chart chart chart"
            "chart chart chart"
            `,
            gridTemplateRows: "repeat(5,1fr)",
            gridTemplateColumns: "repeat(3,1fr)",
            textAlign: "center",
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
            <Work />
          </Box>
          <Box sx={{ gridArea: "text", margin: "10px" }}>
            <Typography>
              This are your completed and incompleted jobs
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              (Place your mouse over the pie chart to see)
            </Typography>
          </Box>
          <Box
            sx={{
              gridArea: "chart",
            }}
          >
            <PieChart
              margin={{ right: 0 }}
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: completedJobs,
                      label: "Completed",
                      color: "#1d71bf",
                    },
                    {
                      id: 1,
                      value: incompletedJobs,
                      label: "Incompleted",
                      color: "#1d960d",
                    },
                  ],
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  outerRadius: 100,
                  arcLabel: (item) => `${item.value}`,
                },
              ]}
              slotProps={{ legend: { hidden: true } }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            gridArea: "calls",
            backgroundColor:
              theme.palette.mode === "light" ? "#f1f1f1" : "#ffffff15",
            borderRadius: "5px",
            display: "grid",
            height: "100%",
            gridTemplateAreas: `
            "icon . ."
            ". calls ."
            `,
            gridTemplateColumns: "repeat(3,1fr)",
            gridTemplateRows: "repeat(3,1fr)",
            gap: "20px",
            textAlign: "center",
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
            }}
          >
            You have received {calls} calls in total
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "technicians",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light" ? "#f1f1f1" : "#ffffff15",
            borderRadius: "5px",
            display: "grid",
            height: "200px",
            gridTemplateAreas: `
            "icon . ."
            ". calls ."
            `,
            gridTemplateColumns: "repeat(3,1fr)",
            gridTemplateRows: "repeat(3,1fr)",
            gap: "20px",
            textAlign: "center",
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
            }}
          >
            You have {technicians} active technicians in total
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "lastweek",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light" ? "#f1f1f1" : "#ffffff15",
            borderRadius: "5px",
            display: "grid",
            gridTemplateAreas: `
            "icon . ."
            ". text ."
            `,
            gridTemplateRows: "repeat(3,1fr)",
            gridTemplateColumns: "repeat(3,1fr)",
            textAlign: "center",
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
            <Paid />
          </Box>
          <Typography
            sx={{
              gridArea: "text",
            }}
          >
            Last week you've paid <strong>${lastWeekCharged * 10}</strong>
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "thisweek",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light" ? "#f1f1f1" : "#ffffff15",
            borderRadius: "5px",
            display: "grid",
            gridTemplateAreas: `
            "icon . ."
            ". text ."
            `,
            gridTemplateRows: "repeat(3,1fr)",
            gridTemplateColumns: "repeat(3,1fr)",
            textAlign: "center",
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
            <CreditCard />
          </Box>
          <Typography sx={{ gridArea: "text" }}>
            This week you will pay{" "}
            {pendingCalls ? (
              <strong>${pendingCalls * 10}</strong>
            ) : (
              <strong>$0</strong>
            )}
          </Typography>
        </Box>
      </Box>
    </ContentWraper>
  );
};

export default Home;
