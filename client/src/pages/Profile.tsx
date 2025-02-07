import React, { useState } from "react";
import ContentWraper from "../components/ContentWraper";
import {
  Box,
  Button,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContextWrapper";
import { Check } from "@mui/icons-material";

const Profile = () => {
  const { company } = useAuth();
  console.log(company);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (company?.id) {
      navigator.clipboard.writeText(company.id);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };
  return (
    <ContentWraper name="Profile">
      <Grid2 container spacing={2}>
        <Grid2
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TextField type="text" value={company?.name} label="Name" disabled />
          <TextField
            type="text"
            value={company?.email}
            label="Email"
            disabled
          />
          <TextField
            type="text"
            value={company?.zipCode}
            label="Zip Code"
            disabled
          />
          <TextField
            type="text"
            value={company?.businessReg}
            label="Business Registration"
            disabled
          />
          <TextField
            type="text"
            value={company?.insuranceExpDate}
            label="Insurance Expire Date"
            disabled
          />
        </Grid2>
        <Grid2
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <TextField
              type="text"
              value={company?.id}
              label="Id"
              disabled
              sx={{ flex: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleCopy}
              sx={{ flex: 0.5 }}
              disabled={copied}
            >
              {copied ? "Copied" : "Copy Id"}
            </Button>
          </Box>
          <TextField
            type="text"
            value={company?.address}
            label="Address"
            disabled
          />
          <TextField type="text" value={company?.city} label="City" disabled />{" "}
          <TextField
            type="text"
            value={company?.insurance}
            label="Insurance"
            disabled
          />
        </Grid2>
        <Grid2 size={12} sx={{ mt: 5 }}>
          <Typography variant="h4">Services</Typography>
          <Box>
            {company?.services.map((service) => (
              <List key={service.id}>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <Check />
                  </ListItemIcon>
                  <ListItemText primary={service.name} />
                </ListItem>
              </List>
            ))}
          </Box>
        </Grid2>
      </Grid2>
    </ContentWraper>
  );
};

export default Profile;
