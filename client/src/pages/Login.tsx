import { Box, Button, Typography, useTheme } from "@mui/material";
import "../App.css";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextWrapper";
import axios from "axios";
import { useEffect } from "react";

const Login = () => {
  const theme = useTheme();
  const fieldStyle = {
    width: "80%",
    margin: "0px 10px",
    fontSize: "20px",
    padding: "10px 20px",
    border: "1px solid gray",
    borderRadius: "5px",
    outline: "none",
    backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#ffffff15",
    color: theme.palette.mode === "light" ? "#000" : "#fff",
  };
  const params = new URLSearchParams(window.location.search);

  let company_created = params.get("company_created");
  console.log(company_created);

  const { setSignedIn, setCompany } = useAuth();
  const navigate = useNavigate();

  const postCompany = async () => {
    const companyData = localStorage.getItem("companyData") || "";
    const parsedData = await JSON.parse(companyData);
    console.log(parsedData.name);
    const postObject = {
      name: parsedData.name,
      email: parsedData.email,
      password: parsedData.password,
      phone: parsedData.phone,
      address: parsedData.address,
      city: parsedData.city,
      zipCode: parsedData.zipCode,
      services: parsedData.services, // Asegúrate de que `services` sea un arreglo de IDs
    };
    console.log(postObject);
    try {
      const data = await axios.post(
        "https://admin-panel-pple.onrender.com/companies",
        postObject
      );
      0;
      if (data.status === 201) {
        company_created = "false";
        navigate(
          `/verification?companyId=${data.data.id}&companyName=${data.data.name}`
        );
        // localStorage.removeItem("companyData");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (company_created === "true") {
      postCompany();
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("company");
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: { xs: "90%" },
        margin: { xs: "auto", sm: 0 },
        textAlign: "center",
        display: { xs: "flex", sm: "grid" },
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "space-evenly", sm: "normal" },
        alignItems: { xs: "center", sm: "normal" },
        gridTemplateRows: "repeat(3,1fr)",
        gridTemplateAreas: `
      "logo ."
      "column1 column2"
      `,
        backgroundColor: theme.palette.mode === "light" ? "#f1f1f1" : "#000",
        color: theme.palette.mode === "light" ? "#000000" : "#ffffff",
      }}
    >
      <Box
        sx={{
          gridArea: "logo",
          width: "250px",
        }}
      >
        {theme.palette.mode === "light" ? (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo_rectangle_black.png?alt=media&token=e2faaa6e-f44c-4e07-831b-c970c9e6c8da"
            alt="logo"
            width="100%"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo-rectangle.png?alt=media&token=9d15ea8c-084a-4999-b51a-b8711cdab59c"
            alt="logo"
            width="100%"
          />
        )}
      </Box>
      <Box
        sx={{
          gridArea: "column1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Welcome Company</Typography>
      </Box>
      <Box
        sx={{
          gridArea: "column2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          enableReinitialize
          onSubmit={async (values) => {
            console.log(values);
            try {
              const data = await fetch(
                "https://admin-panel-pple.onrender.com/companies/login",
                {
                  method: "POST",
                  body: JSON.stringify(values),
                  headers: { "Content-Type": "application/json" },
                }
              );
              const response = await data.json();
              console.log(response, "dataLogin");
              if (data.status === 201) {
                setSignedIn(true);
                setCompany(response);
                navigate("/home");
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              margin: "20px",
              borderRadius: "10px",

              boxShadow:
                theme.palette.mode === "light"
                  ? "0px 0px 50px 10px #00000034"
                  : "0px 0px 10px 2px rgba(255, 255, 255, 0.34)",
              padding: "80px 40px",
              backgroundColor:
                theme.palette.mode === "light" ? "#ffffff" : "#121212",
            }}
          >
            <Typography variant="h4">Login</Typography>
            <Field name="email" style={fieldStyle} placeholder="Email" />
            <Field
              name="password"
              style={fieldStyle}
              placeholder="Password"
              type="password"
            />
            <Box sx={{ textAlign: "center", color: "#000" }}>
              <Typography
                sx={{
                  color: theme.palette.mode === "light" ? "#000" : "#fff",
                }}
              >
                Dont have an account?
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.mode === "light" ? "#000" : "#fff",
                }}
              >
                Sign Up
                <span>
                  <span> </span>
                  <Link
                    to="/signup"
                    style={{ color: "#88C124", textDecoration: "none" }}
                  >
                    Here
                  </Link>
                </span>
              </Typography>
            </Box>
            <Button variant="contained" size="small" type="submit" fullWidth>
              Log In
            </Button>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
