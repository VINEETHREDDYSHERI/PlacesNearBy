const mongoose = require("mongoose");

const url = `mongodb+srv://placesNearBy:placesNearBy@cluster0.jnbvv.mongodb.net/placesNearByDB?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log("connection sucessful");
    }).catch((err) => {
        console.log(err)
    })