const express = require("express");
var cors = require("cors");

const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

require("./db/conn");
const User = require("./models/user");
const UserFavourite = require("./models/favourite");
const UserVerfication = require("./models/userVerfication");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello from the main route");
});

app.post("/signup", async (req, res) => {
  try {
    const userInfo = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
    });

    await userInfo.save();
    res
      .status(200)
      .send({ status: "success", response: "Account created sucessfully" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(200).send({
        status: "error",
        error:
          "This email address has already been registered. Log in instead.",
      });
    } else {
      res.status(400).send({ status: "error", error: err });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const userInfo = await User.findOne({ emailAddress }).lean();
    if (userInfo != null && userInfo.password === password) {
      res.status(200).send({ status: "success", response: userInfo });
    } else {
      res.status(200).send({
        status: "error",
        error:
          "The Email Adddress or Password you entered is incorrect. Please try again.",
      });
    }
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

app.post("/forgotPwdEmail", async (req, res) => {
  try {
    const { emailAddress } = req.body;
    const userInfo = await User.findOne({ emailAddress }).lean();
    const userVerficationInfo = await UserVerfication.findOne({
      emailAddress,
    }).lean();
    if (userInfo != null) {

      if (userVerficationInfo != null) {
        await UserVerfication.remove({ emailAddress: emailAddress });
      }

      const randomCode = Math.floor(Math.random() * 899999 + 100000);
      const userVerficationInsert = new UserVerfication({
        emailAddress: req.body.emailAddress,
        verficationCode: randomCode,
      });

      await userVerficationInsert.save();

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nearbyapp9@gmail.com",
          pass: "PlacesNearBy",
        },
      });

      let mailOptions = {
        from: "nearbyapp9@gmail.com",
        to: req.body.emailAddress,
        subject: "NearBy password reset instructions",
        html: `<h2>Reset Your Password</h2></br><p>We got a request to reset the password for your NearBy account. Please use the below code to reset the password which is valid for only 4 mins.<h3>${randomCode}</h3>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send({
        status: "success",
        response: "Email Sent successfully",
      });
    } else {
      res.status(200).send({
        status: "error",
        response:
          "The email address is not registered with NearBy. Provide a valid email address",
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "error",
      response: err,
    });
  }
});

app.post("/resetPwd", async (req, res) => {
  try {
    const { emailAddress, code, password } = req.body;
    const userVerficationInfo = await UserVerfication.findOne({
      emailAddress,
    }).lean();

    if (
      userVerficationInfo != null &&
      code == userVerficationInfo.verficationCode
    ) {
      await User.updateOne(
        { emailAddress },
        { $set: { password: password, updatedAt: new Date()} }
      );

      res.status(200).send({
        status: "success",
        response: "Account password reset is sucessfully",
      });
    } else {
      res.status(200).send({
        status: "error",
        response: "The invalid/Expired Code.",
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "error",
      response: err,
    });
  }
});

app.post("/addFavourite", async (req, res) => {
  try {
    const { emailAddress, venueId } = req.body;
    const result = await UserFavourite.findOne({ emailAddress }).lean();

    if (result == null) {
      const userInfo = new UserFavourite({
        emailAddress: emailAddress,
        favourites: [venueId],
      });
      await userInfo.save();
    } else {
      await UserFavourite.updateOne(
        { emailAddress },
        { $push: { favourites: venueId }, $set: { updatedAt: new Date() } }
      );
    }

    res.status(200).send({
      status: "success",
      response: "The Venue added to the Favourite list sucessfully",
    });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

app.post("/removeFavourite", async (req, res) => {
  try {
    const { emailAddress, venueId } = req.body;

    await UserFavourite.updateOne(
      { emailAddress },
      { $pull: { favourites: venueId }, $set: { updatedAt: new Date() } }
    );

    res.status(200).send({
      status: "success",
      response:
        "The Venue removed from the Favourite list sucessfully",
    });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

app.get("/getFavourites", async (req, res) => {
  try {
    const { emailAddress } = req.query;
    const result = await UserFavourite.findOne({ emailAddress }).lean();
    let response = [];

    if (result != null) {
      response = result.favourites;
    }

    res.status(200).send({
      status: "success",
      response: response,
    });
  } catch (err) {
    res.status(400).send({ status: "error", error: err });
  }
});

app.listen(port, () => {
  console.log("Its running");
});
