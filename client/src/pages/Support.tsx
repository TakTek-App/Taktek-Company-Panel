import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ContentWraper from "../components/ContentWraper";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextWrapper";

const Support = () => {
  const { company } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  return (
    <ContentWraper name="Support">
      <Box>
        <Typography sx={{ mb: 4 }}>
          Please send us a detailed message of your issue, we will be in touch
          with you soon!
        </Typography>
        <Formik
          initialValues={{
            to: "",
            from: "",
            subject: "",
            text: "",
          }}
          enableReinitialize
          onSubmit={(values, { resetForm }) => {
            try {
              axios.post(
                "https://taktek-company-panel-backend.onrender.com/send-email",
                {
                  to: company?.email,
                  from: "tech@taktek.app",
                  subject: values.subject,
                  text: values.text,
                }
              );
              resetForm();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Form
            style={
              isMobile
                ? {
                    display: "flex",
                    flexDirection: "column",
                    gridTemplateAreas: `
        "field1 ."
        "field2 ."
        ". ."
        ". button"
        `,
                    gridTemplateRows: "repeat(4,1fr)",
                    gap: "20px",
                  }
                : {
                    display: "grid",
                    flexDirection: "column",
                    gridTemplateAreas: `
        "field1 ."
        "field2 ."
        ". ."
        ". button"
        `,
                    gridTemplateRows: "repeat(4,1fr)",
                    gap: "20px",
                  }
            }
          >
            <Field
              style={
                isMobile
                  ? {
                      gridArea: "field1",
                      borderRadius: "10px",
                      outline: "none",
                      padding: "0 20px",
                      border: "1px solid #c2c2c2",
                      fontSize: "18px",
                      lineHeight: "2",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#f1f1f1"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }
                  : {
                      gridArea: "field1",
                      borderRadius: "10px",
                      display: "flex",
                      margin: "auto",
                      outline: "none",
                      padding: "0 20px",
                      border: "1px solid #c2c2c2",
                      fontSize: "18px",
                      height: "50px",
                      maxHeight: "50px",
                      width: "100%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#f1f1f1"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }
              }
              name="subject"
              placeholder="Subject"
            />
            <Field
              as="textarea"
              style={
                isMobile
                  ? {
                      gridArea: "field2",
                      borderRadius: "10px",
                      outline: "none",
                      padding: "0 20px",
                      border: "1px solid #c2c2c2",
                      fontSize: "18px",
                      lineHeight: "2",
                      height: "100px",
                      wordWrap: "wrap",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#f1f1f1"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }
                  : {
                      gridArea: "field2",
                      borderRadius: "10px",
                      outline: "none",
                      padding: "10px 20px",
                      border: "1px solid #c2c2c2",
                      fontSize: "18px",
                      height: "100px",
                      resize: "none",
                      fontFamily: "Arial",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#f1f1f1"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }
              }
              name="text"
              placeholder="Message"
            />
            <Button
              sx={{ gridArea: "button", maxHeight: "50px" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Formik>
      </Box>
    </ContentWraper>
  );
};

export default Support;
