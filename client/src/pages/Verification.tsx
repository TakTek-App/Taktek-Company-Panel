import { Box, Typography, Button } from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// Configuración de Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt9psezgt/upload";
const CLOUDINARY_UPLOAD_PRESET = "taktek";

// Tipo de datos en Formik
type FormValues = {
  businessReg: string;
  insurance: string;
  driverLicense: string;
  driverLicenseExpDate: string;
  insuranceExpDate: string;
};

interface VerificationProps {
  paramToConfirm?: string; // Permite que sea undefined
}

const Verification: React.FC<VerificationProps> = () => {
  const [uploading, setUploading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName");

  const handleFileUpload = async (
    file: File,
    fieldName: keyof FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) return;

    setUploading(true);
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
        setFieldValue(fieldName, data.secure_url);
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("Submitting data:", values);

    try {
      const response = await fetch(
        `https://admin-panel-pple.onrender.com/companies/${companyId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      // https://taktek-company-panel-backend.onrender.com
      axios.post(
        "https://taktek-company-panel-backend.onrender.com/send-documents",
        {
          to: "tech@taktek.app",
          from: "tech@taktek.app",
          subject: "Verification Documents",
          businessReg: values.businessReg,
          insurance: values.insurance,
          driverLicense: values.driverLicense,
          companyName: companyName,
          companyId: companyId,
        }
      );

      setInProgress(true);

      if (!response.ok) {
        throw new Error("Error en la actualización");
      }

      console.log("Datos enviados con éxito");
    } catch (error) {
      console.error("Error al enviar datos:", error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {}, [inProgress]);

  if (inProgress) {
    return (
      <Box
        sx={{
          display: "grid",
          height: "100vh",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateAreas: `
        'logo logo logo'
        '. main .'
        `,
        }}
      >
        <Box
          sx={{
            gridArea: "logo",
            width: "250px",
            padding: "10px 20px",
          }}
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo_rectangle_black.png?alt=media&token=e2faaa6e-f44c-4e07-831b-c970c9e6c8da"
            alt="logo"
            width="100%"
          />
        </Box>
        <Box
          sx={{
            gridArea: "main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center", width: "50%" }}>
            Your documents are under review. Check your email, once your account
            is active we will let you know.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        height: "100vh",
        gridTemplateRows: "repeat(5,1fr)",
        gridTemplateAreas: `
            'logo . .'
            'top top top'
            'mid mid mid'
            'bottom bottom bottom'
            `,
        fontFamily: "sans-serif",
      }}
    >
      <Box
        sx={{
          gridArea: "logo",
          width: "250px",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo_rectangle_black.png?alt=media&token=e2faaa6e-f44c-4e07-831b-c970c9e6c8da"
          alt="logo"
          width="100%"
        />
      </Box>
      <Box
        sx={{
          gridArea: "top",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h5">
          Please upload the required documents to verify your company.
        </Typography>
      </Box>

      <Box
        sx={{
          gridArea: "mid",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Formik
          initialValues={{
            businessReg: "",
            insurance: "",
            driverLicense: "",
            driverLicenseExpDate: "",
            insuranceExpDate: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateAreas: `
                  "title title"
                  "field1 field3"
                  "field2 field4"
                  "field6 field6"
                  "button button"
                  `,
                  gap: "20px",
                }}
              >
                <label
                  style={{
                    gridArea: "field1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Driver License Exp. Date
                  <Field
                    type="Date"
                    style={{
                      borderRadius: "10px",
                      outline: "none",
                      border: "1px solid #c2c2c2",
                      padding: "10px 20px",
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                    }}
                    name="driverLicenseExpDate"
                    onChange={(e: any) => {
                      setFieldValue("driverLicenseExpDate", e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                </label>
                <label
                  style={{
                    gridArea: "field2",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Insurance Exp. Date
                  <Field
                    type="Date"
                    name="insuranceExpDate"
                    style={{
                      borderRadius: "10px",
                      outline: "none",
                      border: "1px solid #c2c2c2",
                      padding: "10px 20px",
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                    }}
                    onChange={(e: any) => {
                      setFieldValue("insuranceExpDate", e.target.value);
                    }}
                  />
                </label>
                {/* <Field style={{ gridArea: "field3" }} /> */}
                <label
                  style={{
                    gridArea: "field6",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Business Registration
                  <input
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "10px",
                      borderRadius: "10px",
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                    }}
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(
                        e.target.files[0],
                        "businessReg",
                        setFieldValue
                      )
                    }
                  />
                </label>
                <label
                  style={{
                    gridArea: "field4",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Insurance
                  <input
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "10px",
                      borderRadius: "10px",
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                    }}
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(
                        e.target.files[0],
                        "insurance",
                        setFieldValue
                      )
                    }
                  />
                </label>

                <label
                  style={{
                    gridArea: "field3",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Driver License
                  <input
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "10px",
                      borderRadius: "10px",
                      fontFamily: "sans-serif",
                      fontSize: "18px",
                    }}
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(
                        e.target.files[0],
                        "driverLicense",
                        setFieldValue
                      )
                    }
                  />
                </label>

                <Button
                  type="submit"
                  disabled={uploading || isSubmitting}
                  sx={{
                    gridArea: "button",
                  }}
                >
                  {uploading
                    ? "Uploading..."
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <Box
        sx={{
          gridArea: "bottom",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        This process will take a few days. Please check your email, once it's
        done we will notify you!
      </Box>
    </Box>
  );
};

export default Verification;
