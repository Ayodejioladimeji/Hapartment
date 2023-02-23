const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

//
const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
  SENDER_EMAIL,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const welcomeTenantMail = (to, fullname) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: "Thank you for Joining us",
    html: `
      <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Hapartment</title>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Lato', sans-serif;
      }

      section {
        display: flex;
        justify-content: center;
        height: 100%;
      }

      .container {
        width: 100%;
        margin: 20px 0;
        padding: 30px 5px;
        background: #fff;
        border: 1px solid #f8f9fc;
      }

      .header {
        text-align: center;
      }

      .header-image {
        width: 300px;
        object-fit: contain;
      }
      main {
        width: 100%;
        background: #f8f9fc;
        border-radius: 10px;
        margin-top: 20px;
        padding: 40px 10px;
      }

      .heading {
        font-size: 18px;
        margin-bottom: 20px;
        line-height: 30px;
        font-weight: 700;
      }

      .heading img {
        height: 20px;
        width: 20px;
      }

      .code {
        text-align: center;
        font-size: 35px;
        margin-bottom: 30px;
        font-weight: bold;
      }
      .body {
        font-size: 15px;
        margin-bottom: 20px;
        line-height: 30px;
      }
      .reasons {
        font-size: 15px;
        margin-bottom: 20px;
        line-height: 30px;
      }
      footer {
        text-align: center;
        margin-top: 20px;
      }

      footer span {
        display: block;
        margin-top: 20px;
        color: #7e7e7e;
        font-size: 14px;
        line-height: 25px;
        text-align: center;
      }

      footer span strong {
        color: green;
      }

      .social-icons {
        margin: 40px auto 20px auto;
        text-align: center;
      }

      .social-icons a {
        text-decoration: none;
      }

      .social-icons a img {
        width: 25px;
        height: 25px;
        margin-right: 5px;
      }

      .copyrights {
        font-size: 14px;
        color: #7e7e7e;
        text-align: center;
        display: block;
      }

      .button {
        background: green;
        color: #fff;
        padding: 10px 25px;
        border-radius: 5px;
        border: none;
        outline: none;
        margin-bottom: 30px;
        font-size: 15px;
      }

       .thanks {
        margin-top: 50px;
      }

      /* responsiveness */
      @media (min-width: 700px) {
        .container {
          width: 600px;
          padding: 30px 20px;
        }

        main {
          width: 550px;
          padding: 40px 30px;
        }
      }
    </style>
  </head>
  <body>
    <section>
      <div class="container">
        <div class="header">
          <img
            style="width: 120px; margin-bottom: 40px; object-fit: contain"
            src="https://res.cloudinary.com/hapartments/image/upload/v1677132535/logos/Group_11_ggfsko.png"
          />
        </div>

        <main>
          <p class="heading"><b>Hi, Ayodeji Oladimeji</b></p>

          <p class="body">
            <span style="color: green; font-weight: bold"
              >Welcome to Hapartment</span
            ><br />
            You made the right decision to join us and we’re excited about
            giving you exceptional services. Our goal is to help you search for
            apartment easily and provide you with adequate information to help
            you make a well-informed decision.
          </p>

          <p class="body">
            We’ll be sending you important news and updates about
            <span style="color: green">Hapartment</span>, we’ll also send you
            exclusive deals on new available homes in your location and
            apartments for rent.
          </p>

          <p class="thanks">
            Regards,<br /><br />
            <b style="color: green">Hapartment Team</b>
          </p>
        </main>

        <footer>
          <span
            >If you have any questions, concerns or feedback, kindly reach us on
            <strong>support@hapartment.org</strong> or chat us across all our
            social media handles.
          </span>

          <div class="social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=100085724386292&mibextid=ZbWKwL"
              target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294040/hapartment/facebook_mg52gn.png"
                alt="facebook"
              />
            </a>
            <a
              href="https://www.instagram.com/invites/contact/?i=1pqlgg45pg0nl&utm_content=pldblyb"
              target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294036/hapartment/instagram_qqugwq.png"
                alt="instagram"
              />
            </a>
            <a
              href="https://twitter.com/Hapartment11?t=cmOAR5aAypWeGzbLvebt-A&s=09"
              target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294038/hapartment/twitter_nhe4s3.png"
                alt="twitter"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/hapartment-rentals"
              target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671293954/hapartment/linkedin_2_ruzrjf.png"
                alt="linkedin"
              />
            </a>
          </div>

          <p class="copyrights">© 2023 hapartment. All Rights Reserved.</p>
        </footer>
      </div>
    </section>
  </body>
</html>

    `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
};

module.exports = welcomeTenantMail;
