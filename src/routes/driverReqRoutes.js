const express = require("express");
const mongoose = require("mongoose");

const DriverReq = mongoose.model("DriverReq");

const router = express.Router();

router.get("/alldriverReq", async (req, res) => {
  const allReq = await DriverReq.find({});

  res.send(allReq);
});

router.get("/driverRequest/:requestId", async (req, res) => {
  console.log(req.params.requestId);
  try {
    var id = req.params.requestId;
    const data = await DriverReq.findById(id);
    console.log("data", data);
    res.send(data);
  } catch (err) {
    console.log("No data Found bcoz _id is wrong ");
  }
});

router.post("/requestData", async (req, res) => {
  const {
    name,
    contactDetails,
    locations,
    shippingDetails,
    reqActive,
  } = req.body.driverRequestJSON;

  if (!name || !locations || !contactDetails || !shippingDetails) {
    res.status(422).send({ error: "Please Prove all details" });
  }

  try {
    const poolingData = new DriverReq({
      name,
      contactDetails,
      locations,
      shippingDetails,
      reqActive,
    });

    await poolingData.save();
    res.send(poolingData._id);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

module.exports = router;
