const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

const FarmerReq = mongoose.model("FarmerReq");
const DriverReq = mongoose.model("DriverReq");

const router = express.Router();

function getDistance(origin, destination){
    var lat1 = Math.PI * origin["lat"]/180;
    var lat2 = Math.PI * destination["lat"]/180;
    var lon1 = Math.PI * origin["lon"]/180;
    var lon2 = Math.PI * destination["long"]/180;
    // Haversine formula 
    var dlon = lon2 - lon1;
    var dlat = lat2 - lat1;
    var a = Math.sin(dlat / 2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2)**2;
    console.log(lat1,lat2);
    return 2 * Math.asin(Math.sqrt(a)) * 6371;
}

router.get("/pooling", async (req, res) => {
    const farmerReq = await FarmerReq.find({});
    const driverReq = await DriverReq.find({});
    var result = {};
        
    // schedule pooling at 11:59 pm
    cron.schedule("59 23 * * *", function() {
        console.log("---------------------");
        console.log("Running Pooling");

        var numberOfDrivers = driverReq.length
        
        for(var i = 0 ; i < numberOfDrivers ; i++){
            result["driver"+String(i+1)]=[]
        }

        var i = 0;
        for (let driver of driverReq){
            batchWeight = 0
            for (let farmer of farmerReq){ 
                if(batchWeight + farmer["shippingDetails"]["weight"] > driver["shippingDetails"]["weight"])
                    continue
                else if(farmer["reqStatus"] && 
                    driver["shippingDetails"]["grainType"] == farmer["shippingDetails"]["grainType"] && 
                    getDistance(driver["locations"]["origin"], farmer["locations"]["origin"]) <= 20){
                        batchWeight	+= farmer["shippingDetails"]["weight"]
                        farmer["reqStatus"] = false
                        result["driver"+String(i+1)].push(farmer)
                }
            }
            driver["reqStatus"] = false        
            i++
        }
        console.log(result)
    });

    res.send(result);
});