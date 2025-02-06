import { Box, Typography, Button } from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";

// Aquí defines tu configuración de Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt9psezgt/upload";
const CLOUDINARY_UPLOAD_PRESET = "taktek";

type FormValues = {
  files: { [key: string]: string };
};

const Verification = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (
    files: FileList,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: { [key: string]: string } = {};

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          urls[file.name] = data.secure_url;
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }
    }

    setUploading(false);
    setFieldValue("files", urls);
  };

  return (
    <Box
      sx={{
        display: "grid",
        height: "100vh",
        gridTemplateRows: "repeat(4,1fr)",
        gridTemplateAreas: `
            'top top top'
            'mid mid mid'
            'mid mid mid'
            'bottom bottom bottom'
            `,
      }}
    >
      <Box
        sx={{
          gridArea: "top",
          border: "2px solid black",
          backgroundColor: "tomato",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>
          Please upload all the documents requested below in order to verify
          your company. This process might take a few days to be done.
        </Typography>
      </Box>

      <Box
        sx={{
          gridArea: "mid",
          border: "2px solid black",
          backgroundColor: "tomato",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={{ files: {} }}
          onSubmit={(
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            console.log("Submitted values:", values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <input
                type="file"
                multiple
                accept="application/pdf,image/*" // Aceptar tanto imágenes como PDFs
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload(e.target.files, setFieldValue)
                }
              />
              <Button
                type="submit"
                disabled={uploading}
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                {uploading ? "Uploading..." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      <Box
        sx={{
          gridArea: "bottom",
          border: "2px solid black",
          backgroundColor: "tomato",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>
          {uploading ? "Uploading files..." : "All set! Ready to submit?"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Verification;
