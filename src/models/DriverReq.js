const mongoose = require("mongoose");

const DriverReqSchema = new mongoose.Schema({
  farmersAlloted: [String],
  name: String,
  contactDetails: {
    phoneno: Number,
    email: String,
    address: String,
  },
  locations: {
    origin: {
      latitude: Number,
      longitude: Number,
      altitude: Number,
    },
    destination: {
      latitude: Number,
      longitude: Number,
      altitude: Number,
    },
  },
  shippingDetails: {
    grainType: String,

    capacity: Number,
  },
  reqActive: Boolean,
});

mongoose.model("DriverReq", DriverReqSchema);
