import React, { Component } from "react";
import axios from "axios";
import VenueCard from "../Venue/VenueCard/VenueCard";
import { withCookies } from "react-cookie";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class Favourites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favouritedVenues: [],
      venueList: [],
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getFavourites();
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
            this.setState({ favouritedVenues: res.data.response }, () =>
              this.getVenueDetails()
            );
          }
        });
    } catch (err) {}
  };

  getVenueDetails = async () => {
    const FOURSQUARE_VENUE_BASE_URL = "https://api.foursquare.com/v2/venues/";

    let params = {
      client_id: "1LZ5YXM0BJJ23S0ADBADFZV14T3DLHATKVCFPZ4MZQFPJUEC",
      client_secret: "GBUM13WZBZCUPKUV31ON4J5WB3HAFWF5KYWFULDQDB13L2V2",
      VENUE_ID: "4b57354df964a5201c2b28e3",
      v: 20211002,
    };
    try {
      let venueList = [];
      await this.state.favouritedVenues.map(async(venueId, idx) => {
        let currentVenueURL = FOURSQUARE_VENUE_BASE_URL + venueId + "?";
        params.VENUE_ID = venueId;
        await axios.get(currentVenueURL + new URLSearchParams(params)).then((res) => {
          venueList.push(res.data.response.venue);
          this.setState({ venueList });
        });
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

  render() {
    return (
      <div style={{ display: "flex",flexFlow: "wrap",justifyContent: "center",margin: "32px 0px"}}>
        {this.state.venueList.map((venue, idx) => (
          <VenueCard
            venue={venue}
            key={idx}
            latitudeLongtude={this.state.latitudeLongtude}
            favouritedVenues={this.state.favouritedVenues}
            removeVenueFromFavourite={this.removeVenueFromFavourite}
            addVenueToFavourite={this.addVenueToFavourite}
          />
        ))}
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
      </div>
    );
  }
}

export default withCookies(Favourites);
