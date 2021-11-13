import React from "react";
import "./App.css";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import AboutUs from "./Components/AboutUs/AboutUs";
import Footer from "./Components/Footer/Footer";
import VenueDetails from "./Components/Venue/VenueDetails/VenueDetails";
import Favourites from "./Components/Favourites/Favourites";

function App() {

  const location = useLocation();

  return (
    <div
      style={
        location.pathname === "/home"
          ? { backgroundImage: "url('./Assets/search.jpeg')" }
          : location.pathname === "/signup"
          ? { backgroundColor: "#EDF6FF" }
          : {}
      }
      className="search-backgrd-img"
    >
      <Header />
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/aboutUs">
          <AboutUs />
        </Route>
        <Route exact path="/venue/:id">
          <VenueDetails />
        </Route>
        <Route exact path="/favourites">
          <Favourites />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
