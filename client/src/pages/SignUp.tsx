import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";

import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
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
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
      }}
    >
      <Box sx={{ margin: "20px", width: "250px" }}>
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

      <Box
        sx={{
          display: { xs: "flex", md: "grid" },
          flexDirection: "column",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            display: "flex",
            margin: "auto",
            width: { xs: "90%", md: "80%" },
            marginTop: { xs: "50px", md: "auto" },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: theme.palette.mode === "light" ? "#000000" : "#ffffff",
              textAlign: "center",
              textWrap: "balance",
              fontSize: "40px",
            }}
          >
            You're one step away from the
            <span
              style={{
                color: "#1d71bf",
                fontWeight: "bold",
              }}
            >
              {" "}
              lead generation{" "}
            </span>
            future.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "90%", md: "60%" },
            marginTop: { xs: "50px", md: "auto" },
            margin: "auto",
          }}
        >
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
                <Form
                  style={{
                    backgroundColor:
                      theme.palette.mode === "light" ? "#f7f7f7" : "#121212",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    padding: "40px 20px",
                    margin: "20px",
                    marginBottom: "100px",
                    borderRadius: "10px",
                    gap: "10px",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0px 0px 50px 10px #00000034"
                        : "0px 0px 10px 2px rgba(255, 255, 255, 0.34)",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#1d960d" }}
                  >
                    Sign Up
                  </Typography>
                  <Field
                    name="name"
                    placeholder="Name"
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />

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

                  <Field
                    name="email"
                    placeholder="Email"
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />
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
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
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
                  <Field
                    name="phone"
                    placeholder="Phone"
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />
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
                  <Field
                    name="address"
                    placeholder="Address"
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />
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
                  <Field
                    name="city"
                    placeholder="City"
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />
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
                  <Field
                    name="zipCode"
                    placeholder="Zip Code"
                    required
                    style={{
                      fontSize: "18px",
                      lineHeight: 2,
                      padding: "5px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                      border: "1px solid #c2c2c2",
                      width: "80%",
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#ffffff"
                          : "#ffffff15",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  />

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

                  <Typography
                    sx={{
                      margin: "20px 0",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  >
                    Please select the services you offer in the dropdown below
                  </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                      display: "flex",
                      fontSize: "18px",
                      lineHeight: 2,
                      maxWidth: "80%",
                      width: "100%",
                    }}
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
                        console.log(selectedValues);
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
                      {/* {[1, 2, 3].map((categoryId) => {
                        return (
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
                              .map((service) => {
                                return (
                                  <MenuItem key={service.id} value={service.id}>
                                    {service.name}
                                  </MenuItem>
                                );
                              })}
                          </React.Fragment>
                        );
                      })} */}
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    sx={{
                      width: "80%",
                    }}
                    disabled={!isValid || !dirty}
                  >
                    Submit
                  </Button>
                  <Box
                    sx={{
                      textAlign: "center",
                      color:
                        theme.palette.mode === "light" ? "#000000" : "#ffffff",
                    }}
                  >
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
