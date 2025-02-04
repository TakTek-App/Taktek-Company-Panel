import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import "./signup.css";

interface Services {
  id: string;
  name: string;
}
const signUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is a Required Field"),
  email: Yup.string()
    .email("Invalid Email")
    .required("Email is a Required Field"),
  password: Yup.string()
    .min(8, "Password bust be 8+ characters long")
    .required("Must be at Least 8 Characters"),
  address: Yup.string().required("Address is a Required Field"),
  city: Yup.string().required("City is a Required Field"),
  zipCode: Yup.number().required("Zip Code is a Required Field"),
});

const SignUp = () => {
  const [services, setServices] = useState<Services[]>([]);
  const getServices = async () => {
    try {
      const data = await axios.get("http://localhost:3000/services");
      setServices(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getServices();
  }, []);

  return (
    <Box className="signup-container">
      <Box className="logo-container">
        <img
          className="logo"
          src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Flogo.png?alt=media&token=6defccae-3a0c-4333-80a8-1c1ef024c917"
          alt=""
        />
      </Box>

      <Box className="main-content-container">
        <Box className="main-container1">
          <Typography
            className="container1-title"
            variant="h1"
            sx={{
              textAlign: "center",
              textWrap: "balance",
              fontSize: "40px",
              color: "#000",
            }}
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
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                services: values.services, // Asegúrate de que `services` sea un arreglo de IDs
              };
              const data = await axios.post(
                "http://localhost:3000/companies",
                companyData
              );
              console.log(data);
              if (data.status === 201) {
                window.location.href =
                  "https://buy.stripe.com/test_5kA6oy1wm2Hu11K288";
              }
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
                        const selectedValues = e.target.value;
                        setFieldValue("services", selectedValues);
                      }}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) =>
                              services.find((service) => service.id === id)
                                ?.name
                          )
                          .join(", ")
                      }
                      label="Select Services"
                      style={{ backgroundColor: "white" }}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
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
