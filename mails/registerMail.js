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

// send register mail
const registerMail = (to, fullname, code) => {
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
        font-family: "arial";
      }

      .major-container {
        width: 100%;
        padding: 30px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .main-container {
        width: 100%;
        background: #fff;
        padding: 0 0 20px 0;
        border: 2px solid #449342;
      }

      .nav {
        width: 100%;
      }

      .nav img {
        width: 100%;
      }

      /* mainbody */
      .main-body {
        padding: 20px;
        height: 100%;
      }

      .heading {
        color: green;
        text-align: center;
        margin-bottom: 50px;
      }

      .code {
        text-align: center;
        color: green;
      }

      .main-body h3 {
        font-size: 22px;
        font-weight: 700;
        color: #1a083e;
        font-family: "Roboto";
      }

      .main-body h2 {
        font-size: 20px;
        margin-top: 20px;
      }

      .main-body p {
        font-size: 16px;
        line-height: 25px;
        font-family: "arial";
        margin: 10px 0;
      }

      .main-body small {
        font-size: 16px;
      }

      .main-body h1 {
        margin: 40px 0;
      }

      .main-body .thanks {
        text-align: left;
        display: block;
        margin-bottom: 40px;
        font-size: 14px;
        margin-top: 50px;
        line-height: 25px;
      }

      .main-body span {
        display: block;
        margin-top: 20px;
        color: #7e7e7e;
        font-size: 14px;
        line-height: 25px;
        text-align: center;
      }

      .main-body span strong {
        color: #1a083e;
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

      .main-body .copyrights {
        font-size: 13px;
        color: #7e7e7e;
        text-align: center;
        display: block;
      }

      /* The responsiveness section */
      @media (min-width: 768px) {
        .main-container {
          width: 700px;
        }
      }

      @media (max-width: 500px) {
        .nav {
          margin-bottom: 0px;
        }

        .main-body {
          padding: 0px 10px;
        }

        .main-body h3 {
          font-size: 18px;
        }

        .main-body h2 {
          font-size: 15px;
        }

        .main-body p {
          font-size: 14px;
        }

        .main-body span {
          font-size: 12px;
        }

        .main-images img {
          height: 170px;
        }

        .main-body .copyrights {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="major-container" style="width: 100%">
      <div class="main-container" style="margin: 0 auto">
        <nav class="nav">
          <img
            style="width: 100%"
            src="https://res.cloudinary.com/devsource/image/upload/v1672499277/hapartment/Facebook_cover_usvkic.png"
          />
        </nav>

        <div class="main-body">
          <h2 class="heading">Your registration was successful</h2>

          <h2>Hi ${fullname},</h2>
          <br />
          <p>Thank you for signing up on hapartment</p>

          <div class="content">
            <p>Please verify your email address with this one time password</p>
            <h1 class="code">${code}</h1>
          </div>

          <p>
            We’ll be sending you important news and updates about Hapartment,
            we’ll also send you exclusive deals on new available homes in your
            location and apartments for rent.
          </p>

          <small class="thanks"
            >Regards,<br />
            <b>Hapartment team</b>
          </small>

          <hr />

          <span
            >If you have any questions, concerns or feedback, kindly reach us on
            <strong>support@hapartment.org</strong> or chat us across all our
            social media handles.
          </span>

          <div class="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100085724386292&mibextid=ZbWKwL" target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294040/hapartment/facebook_mg52gn.png"
                alt="facebook"
              />
            </a>
            <a href="https://www.instagram.com/invites/contact/?i=1pqlgg45pg0nl&utm_content=pldblyb" target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294036/hapartment/instagram_qqugwq.png"
                alt="instagram"
              />
            </a>
            <a href="https://twitter.com/Hapartment11?t=cmOAR5aAypWeGzbLvebt-A&s=09" target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671294038/hapartment/twitter_nhe4s3.png"
                alt="twitter"
              />
            </a>
            <a href="https://www.linkedin.com/in/hapartment-rentals" target="_blank"
              ><img
                src="https://res.cloudinary.com/devsource/image/upload/v1671293954/hapartment/linkedin_2_ruzrjf.png"
                alt="linkedin"
              />
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

module.exports = registerMail;
