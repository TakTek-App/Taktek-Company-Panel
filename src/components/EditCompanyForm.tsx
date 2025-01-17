import { Box, Button, CircularProgress } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Company {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

const EditCompanyForm = ({ id }: { id: any }) => {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState<Company>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const getCompanyInfo = async () => {
    try {
      const data = await fetch(`http://localhost:3000/companies/${id}`);
      const response = await data.json();
      setCompanyInfo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fieldStyle = {
    width: "600px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);
  return (
    <Formik
      initialValues={{
        name: companyInfo?.name,
        email: companyInfo?.email,
        phone: companyInfo?.phone,
      }}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setLoading(true);
          setSubmitting(true);
          setCompanyInfo(values);
          const data = await fetch(`http://localhost:3000/companies/${id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" },
          });

          if (data.status === 200) {
            setSubmitting(false);
            setTimeout(() => {
              setLoading(false);
              navigate(-1);
            }, 1000);
          } else {
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", height: "300px" }}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      ) : (
        <Form
          style={{
            display: "flex",
            flexDirection:"column",
            justifyContent: "space-evenly",
            alignItems: "start",
          }}
        >
          <Field name="name" label="Company Name"style={fieldStyle} />
          <Field name="email" style={fieldStyle} />
          <Field name="phone" style={fieldStyle} />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ width:"600px", margin: "20px 10px" }}
          >
            Edit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditCompanyForm;
