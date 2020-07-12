const express = require("express");
const mongoose = require("mongoose");

const FarmerReq = mongoose.model("FarmerReq");

const router = express.Router();

router.get("/farmerRequest/:requestId", async (req, res) => {
  console.log(req.params.requestId);
  try {
    var id = req.params.requestId;
    const data = await FarmerReq.findById(id);
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
  } = req.body.farmerRequestJSON;

  if (
    !name ||
    !locations ||
    !requestId ||
    !contactDetails ||
    !shippingDetails
  ) {
    res.status(422).send({ error: "Please Prove all details" });
  }

  try {
    const poolingData = new FarmerReq({
      name,
      contactDetails,
      locations,
      shippingDetails,
      reqActive,
    });

    await poolingData.save();
    res.send(poolingData._id);
  } catch (err) {
    console.log(err);
    res.status(422).send(err.message);
  }
});

module.exports = router;
