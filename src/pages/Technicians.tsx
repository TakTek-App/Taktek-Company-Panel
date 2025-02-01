import React from "react";
import useCompany from "../hooks/useCompany";
import { Box, Typography } from "@mui/material";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";

const Technicians = () => {
  const { technicians } = useCompany();
  console.log(technicians);
  const navigate = useNavigate();
  return (
    <ContentWraper onBack={() => navigate(-1)} name="Technicians">
      <Box>
        {(technicians || []).map((technician: any) => (
          <Box key={technician.id}>
            <Typography>{technician.firstName}</Typography>
          </Box>
        ))}
      </Box>
    </ContentWraper>
  );
};

export default Technicians;
