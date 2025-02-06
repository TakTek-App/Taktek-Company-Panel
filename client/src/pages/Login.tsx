import { Box, Button, Paper, Typography } from "@mui/material";
import "../App.css";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextWrapper";
import axios from "axios";
import { useEffect, useState } from "react";

const Login = () => {
  const fieldStyle = {
    width: "80%",
    margin: "0px 10px",
    fontSize: "20px",
    padding: "10px 20px",
    border: "1px solid gray",
    borderRadius: "5px",
    outline: "none",
  };
  const params = new URLSearchParams(window.location.search);
  let company_created = params.get("company_created");
  console.log(company_created);

  const { signedIn, setSignedIn, setCompany } = useAuth();
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

      if (data.status === 201) {
        company_created = "false";
        localStorage.removeItem("companyData");
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

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          margin: "50px",
          padding: "50px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h2">Welcome Admin</Typography>
            </Box>
            <Box
              component="img"
              src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Flogo.png?alt=media&token=6defccae-3a0c-4333-80a8-1c1ef024c917"
            />
          </Box>
          <Box>
            <Paper
              elevation={3}
              sx={{
                padding: "100px 10px",
                backgroundColor: "#1d71bf",
                width: "100%",
                height: "fit-content",
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
                  }}
                >
                  <Field name="email" style={fieldStyle} placeholder="Email" />
                  <Field
                    name="password"
                    style={fieldStyle}
                    placeholder="Password"
                    type="password"
                  />
                  {/* <Box sx={{ textAlign: "center", color: "#fff" }}>
                    <Typography>Dont have an account?</Typography>
                    <Typography>
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
                  </Box> */}
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    sx={{
                      backgroundColor: "#88C124",
                      color: "#000000",
                      padding: "5px 20px",
                      fontSize: "16px",
                    }}
                  >
                    Log In
                  </Button>
                </Form>
              </Formik>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
