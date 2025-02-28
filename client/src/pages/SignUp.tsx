import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";

import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import "./signup.css";
import { Link } from "react-router-dom";

interface Service {
  id: string | number;
  name: string;
  categoryId: number;
}

const signUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is a Required Field"),
  email: Yup.string()
    .email("Invalid Email")
    .required("Email is a Required Field"),
  password: Yup.string()
    .min(8, "Password bust be 8+ characters long")
    .required("Must be at Least 8 Characters"),
  phone: Yup.number().required("Phone is a Required Field"),
  address: Yup.string().required("Address is a Required Field"),
  city: Yup.string().required("City is a Required Field"),
  zipCode: Yup.number().required("Zip Code is a Required Field"),
});

const SignUp = () => {
  const [services, setServices] = useState<Service[]>([]);
  const theme = useTheme();
  const getServices = async () => {
    try {
      const data = await axios.get(
        "https://admin-panel-pple.onrender.com/services"
      );
      setServices(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getServices();
  }, []);

  return (
    <Box
      className={
        theme.palette.mode === "light"
          ? "signup-container"
          : "signup-container-dark"
      }
    >
      <Box className="logo-container" sx={{ width: "250px" }}>
        {theme.palette.mode === "light" ? (
          <img
            className="logo"
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo_rectangle_black.png?alt=media&token=e2faaa6e-f44c-4e07-831b-c970c9e6c8da"
            alt=""
            width="100%"
          />
        ) : (
          <img
            className="logo"
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo-rectangle.png?alt=media&token=9d15ea8c-084a-4999-b51a-b8711cdab59c"
            alt=""
            width="100%"
          />
        )}
      </Box>

      <Box className="main-content-container">
        <Box className="main-container1">
          <Typography
            className={
              theme.palette.mode === "light"
                ? "container1-title"
                : "container1-title-dark"
            }
            variant="h1"
          >
            You're one step away from the
            <span> lead generation </span>
            future.
          </Typography>
        </Box>
        <Box className="main-container2">
          <Formik
            validationSchema={signUpSchema}
            validateOnChange
            initialValues={{
              name: "",
              email: "",
              password: "",
              phone: "",
              city: "",
              address: "",
              zipCode: "",
              services: [],
            }}
            enableReinitialize
            onSubmit={async (values) => {
              console.log(values);
              const companyData = {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                services: values.services, // Asegúrate de que `services` sea un arreglo de IDs
              };

              localStorage.setItem("companyData", JSON.stringify(companyData));
              window.location.href =
                "https://buy.stripe.com/test_5kA6oy1wm2Hu11K288";
            }}
          >
            {({ values, setFieldValue, isValid, errors, touched, dirty }) => {
              // Usamos useEffect para ver los valores cada vez que cambian
              useEffect(() => {
                console.log("Selected services:", values.services);
              }, [values.services]);

              return (
                <Form className="signup-form">
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#1d960d" }}
                  >
                    Sign Up
                  </Typography>
                  <Field name="name" placeholder="Name" />

                  {errors.name && touched.name ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.name}
                    </div>
                  ) : null}

                  <Field name="email" placeholder="Email" />
                  {errors.email && touched.email ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.email}
                    </div>
                  ) : null}
                  <Field
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  {errors.password && touched.password ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.password}
                    </div>
                  ) : null}
                  <Field name="phone" placeholder="Phone" />
                  {errors.phone && touched.phone ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.phone}
                    </div>
                  ) : null}
                  <Field name="address" placeholder="Address" />
                  {errors.address && touched.address ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.address}
                    </div>
                  ) : null}
                  <Field name="city" placeholder="City" />
                  {errors.city && touched.city ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.city}
                    </div>
                  ) : null}
                  <Field name="zipCode" placeholder="Zip Code" required />

                  {errors.zipCode && touched.zipCode ? (
                    <div
                      style={{
                        color: "#f16464",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "Sans-serif",
                      }}
                    >
                      {errors.zipCode}
                    </div>
                  ) : null}

                  <Typography sx={{ margin: "20px 0" }}>
                    Please select the services you offer in the dropdown below
                  </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="signup-select"
                  >
                    <InputLabel id="services-label">Select Services</InputLabel>
                    <Select
                      labelId="services-label"
                      name="services"
                      multiple
                      value={values.services}
                      onChange={(e) => {
                        const selectedValues = Array.isArray(e.target.value)
                          ? e.target.value
                          : [];
                        setFieldValue("services", selectedValues);
                      }}
                      renderValue={(selected) =>
                        (selected as string[])
                          .map(
                            (id) =>
                              services.find((service) => service.id === id)
                                ?.name
                          )
                          .join(", ")
                      }
                      style={{ backgroundColor: "white" }}
                    >
                      {[1, 2, 3].map((categoryId) => (
                        <React.Fragment key={categoryId}>
                          <ListSubheader>
                            {categoryId === 1
                              ? "Car Services"
                              : categoryId === 2
                              ? "Home Services"
                              : "Business Services"}
                          </ListSubheader>
                          {services
                            .filter(
                              (service) => service.categoryId === categoryId
                            )
                            .map((service) => (
                              <MenuItem key={service.id} value={service.id}>
                                {service.name}
                              </MenuItem>
                            ))}
                        </React.Fragment>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    className="signup-submit"
                    disabled={!isValid || !dirty}
                  >
                    Submit
                  </Button>
                  <Box sx={{ textAlign: "center", color: "#000" }}>
                    <Typography>Already have an account?</Typography>
                    <Typography>
                      Log In
                      <span>
                        <span> </span>
                        <Link
                          to="/login"
                          style={{ color: "#88C124", textDecoration: "none" }}
                        >
                          Here
                        </Link>
                      </span>
                    </Typography>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
