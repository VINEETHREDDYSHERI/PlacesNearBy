import { Avatar, Paper, Typography, Link } from '@mui/material';
import React, { Component } from 'react';
import "./Footer.css";


class Footer extends Component {
    render() {
        return (
            <Paper className="footer-container">
                <div style={{display: "flex", marginBottom:4, marginTop: -20}}>
                    <Link href="https://www.facebook.com/profile.php?id=100074596515275" target="_blank"><Avatar style={{padding:6, margin:16}} variant="square" src="/Assets/facebook-icon.svg"></Avatar></Link>
                    <Link href="https://www.instagram.com/placez.nearby/" target="_blank"><Avatar style={{padding:6, margin:16}} variant="square" src="/Assets/instagram-icon.svg"></Avatar></Link>
                    <Link href="https://twitter.com/placeznearby" target="_blank"><Avatar style={{padding:6, margin:16}} variant="square" src="/Assets/twitter-icon.svg"></Avatar></Link>
                </div>
                <div style={{display:"flex", marginBottom:4}}>
                    <Typography style={{marginRight:6}}>Terms of use</Typography>
                    <Typography>|</Typography>
                    <Typography style={{marginLeft:6}}>Privacy Policy</Typography>
                </div>
                <Typography>© 2021 NearBy</Typography>
            </Paper>
        );
    }
}

export default Footer;