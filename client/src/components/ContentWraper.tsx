import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import React from "react";

interface ContentWraperProps {
  name: string;
  buttonName?: string;
  onBack?: () => void;
  buttonFunction?: () => void;
  renderComponent?: any;
  children: any;
}

const ContentWraper: React.FC<ContentWraperProps> = ({
  name,
  buttonName,
  onBack,
  buttonFunction,
  renderComponent,
  children,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: "20px 0", sm: 4 },
        width: { xs: "90%", sm: `calc(100% - 240px)` },
        marginLeft: { xs: 0, sm: "240px" },
        marginTop: { xs: "100px", sm: "120px" },
        marginBottom: { xs: "100px", sm: "120px" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack} sx={{ m: "auto 10px" }}>
            <ArrowBack fontSize="large" />
          </IconButton>
          <Typography variant="h4">{name}</Typography>
        </Box>
        {buttonName && (
          <Button variant="contained" onClick={buttonFunction}>
            {buttonName}
          </Button>
        )}
        {renderComponent && <>{renderComponent}</>}
      </Box>
      {/* You can access props here if needed */}
      <Box sx={{ padding: 5 }}>{children}</Box>
    </Paper>
  );
};

export default ContentWraper;
