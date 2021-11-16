import { Avatar, Grid, Paper, Typography } from "@mui/material";
import React, { PureComponent } from "react";
import ReactPlayer from "react-player";
import MediaQuery from "react-responsive";
import "./AboutUs.css";

class AboutUs extends PureComponent {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <Grid container>
        <Grid item lg={1.5} xs={1}></Grid>
        <Grid item lg={9} xs={10}>
          <div className="video-container">
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                controls={true}
                width="100%"
                height="100%"
                url="https://www.youtube.com/watch?v=i76MCEwno90"
              />
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 64, alignItems: "center" }}>
            <div className="story-container">
              <div className="story-text">
                <Typography variant="h3">Our Story</Typography>
                <br></br>
                <Typography variant="body1">
                  Our focus is to help people with the best way to enjoy travel
                  adventures by finding the NearBy attractions for them. Our bar
                  is high, and we are ready to take on the challenge. We design
                  and implement a creative solution to the everyday problems of
                  users who like to travel and explore places.
                </Typography>
                <br></br>
                <Typography variant="body1">
                  Our product aims to satisfy those who are looking for a simple
                  solution for searching and saving the places they wish to
                  visit. We also offer detailed information as well as Google
                  Maps directions to these destination places according to the
                  user's search. Any newcomer to the place would also find our
                  application useful for exploring nearby locations and managing
                  these places in their user profiles for future reference.
                </Typography>
                <br></br>
                <Typography variant="body1">
                  We would like to stay connected with our users on social media
                  (Facebook, Instagram, Twitter) to share new updates and
                  understand more about their feedback and user experience. We
                  are ecstatic to have this rare opportunity to meet and share
                  experiences with like-minded people interested in exploring
                  this world adventure with The Pioneers Team.
                </Typography>
                <br></br>
                <Typography variant="body1">
                  Feel free to tag us <span className="app-login-color">#NearBy</span>
                </Typography>
              </div>
            </div>
            <MediaQuery minWidth={900}>
            <div style={{ width: "45%" }}>
              <img
                style={{ width: "100%", height: "68vh" }}
                src="/Assets/story.svg"
                alt="storyImage"
              />
            </div>
            </MediaQuery>
          </div>
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <Typography variant="h6" color="text.secondary">
              OUR TEAM
            </Typography>
            <Typography variant="h4" style={{ margin: "4px 0px 12px 0px" }}>
              The Pioneers
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Dedicated Team. For Your Dedicated Dreams
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "wrap",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Paper
              style={{
                display: "flex",
                maxWidth: 350,
                minWidth: 300,
                padding: 24,
                marginLeft: 16,
                marginTop: 16,
                backgroundColor: "rgb(247, 250, 255)",
                alignItems: "center",
              }}
            >
              <Avatar
                variant="rounded"
                src="/Assets/ProfilePhoto2.png"
                alt="personImg"
                style={{ width: 85, height: 85 }}
              />
              <div style={{ marginLeft: 36 }}>
                <Typography variant="h6">Kalyani Nikure</Typography>
                <Typography color="text.secondary">Backend</Typography>
              </div>
            </Paper>
            <Paper
              style={{
                display: "flex",
                maxWidth: 350,
                minWidth: 300,
                marginLeft: 16,
                marginTop: 16,
                padding: 24,
                backgroundColor: "rgb(247, 250, 255)",
                alignItems: "center",
              }}
            >
              <Avatar
                variant="rounded"
                src="/Assets/ProfilePhoto1.jpg"
                alt="personImg"
                style={{ width: 85, height: 85 }}
              />
              <div style={{ marginLeft: 36 }}>
                <Typography variant="h6">Yousef Almutairi</Typography>
                <Typography color="text.secondary">Backend</Typography>
              </div>
            </Paper>
            <Paper
              style={{
                display: "flex",
                maxWidth: 350,
                minWidth: 300,
                marginLeft: 16,
                marginTop: 16,
                padding: 24,
                backgroundColor: "rgb(247, 250, 255)",
                alignItems: "center",
              }}
            >
              <Avatar
                variant="rounded"
                src="/Assets/ProfilePhoto1.jpg"
                alt="personImg"
                style={{ width: 85, height: 85}}
              />
              <div style={{ marginLeft: 36 }}>
                <Typography variant="h6">Piyush Narhire</Typography>
                <Typography color="text.secondary">Frontend</Typography>
              </div>
            </Paper>
            <Paper
              style={{
                display: "flex",
                maxWidth: 350,
                minWidth: 300,
                marginLeft: 16,
                marginTop: 16,
                padding: 24,
                backgroundColor: "rgb(247, 250, 255)",
                alignItems: "center",
              }}
            >
              <Avatar
                variant="rounded"
                src="/Assets/ProfilePhoto1.jpg"
                alt="personImg"
                style={{ width: 85, height: 85 }}
              />
              <div style={{ marginLeft: 36 }}>
                <Typography variant="h6">Vineeth Reddy Sheri</Typography>
                <Typography color="text.secondary">Frontend</Typography>
              </div>
            </Paper>
          </div>
        </Grid>
        <Grid item lg={1.5} xs={1}></Grid>
      </Grid>
    );
  }
}

export default AboutUs;
