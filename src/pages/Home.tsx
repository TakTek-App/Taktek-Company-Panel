import React from "react";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContextWrapper";

const Home = () => {
  const navigate = useNavigate();
  const { company } = useAuth();
  console.log(company);

  return (
    <ContentWraper onBack={() => navigate(-1)} name="Home">
      <Typography>{company?.name}</Typography>
    </ContentWraper>
  );
};

export default Home;
