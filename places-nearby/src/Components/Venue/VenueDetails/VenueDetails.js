import React, { Component } from "react";
import { withRouter, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Grid,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { red } from "@mui/material/colors";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LinkIcon from "@mui/icons-material/Link";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import VenueCard from "../VenueCard/VenueCard";
import { withCookies } from "react-cookie";
import LoginDialog from "../../Dialog/LoginDialog/LoginDialog";
import FourSquareCredentials from "../../../FourSquare";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class VenueDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venueId: this.props.match.params.id,
      venueDetails: null,
      nextVenues: null,
      similarVenues: null,
      nextVenuesList: [],
      similarVenuesList: [],
      favouritedVenues: [],
      openLoginDialog: false,
    };
  }

  componentDidMount = () => {
    this.getOneVenueDetails();
    this.getNextVenues();
    this.getSimilarVenues();
    this.getFavourites();
    window.scrollTo(0, 0);
  };

  componentWillReceiveProps = (newProps) => {
    if (this.state.venueId !== newProps.match.params.id) {
      this.setState({ venueId: newProps.match.params.id }, () => {
        this.getOneVenueDetails();
        this.getNextVenues();
        this.getSimilarVenues();
        window.scrollTo(0, 0);
      });
    }
  };

  getOneVenueDetails = async () => {
    const FOURSQUARE_VENUE_BASE_URL =
      "https://api.foursquare.com/v2/venues/" + this.state.venueId + "?";

    let params = {
      client_id: FourSquareCredentials[0].client_id,
      client_secret: FourSquareCredentials[0].client_secret,
      VENUE_ID: this.state.venueId,
      v: 20211002,
    };
    try {
      axios
        .get(FOURSQUARE_VENUE_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState({ venueDetails: res.data.response.venue });
          this.forceUpdate();
        });
    } catch (err) {}
  };

  getAllVenueDetails = async (name) => {
    const FOURSQUARE_VENUE_BASE_URL = "https://api.foursquare.com/v2/venues/";

    let params = {
      client_id: FourSquareCredentials[0].client_id,
      client_secret: FourSquareCredentials[0].client_secret,
      VENUE_ID: "4b57354df964a5201c2b28e3",
      limit: 6,
      v: 20211002,
    };
    try {
      let venueList = [];
      if (name === "nextVenue") {
        this.state.nextVenues.forEach((venue, idx) => {
          params.client_id = FourSquareCredentials[idx % 4].client_id;
          params.client_secret = FourSquareCredentials[idx % 4].client_secret;
          params.VENUE_ID = venue.id;

          let currentVenueURL = FOURSQUARE_VENUE_BASE_URL + venue.id + "?";

          axios
            .get(currentVenueURL + new URLSearchParams(params))
            .then((res) => {
              venueList.push(res.data.response.venue);
              this.setState({ nextVenuesList: venueList });
            });
        });
      } else {
        this.state.similarVenues.forEach((venue, idx) => {
          params.client_id = FourSquareCredentials[idx % 4].client_id;
          params.client_secret = FourSquareCredentials[idx % 4].client_secret;
          params.VENUE_ID = venue.id;

          let currentVenueURL = FOURSQUARE_VENUE_BASE_URL + venue.id + "?";

          axios
            .get(currentVenueURL + new URLSearchParams(params))
            .then((res) => {
              venueList.push(res.data.response.venue);
              this.setState({ similarVenuesList: venueList });
            });
        });
      }
    } catch (err) {}
  };

  getNextVenues = async () => {
    const FOURSQUARE_NEXT_VENUES_BASE_URL =
      "https://api.foursquare.com/v2/venues/" +
      this.state.venueId +
      "/nextvenues?";

    let params = {
      client_id: "1LZ5YXM0BJJ23S0ADBADFZV14T3DLHATKVCFPZ4MZQFPJUEC",
      client_secret: "GBUM13WZBZCUPKUV31ON4J5WB3HAFWF5KYWFULDQDB13L2V2",
      VENUE_ID: this.state.venueId,
      v: 20211002,
    };
    try {
      axios
        .get(FOURSQUARE_NEXT_VENUES_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState(
            { nextVenues: res.data.response.nextVenues.items },
            () => this.getAllVenueDetails("nextVenue")
          );
        });
    } catch (err) {}
  };

  getSimilarVenues = async () => {
    const FOURSQUARE_SIMILAR_VENUES_BASE_URL =
      "https://api.foursquare.com/v2/venues/" +
      this.state.venueId +
      "/similar?";

    let params = {
      client_id: "1LZ5YXM0BJJ23S0ADBADFZV14T3DLHATKVCFPZ4MZQFPJUEC",
      client_secret: "GBUM13WZBZCUPKUV31ON4J5WB3HAFWF5KYWFULDQDB13L2V2",
      VENUE_ID: this.state.venueId,
      v: 20211002,
    };
    try {
      axios
        .get(FOURSQUARE_SIMILAR_VENUES_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState(
            {
              similarVenues: res.data.response.similarVenues.items,
            },
            () => this.getAllVenueDetails("similarVenue")
          );
        });
    } catch (err) {}
  };

  getFavourites = () => {
    try {
      axios
        .get(
          "http://localhost:3001/getFavourites?emailAddress=" +
            this.props.cookies.get("emailId")
        )
        .then((res) => {
          if (res.data.status === "success") {
            this.setState({ favouritedVenues: res.data.response });
          }
        });
    } catch (err) {}
  };

  removeVenueFromFavourite = (venueId, res) => {
    let favouritedVenues = this.state.favouritedVenues;
    const index = favouritedVenues.indexOf(venueId);
    if (index > -1) {
      favouritedVenues.splice(index, 1);
      this.setState({ favouritedVenues });
      this.setState({
        msgSB: res.data.response,
        openSB: true,
        typeSB: res.data.status,
      });
    }
  };

  addVenueToFavourite = (venueId, res) => {
    let favouritedVenues = this.state.favouritedVenues;
    favouritedVenues.push(venueId);
    this.setState({ favouritedVenues });
    this.setState({
      msgSB: res.data.response,
      openSB: true,
      typeSB: res.data.status,
    });
  };

  closeSB = () => {
    this.setState({ openSB: false });
  };

  srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  addToFavouriteList = () => {
    if (!this.props.cookies.get("emailId")) {
      this.setState({ openLoginDialog: true });
    } else {
      try {
        axios
          .post("http://localhost:3001/addFavourite", {
            emailAddress: this.props.cookies.get("emailId"),
            venueId: this.state.venueDetails.id,
          })
          .then((res) => {
            if (res.data.status === "success") {
              this.addVenueToFavourite(this.state.venueDetails.id, res);
            }
          });
      } catch (err) {}
    }
  };

  removeFromFavouriteList = () => {
    try {
      axios
        .post("http://localhost:3001/removeFavourite", {
          emailAddress: this.props.cookies.get("emailId"),
          venueId: this.state.venueDetails.id,
        })
        .then((res) => {
          if (res.data.status === "success") {
            this.removeVenueFromFavourite(this.state.venueDetails.id, res);
          }
        });
    } catch (err) {}
  };

  getCol = (idx) => {
    if (idx % 4 === 0) {
      return 2;
    }
    return 1;
  };

  getRow = (idx) => {
    if (idx % 4 === 0 || idx % 4 === 2) {
      return 2;
    }
    return 1;
  };

  getImageArray = () => {
    let imgArray = this.state.venueDetails.photos.groups[0].items;
    imgArray = imgArray.concat(imgArray);
    return imgArray.slice(0, 4);
  };

  // Avatar Styling
  stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    return color;
  };
  // Avatar Styling
  stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: this.stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  closeLoginDialog = () => {
    this.setState({ openLoginDialog: false });
  };

  render() {
    return (
      <Grid container>
        <Grid item sm={2} xs={1}></Grid>
        {this.state.venueDetails && (
          <Grid item sm={8} xs={10} key={this.state.venueDetails.venueId}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Breadcrumbs
                style={{ flexGrow: 1 }}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link
                  to="/home"
                  component={RouterLink}
                  underline="hover"
                  color="text.primary"
                  href="/"
                >
                  Home
                </Link>
                <Typography color="text.secondary">
                  {this.state.venueDetails.name}
                </Typography>
              </Breadcrumbs>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton>
                  {!this.state.favouritedVenues.includes(
                    this.state.venueDetails.id
                  ) ? (
                    <FavoriteIcon
                      sx={{ fontSize: 22 }}
                      onClick={this.addToFavouriteList}
                    />
                  ) : (
                    <FavoriteIcon
                      sx={{ fontSize: 22, color: red[500] }}
                      onClick={this.removeFromFavouriteList}
                    />
                  )}
                </IconButton>
                <Typography>Save</Typography>
              </div>
            </div>
            <ImageList
              sx={{ height: 450, borderRadius: 6 }}
              variant="quilted"
              cols={4}
              rows={2}
              rowHeight={220}
              gap={8}
            >
              {this.state.venueDetails.photos.groups[0]
                ? this.getImageArray().map((item, idx) => (
                    <ImageListItem
                      key={item.img}
                      cols={this.getCol(idx)}
                      rows={this.getRow(idx)}
                    >
                      <img
                        {...this.srcset(
                          item.prefix +
                            item.width +
                            "x" +
                            item.height +
                            item.suffix,
                          220,
                          item.rows,
                          item.cols
                        )}
                        alt={item.id}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))
                : [1, 2, 3, 4].map((item, idx) => (
                    <ImageListItem
                      key={item}
                      cols={this.getCol(idx)}
                      rows={this.getRow(idx)}
                    >
                      <img src="/Assets/NoImageAva.jpeg" alt={item.id} />
                    </ImageListItem>
                  ))}
            </ImageList>

            <Grid
              container
              style={{ display: "flex", alignItems: "center", marginTop: 32 }}
            >
              <Grid item sm={8}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: "#030140",
                      maxWidth: "80%",
                    }}
                  >
                    {this.state.venueDetails.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#" + this.state.venueDetails.ratingColor,
                      fontWeight: "bold",
                      marginLeft: 14,
                    }}
                  >
                    {this.state.venueDetails.rating}
                  </Typography>
                </div>
                <Typography variant="caption" color="text.secondary">
                  {this.state.venueDetails.location.address &&
                    this.state.venueDetails.location.address}
                  {this.state.venueDetails.location.crossStreet &&
                    " (" + this.state.venueDetails.location.crossStreet + ")"}
                  {this.state.venueDetails.location.address && ", "}
                  {this.state.venueDetails.location.city +
                    ", " +
                    this.state.venueDetails.location.state}
                </Typography>
              </Grid>
              <Grid
                item
                sm={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                {this.state.venueDetails.url && (
                  <Paper style={{ borderRadius: 20, marginRight: 15 }}>
                    <Link
                      href={this.state.venueDetails.url}
                      variant="body2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: -5,
                      }}
                      underline="hover"
                      target="_blank"
                    >
                      <Avatar
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #f3efef",
                        }}
                      >
                        <LinkIcon
                          style={{ width: 24, height: 24 }}
                          color="primary"
                        />
                      </Avatar>
                      <Typography style={{ padding: "0px 12px" }}>
                        Website Link
                      </Typography>
                    </Link>
                  </Paper>
                )}

                <Paper style={{ borderRadius: 20 }}>
                  <Link
                    variant="body2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: -5,
                    }}
                    lat
                    href={`http://maps.google.com/maps/search/?api=1&query=${
                      this.state.venueDetails.name
                    }, ${
                      this.state.venueDetails.location.address
                        ? this.state.venueDetails.location.address
                        : ""
                    }, ${this.state.venueDetails.location.city}, ${
                      this.state.venueDetails.location.state
                    }`}
                    target="_blank"
                    underline="hover"
                  >
                    <Avatar
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #f3efef",
                      }}
                    >
                      <MyLocationIcon
                        style={{ width: 20, height: 20 }}
                        color="primary"
                      />
                    </Avatar>
                    <Typography style={{ padding: "0px 12px" }}>
                      Location
                    </Typography>
                  </Link>
                </Paper>
              </Grid>
            </Grid>

            <Divider style={{ margin: "32px 0px", width: "65%" }} />

            {this.state.venueDetails.description && (
              <div style={{ marginBottom: 32, width: "65%" }}>
                <Typography
                  variant="h5"
                  style={{ color: "#030140", marginBottom: 16 }}
                >
                  About the Location
                </Typography>
                <Typography variant="body2">
                  {this.state.venueDetails.description}
                </Typography>
              </div>
            )}

            <Typography
              variant="h5"
              style={{
                color: "#030140",
                marginBottom: 16,
                fontWeight: "bold",
              }}
            >
              Reviews
            </Typography>
            <div style={{ maxHeight: 400, overflowY: "scroll" }}>
              {this.state.venueDetails.tips.groups.length > 0 ?
                this.state.venueDetails.tips.groups.map(
                  (group) =>
                    group.type === "others" &&
                    group.items.length > 0 &&
                    group.items.map((tip) => (
                      <div
                        style={{
                          display: "flex",
                          marginTop: 10,
                          padding: 10,
                        }}
                      >
                        {tip.user.photo ? (
                          <Avatar
                            style={{ width: 100, height: 100 }}
                            src={
                              tip.user.photo.prefix +
                              "200x200" +
                              tip.user.photo.suffix
                            }
                          ></Avatar>
                        ) : (
                          <Avatar
                            style={{ width: 100, height: 100 }}
                            {...this.stringAvatar(
                              tip.user.firstName + " " + tip.user.lastName
                            )}
                          >
                            {tip.user.firstName && tip.user.firstName[0]}{" "}
                            {tip.user.lastName && tip.user.lastName[0]}
                          </Avatar>
                        )}
                        <div style={{ marginLeft: 20 }}>
                          <Typography variant="h6" style={{ color: "#030140" }}>
                            {tip.user.firstName && tip.user.firstName}{" "}
                            {tip.user.lastName && tip.user.lastName}
                          </Typography>
                          <Typography variant="body2">{tip.text}</Typography>
                        </div>
                      </div>
                    ))
                ) : <Typography style={{marginBottom: 32}}>No Reviews available for the selected venue</Typography>}
            </div>
            {this.state.similarVenuesList.length > 0 && (
              <React.Fragment>
                <Typography
                  variant="h5"
                  style={{
                    color: "#030140",
                    marginBottom: 16,
                    marginTop: 48,
                    marginLeft: "-5vw",
                    marginRight: "-5vw",
                    fontWeight: "bold",
                  }}
                >
                  Simliar Locations
                </Typography>
                <div
                  style={{
                    display: "flex",
                    overflowY: "auto",
                    marginLeft: "-7vw",
                    marginRight: "-5vw",
                  }}
                >
                  {this.state.similarVenuesList.map((venue, idx) => (
                    <VenueCard
                      venue={venue}
                      key={idx}
                      favouritedVenues={this.state.favouritedVenues}
                      removeVenueFromFavourite={this.removeVenueFromFavourite}
                      addVenueToFavourite={this.addVenueToFavourite}
                    />
                  ))}
                </div>
              </React.Fragment>
            )}
            {this.state.nextVenuesList.length > 0 && (
              <React.Fragment>
                <Typography
                  variant="h5"
                  style={{
                    color: "#030140",
                    marginBottom: 16,
                    marginTop: 48,
                    marginLeft: "-5vw",
                    marginRight: "-5vw",
                    fontWeight: "bold",
                  }}
                >
                  Next Venues
                </Typography>
                <div
                  style={{
                    display: "flex",
                    overflowY: "auto",
                    marginLeft: "-7vw",
                    marginRight: "-5vw",
                    marginBottom: 32,
                  }}
                >
                  {this.state.nextVenuesList.map((venue, idx) => (
                    <VenueCard
                      venue={venue}
                      key={idx}
                      favouritedVenues={this.state.favouritedVenues}
                      removeVenueFromFavourite={this.removeVenueFromFavourite}
                      addVenueToFavourite={this.addVenueToFavourite}
                    />
                  ))}
                </div>
              </React.Fragment>
            )}
          </Grid>
        )}
        <Grid item sm={2} xs={1}></Grid>
        <LoginDialog
          open={this.state.openLoginDialog}
          onClose={this.closeLoginDialog}
        />
        <Snackbar
          open={this.state.openSB}
          autoHideDuration={2000}
          onClose={this.closeSB}
        >
          <Alert
            onClose={this.closeSB}
            severity={this.state.typeSB}
            sx={{ width: "100%" }}
          >
            {this.state.msgSB}
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
}

export default withCookies(withRouter(VenueDetails));
