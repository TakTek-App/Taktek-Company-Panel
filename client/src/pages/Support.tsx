import { Box, Button, Typography } from "@mui/material";
import ContentWraper from "../components/ContentWraper";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextWrapper";

const Support = () => {
  const { company } = useAuth();
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
          onSubmit={(values) => {
            try {
              axios.post("http://localhost:3001/send-email", {
                to: company?.email,
                from: "tech@taktek.app",
                subject: values.subject,
                text: values.text,
              });
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Form
            style={{
              display: "grid",
              gridTemplateAreas: `
        "field1 ."
        "field2 ."
        ". ."
        ". button"
        `,
              gridTemplateRows: "repeat(4,1fr)",
              gap: "20px",
            }}
          >
            <Field
              style={{
                gridArea: "field1",
                borderRadius: "10px",
                outline: "none",
                padding: "0 20px",
                border: "1px solid #c2c2c2",
                fontSize: "18px",
              }}
              name="subject"
              placeholder="Subject"
            />
            <Field
              style={{
                gridArea: "field2",
                borderRadius: "10px",
                outline: "none",
                padding: "0 20px",
                border: "1px solid #c2c2c2",
                fontSize: "18px",
              }}
              name="text"
              placeholder="Message"
            />
            <Button sx={{ gridArea: "button" }} type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
      </Box>
    </ContentWraper>
  );
};

export default Support;
