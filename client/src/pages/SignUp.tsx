import { Box, Button } from "@mui/material";

import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";

const fieldStyle = {
  width: "80%",
  margin: "0px 10px",
  fontSize: "20px",
  padding: "10px 20px",
  border: "1px solid gray",
  borderRadius: "5px",
  outline: "none",
};

interface Services {
  id: string;
  name: string;
}

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
    <Box
      sx={{
        display: "flex",
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          margin: "50px",
          padding: "50px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Box>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Flogo.png?alt=media&token=6defccae-3a0c-4333-80a8-1c1ef024c917"
            alt=""
          />
        </Box>
        <Box
          sx={{
            backgroundColor: "#f1f1f1",
            padding: "40px 30px",
            borderRadius: "10px",
          }}
        >
          <Formik
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
            {({ values, setFieldValue }) => {
              // Usamos useEffect para ver los valores cada vez que cambian
              useEffect(() => {
                console.log("Selected services:", values.services);
              }, [values.services]);

              return (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <Field name="name" style={fieldStyle} placeholder="Name" />
                  <Field name="email" style={fieldStyle} placeholder="Email" />
                  <Field
                    name="password"
                    style={fieldStyle}
                    placeholder="Password"
                    type="password"
                  />
                  <Field name="city" style={fieldStyle} placeholder="City" />
                  <Field
                    name="address"
                    style={fieldStyle}
                    placeholder="Address"
                  />
                  <Field
                    name="zipCode"
                    style={fieldStyle}
                    placeholder="Zip Code"
                  />

                  {/* Campo select múltiple para servicios */}
                  <Field
                    name="services"
                    as="select"
                    multiple
                    style={fieldStyle}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions,
                        (option: HTMLOptionElement) => option.value
                      );
                      // Convertimos las opciones seleccionadas a números
                      const newServices = selectedOptions.map(Number);

                      // Concatenamos los nuevos valores al arreglo existente de services
                      const updatedServices = [
                        ...values.services,
                        ...newServices,
                      ];
                      setFieldValue("services", updatedServices); // Actualizamos el valor en Formik
                    }}
                  >
                    <option value="">Select services</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Field>

                  <Button type="submit" fullWidth>
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
