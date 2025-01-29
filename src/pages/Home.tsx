import React from "react";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Home">
      <Typography>Im the home</Typography>
    </ContentWraper>
  );
};

export default Home;
