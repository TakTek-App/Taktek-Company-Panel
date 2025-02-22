import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(json());

// const sgMail = require("@sendgrid/mail");

// 🔹 Endpoint para guardar la tarjeta del usuario
app.post("/save-card", async (req, res) => {
  const { email, paymentMethodId } = req.body;

  try {
    let customer = await stripe.customers.list({ email });
    customer = customer.data.length ? customer.data[0] : null;

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    res.json({ success: true, customerId: customer.id });
  } catch (error) {
    console.error("Error al guardar la tarjeta:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Endpoint para cobrar automáticamente los viernes
app.post("/charge", async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    // 3️⃣ Crear un pago automático
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount * 100, // Stripe usa centavos
      currency: "usd",
      payment_method_types: ["card"],
      confirm: true,
      off_session: true,
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Endpoint alternativo para cobrar automáticamente
app.post("/charge-user", async (req, res) => {
  const { customerId, amount } = req.body;

  try {
    // 🚨 Verificamos si el cliente tiene un método de pago guardado
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    if (paymentMethods.data.length === 0) {
      return res
        .status(400)
        .json({ error: "El cliente no tiene tarjetas guardadas." });
    }

    // ✅ Tomamos el primer método de pago del cliente
    const paymentMethodId = paymentMethods.data[0].id;

    // ✅ Creamos el PaymentIntent y usamos la tarjeta guardada
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount * 100, // 💲 Convertimos a centavos
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // 🚨 Confirmamos el pago de una vez
      automatic_payment_methods: {
        enabled: true, // ✅ Habilita métodos automáticos
        allow_redirects: "never", // ❌ Evita métodos con redirección
      },
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Error en el pago:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/send-email", (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const msg = {
      to: req.body.to,
      from: req.body.from,
      subject: req.body.subject,
      text: req.body.text,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
      <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
      </style>
      <![endif]-->
  
      <style type="text/css">
        body, p, div {
          font-family: arial;
          font-size: 18px;
        }
        body {
          color: #000000;
        }
        body a {
          color: #1188E6;
          text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
          width:100% !important;
          table-layout: fixed;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img.max-width {
          max-width: 100% !important;
        }
        .column.of-2 {
          width: 50%;
        }
        .column.of-3 {
          width: 33.333%;
        }
        .column.of-4 {
          width: 25%;
        }
        @media screen and (max-width:480px) {
          .preheader .rightColumnContent,
          .footer .rightColumnContent {
              text-align: left !important;
          }
          .preheader .rightColumnContent div,
          .preheader .rightColumnContent span,
          .footer .rightColumnContent div,
          .footer .rightColumnContent span {
            text-align: left !important;
          }
          .preheader .rightColumnContent,
          .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
          }
          table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
          }
          img.max-width {
            height: auto !important;
            max-width: 480px !important;
          }
          a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .columns {
            width: 100% !important;
          }
          .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      </style>
      <!--user entered Head Start-->
      
       <!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 18px; font-family: arial; color: #000000; background-color: #FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
                            <center>
                            <table><tr><td width="600">
                            <![endif]-->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                              <tr>
                                <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left">
                                  
      <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"
             style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
        <tr>
          <td role="module-content">
            <p></p>
          </td>
        </tr>
      </table>
    
      <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;background-color:#ffffff;" valign="top" align="center">
            <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/bccfe24e399eb7cc5e99b3fbf48dff5f6c12cf15d7fdf3a0b608c3f456b06f69.png" alt="" width="600">
          </td>
        </tr>
      </table>
    
      <table class="module"
             role="module"
             data-type="divider"
             border="0"
             cellpadding="0"
             cellspacing="0"
             width="100%"
             style="table-layout: fixed;">
        <tr>
          <td style="padding:0px 0px 0px 0px;"
              role="module-content"
              height="100%"
              valign="top"
              bgcolor="">
            <table border="0"
                   cellpadding="0"
                   cellspacing="0"
                   align="center"
                   width="100%"
                   height="2px"
                   style="line-height:2px; font-size:2px;">
              <tr>
                <td
                  style="padding: 0px 0px 2px 0px;"
                  bgcolor="#000000"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    
      <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
              height="100%"
              valign="top"
              bgcolor="">
              <div>Thank you for contacting support, we will be in touch with your issue soon!</div>
  
  <div>&nbsp;</div>
  
  <div>Thank you for your patience.<br>
  <br>
  Regards.</div>
  
  <div><br>
  TakTek Support Team.</div>
          </td>
        </tr>
      </table>
    
      <table class="module"
             role="module"
             data-type="spacer"
             border="0"
             cellpadding="0"
             cellspacing="0"
             width="100%"
             style="table-layout: fixed;">
        <tr>
          <td style="padding:0px 0px 30px 0px;"
              role="module-content"
              bgcolor="">
          </td>
        </tr>
      </table>
    
                                </td>
                              </tr>
                            </table>
                            <!--[if mso]>
                            </td></tr></table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
      `,
    };

    const msg2 = {
      to: "tech@taktek.app",
      from: req.body.from,
      subject: req.body.subject,
      text: req.body.text,
      html: `
      <p>${req.body.text}</p>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email Sent to User");
      })
      .catch((error) => {
        console.error(error);
      });
    sgMail
      .send(msg2)
      .then(() => console.log("Email Sent to Taktek"))
      .catch((error) => {
        console.error(error);
      });
    res
      .status(200)
      .json({ success: true, message: "Email Sent Successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Sending the Email",
      error,
    });
    console.error(error);
  }
});

// Iniciar el servidor
app.listen(3001, () => console.log("Server running on port 3001"));
