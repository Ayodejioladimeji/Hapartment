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
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (to) => {
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
    from: "layobright11@gmail.com",
    to: to,
    subject: "Welcome to Hapartment",
    html: `

    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />

    <style type="text/css">
      @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Inter:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700;800&family=Roboto:wght@300;500;700;900&display=swap");

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .major-container {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        font-family: "Nunito Sans";
        background: #449342;
        padding: 30px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .main-container {
        width: 100%;
        background: #fff;
        padding: 0 0 20px 0;
      }

      .nav {
        width: 100%;
      }

      .nav img {
        width: 100%;
      }

      /* mainbody */
      .main-body {
        text-align: center;
        margin-top: 10px;
        padding: 20px;
      }

      .main-body img {
        width: 80px;
        margin-left: 5px;
      }

      .main-body h3 {
        font-size: 22px;
        font-weight: 700;
        margin-top: -5px;
        color: #1a083e;
        font-family: "Roboto";
      }

      .main-body p {
        font-size: 16px;
        font-family: "Nunito Sans";
        margin: 20px 0;
      }

      .main-body small {
        font-size: 16px;
      }

      .main-body h1 {
        margin: 40px 0;
      }

      .thanks {
        text-align: left;
        display: block;
        margin-bottom: 40px;
        font-size: 14px;
      }

      .main-body span {
        display: block;
        margin-top: 20px;
        color: #7e7e7e;
      }

      .main-body span strong {
        color: #1a083e;
      }

      .social-icons {
        margin: 20px auto;
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .fa {
        font-size: 25px;
      }

      .main-body .copyrights {
        font-size: 13px;
        color: #7e7e7e;
        /* margin-bottom:20px; */
      }

      /* The responsiveness section */
      @media (min-width: 768px) {
        .main-container {
          width: 700px;
        }
      }

      @media (max-width: 500px) {
        .main-body span {
          font-size: 14px;
        }

        .main-body .copyrights {
          font-size: 13px;
        }
      }

      @media (max-width: 400px) {
        .main-body h3 {
          font-size: 20px;
        }
      }

      @media (max-width: 300px) {
        .main-body h3 {
          font-size: 17px;
        }
      }
    </style>
  </head>
  <body>
    <div class="major-container">
      <div class="main-container">
        <nav class="nav">
          <img
            src="https://res.cloudinary.com/devsource/image/upload/v1663658948/hapartment/Facebook_cover_-_2_1_dabaxz.png"
          />
        </nav>

        <div class="main-body">
          <img
            src="https://res.cloudinary.com/devsource/image/upload/v1660828415/verifibiz/check-mark_hiaoc2.png"
          />
          <h3>Subscription Successful</h3>

          <p>Thanks for subscribing to our newsletter</p>

          <small class="thanks"
            >Thanks for trusting us <br />
            <b>Hapartment team</b>
          </small>

          <hr />

          <span
            >If you have any questions, concerns or feedback, kindly reach us on
            <strong>support@hapartment.org</strong> or chat us across all our
            social media handles.
          </span>

          <div class="social-icons">
            <a
              href="https://www.facebook.com/Verifibiz_africa-108734885270817/"
              target="_blank"
              ><i class="fa fa-facebook-square" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/verifibiz_africa/"
              target="_blank"
              ><i class="fa fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="" target="_blank"
              ><i class="fa fa-twitter-square" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/verifibiz/"
              target="_blank"
              ><i class="fa fa-linkedin-square" aria-hidden="true"></i>
            </a>
          </div>

          <small class="copyrights">
            © 2022 hapartment. All Rights Reserved.
          </small>
        </div>
      </div>
    </div>
  </body>
</html>

        `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
};

module.exports = sendEmail;
