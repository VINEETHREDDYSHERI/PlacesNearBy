import React, { Component } from "react";
import {
  Button,
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Link,
  Avatar,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./Home.css";
import axios from "axios";
import VenueCard from "../Venue/VenueCard/VenueCard";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import OutsideClickHandler from "react-outside-click-handler";
import FourSquareCredentials from "../../FourSquare";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LocationDialog from "../Dialog/LocationDialog/LocationDialog";

const ranges = [
  "5 miles",
  "10 miles",
  "15 miles",
  "20 miles",
  "25 miles",
  "30 miles",
  "40 miles",
  "50 miles",
  "60 miles",
];

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      width: 250,
    },
  },
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venueSearchTerm: "",
      location: "",
      selectedRootCategory: [],
      selectedSubCategory: [],
      range: "",
      advanceSearch: false,
      geoLocation: {},
      latitudeLongtude: "",
      exploreVenueList: [],
      venueList: [],
      suggestions: [],
      categoryList: [],
      personName: [],
      favouritedVenues: [],
      noOfVenues: 10,
      openLocationEnableDialog: false
    };
  }

  handleChange = (event, name) => {
    if (name === "location" && this.state.location === "NearBy Location") {
      this.setState({ location: "" });
    } else {
      this.setState({ [name]: event.target.value });
    }
    if (name === "venueSearchTerm") {
      if (this.state.location !== "") {
        this.getSuggestions();
        this.setState({venueList: [], exploreVenueList: []})
      }
    }
  };

  handleChangeCategory = (event, name) => {
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  getAndSetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((loc) => {
      this.setState({
        geoLocation: loc,
        latitudeLongtude: loc.coords.latitude + "," + loc.coords.longitude,
        location: "NearBy Location"
      });
    });
  };

  componentDidMount = async() => {
    window.scrollTo(0, 0);
    this.getAndSetCurrentLocation();
    this.getCategories();
    this.getFavourites();
  };

  getCategories = () => {
    const FOURSQUARE_CATEGORIES_BASE_URL =
      "https://api.foursquare.com/v2/venues/categories?";

    let params = {
      client_id: FourSquareCredentials[0].client_id,
      client_secret: FourSquareCredentials[0].client_secret,
      v: 20211002,
    };

    try {
      axios
        .get(FOURSQUARE_CATEGORIES_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState({ categoryList: res.data.response.categories });
        });
    } catch (err) {}
  };

  getSuggestions = () => {
    const FOURSQUARE_SUGGESTION_BASE_URL =
      "https://api.foursquare.com/v2/search/autocomplete?";

    let params = {
      client_id: "H5EETN0LSQSI5BI543FMCNKXV1EYWJFI2FVW3JRGPRSVS4UK",
      client_secret: "MIXINUYYB1S2TB542ZYEA5U1HXS1VCOHNTR41DKR3CLB34CG",
      group: "unified",
      query: this.state.venueSearchTerm,
      v: 20211002,
      limit: 100,
      radius: 20000,
    };
    if (this.state.location === "NearBy Location") {
      params.ll = this.state.latitudeLongtude;
    } else {
      params.near = this.state.location;
    }

    try {
      axios
        .get(FOURSQUARE_SUGGESTION_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState({
            showSuggestion: true,
            suggestions: res.data.response.groups[0].items,
          });
        });
    } catch (err) {}
  };

  getVenues = () => {
    this.setState({ showSuggestion: false });
    const FOURSQUARE_EXPLORE_BASE_URL =
      "https://api.foursquare.com/v2/venues/explore?";

    let params = {
      client_id: FourSquareCredentials[0].client_id,
      client_secret: FourSquareCredentials[0].client_secret,
      query: this.state.venueSearchTerm,
      v: 20211002,
      limit: 60,
      radius: 20000,
    };
    if (this.state.location === "NearBy Location") {
      params.ll = this.state.latitudeLongtude;
    } else {
      params.near = this.state.location;
    }

    try {
      axios
        .get(FOURSQUARE_EXPLORE_BASE_URL + new URLSearchParams(params))
        .then((res) => {
          this.setState(
            { exploreVenueList: res.data.response.groups[0].items },
            () => this.getVenueDetails()
          );
        });
    } catch (err) {}
  };

  getVenueDetails = async () => {
    const FOURSQUARE_VENUE_BASE_URL = "https://api.foursquare.com/v2/venues/";

    let params = {
      client_id: FourSquareCredentials[0].client_id,
      client_secret: FourSquareCredentials[0].client_secret,
      VENUE_ID: "",
      v: 20211002,
    };
    try {
      let venueList = this.state.venueList;
      this.state.exploreVenueList.forEach((venue, idx) => {
        if ( idx>= (this.state.noOfVenues-10) && idx < this.state.noOfVenues) {
          params.client_id = FourSquareCredentials[idx % 4].client_id;
          params.client_secret = FourSquareCredentials[idx % 4].client_secret;
          params.VENUE_ID = venue.venue.id;

          let currentVenueURL =
            FOURSQUARE_VENUE_BASE_URL + venue.venue.id + "?";

          axios
            .get(currentVenueURL + new URLSearchParams(params))
            .then((res) => {
              venueList.push(res.data.response.venue);
              this.setState({ venueList });
            });
        }
      });
    } catch (err) {}
  };

  getSelectedCategoryNames = (selected) => {
    let selectedNames = "";
    selected.forEach((category) => {
      selectedNames += category.name + ", ";
    });
    return selectedNames.slice(0, -2);
  };

  selectedSuggestion = (selectedSuggestion) => {
    this.setState({ showSuggestion: false });
    if (selectedSuggestion.type === "query") {
      this.setState({ venueSearchTerm: selectedSuggestion.text }, () =>
        this.getVenues()
      );
    } else {
      this.props.history.push("/venue/" + selectedSuggestion.object.id);
    }
  };

  getFavourites = () => {
    try {
      axios
        .get(
          "https://nearby-backend-app.herokuapp.com/getFavourites?emailAddress=" +
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

  getMoreVenues = () => {
    let noOfVenues = this.state.noOfVenues + 10;
    this.setState({ noOfVenues }, ()=> this.getVenueDetails());
  }

  onCloseLocDialog = () => {
    this.setState({openLocationEnableDialog: false})
  }

  validateLoc = () => {
    if (this.state.location === "") {
      this.setState({openLocationEnableDialog: true})
    }
  }

  render() {
    return (
      <div className="search-msg">
        <Typography variant="h2" className="search-main-msg">
          Life is short <br></br>and World is wide!
        </Typography>
        <Typography variant="body" className="search-body-msg">
          To get the best of your adventure you just need to leave and go where
          you like.<br></br> We are here to help you out.
        </Typography>

        <div className="search-container">
          <OutsideClickHandler
            onOutsideClick={() => this.setState({ showSuggestion: false })}
          >
            <div className="search-form">
              <TextField
                style={{ flexGrow: 3 }}
                placeholder="Enter Venue"
                value={this.state.venueSearchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                onFocus={(event) => this.handleChange(event, "venueSearchTerm")}
                onClick={()=> this.validateLoc()}
                onChange={(event) =>
                  this.handleChange(event, "venueSearchTerm")
                }
              />
              <Divider orientation="vertical" flexItem />
              <TextField
                style={{ flexGrow: 1 }}
                placeholder="Location"
                value={this.state.location}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => this.handleChange(event, "location")}
                onClick={(event) =>
                  event.target.value.trim() === "NearBy Location" &&
                  this.setState({ location: "" })
                }
                onBlur={(event) =>
                  event.target.value.trim() === "" && this.state.latitudeLongtude !== "" &&
                  this.setState({ location: "NearBy Location" })
                }
              />
              <Button
                variant="contained"
                style={{
                  flexGrow: 1,
                  marginLeft: 24,
                  maxHeight: 48,
                  maxWidth: 128,
                }}
                onClick={this.getVenues}
              >
                Search
              </Button>
            </div>
            <div className="advance-btn">
              <Link
                component="button"
                underline="hover"
                variant="subtitle2"
                onClick={() => {
                  this.setState({ advanceSearch: !this.state.advanceSearch });
                }}
              >
                Advance Search
              </Link>
            </div>
            {!this.state.showSuggestion && this.state.advanceSearch && (
              <React.Fragment>
                <Divider />
                <div className="search-filter">
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      multiple
                      value={this.state.selectedRootCategory}
                      onChange={(event) =>
                        this.handleChangeCategory(event, "selectedRootCategory")
                      }
                      input={<OutlinedInput label="Category" />}
                      renderValue={(selected) =>
                        this.getSelectedCategoryNames(selected)
                      }
                      MenuProps={MenuProps}
                    >
                      {this.state.categoryList.map((category, idx) => (
                        <MenuItem key={idx} value={category}>
                          <Checkbox
                            checked={
                              this.state.selectedRootCategory.indexOf(
                                category
                              ) > -1
                            }
                          />
                          <ListItemText primary={category.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>Sub-Category</InputLabel>
                    <Select
                      multiple
                      value={this.state.selectedSubCategory}
                      onChange={(event) =>
                        this.handleChangeCategory(event, "selectedSubCategory")
                      }
                      input={<OutlinedInput label="Sub-Category" />}
                      renderValue={(selected) =>
                        this.getSelectedCategoryNames(selected)
                      }
                      MenuProps={MenuProps}
                    >
                      {this.state.selectedRootCategory.length === 0 && (
                        <MenuItem key={-1} disabled>
                          <ListItemText primary="Select Atleast one Category" />
                        </MenuItem>
                      )}
                      {this.state.selectedRootCategory.map((rootCategory) =>
                        rootCategory.categories.map((subCategory, idx) => (
                          <MenuItem key={idx} value={subCategory}>
                            <Checkbox
                              checked={
                                this.state.selectedSubCategory.indexOf(
                                  subCategory
                                ) > -1
                              }
                            />
                            <ListItemText primary={subCategory.name} />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, width: 200 }}>
                    <InputLabel>Range</InputLabel>
                    <Select
                      value={this.state.range}
                      onChange={(event) => this.handleChange(event, "range")}
                      input={<OutlinedInput label="Range" />}
                      renderValue={(selected) => selected}
                      MenuProps={MenuProps}
                    >
                      {ranges.map((range) => (
                        <MenuItem key={range} value={range}>
                          <ListItemText primary={range} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </React.Fragment>
            )}

            {this.state.showSuggestion && (
              <div
                style={{
                  backgroundColor: "white",
                  maxHeight: 340,
                  overflowY: "scroll",
                  borderRadius: 15,
                }}
              >
                {this.state.suggestions.map((suggestion) => (
                  <MenuItem onClick={() => this.selectedSuggestion(suggestion)}>
                    {!suggestion.text.includes("More results for") &&
                      (suggestion.type === "query" ? (
                        <Avatar
                          sx={{ width: 36, height: 36, marginRight: 2 }}
                          alt="Icon"
                          src={
                            suggestion.object.icon.prefix +
                            "60" +
                            suggestion.object.icon.name
                          }
                        />
                      ) : (
                        suggestion.object.bestPhoto && (
                          <Avatar
                            sx={{ width: 36, height: 36, marginRight: 2 }}
                            variant="rounded"
                            alt="Icon"
                            src={
                              suggestion.object.bestPhoto.prefix +
                              "60x60" +
                              suggestion.object.bestPhoto.suffix
                            }
                          />
                        )
                      ))}
                    {!suggestion.text.includes("More results for") &&
                      suggestion.text}
                  </MenuItem>
                ))}
              </div>
            )}
          </OutsideClickHandler>
        </div>

        <div
          style={
            this.state.suggestions.length > 2 && this.state.showSuggestion
              ? {
                  display: "flex",
                  flexFlow: "wrap",
                  justifyContent: "center",
                }
              : this.state.advanceSearch
              ? {
                  marginTop: "12vh",
                  display: "flex",
                  flexFlow: "wrap",
                  justifyContent: "center",
                }
              : {
                  marginTop: "26vh",
                  display: "flex",
                  flexFlow: "wrap",
                  justifyContent: "center",
                }
          }
        >
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
        </div>
        {(this.state.venueList.length > 0 && (this.state.noOfVenues < this.state.exploreVenueList.length)) && (
          <Button variant="contained" style={{ marginTop: 32 }} onClick={this.getMoreVenues}>
            Load More
          </Button>
        )}
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
        <LocationDialog onClose={this.onCloseLocDialog} open={this.state.openLocationEnableDialog} />
      </div>
    );
  }
}

export default withCookies(withRouter(Home));
