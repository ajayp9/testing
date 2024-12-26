// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Sample data for stops
const stops = [
    { id: 1, 
      name: "Stop A", 
      location: { lat: 12.9716, lon: 77.5946 }, 
      demand: { weekday: 50, weekend: 80 }, 
      supply: 5 },

    { id: 2, 
      name: "Stop B", 
      location: { lat: 12.9352, lon: 77.6245 }, 
      demand: { weekday: 70, weekend: 100 }, 
      supply: 2 },

    { id: 3, 
      name: "Stop C", 
      location: { lat: 12.9141, lon: 77.6109 }, 
      demand: { weekday: 60, weekend: 90 }, 
      supply: 4 },

    { id: 4, 
      name: "Stop D", 
      location: { lat: 12.9784, lon: 77.6408 }, 
      demand: { weekday: 80, weekend: 110 }, 
      supply: 3 },

    { id: 5, 
      name: "Stop E", 
      location: { lat: 12.9857, lon: 77.6058 }, 
      demand: { weekday: 55, weekend: 75 }, 
      supply: 6 },

    { id: 6, 
      name: "Stop F", 
      location: { lat: 12.9304, lon: 77.6783 }, 
      demand: { weekday: 65, weekend: 95 }, 
      supply: 1 },

    { id: 7, 
      name: "Stop G", 
      location: { lat: 12.9250, lon: 77.5897 }, 
      demand: { weekday: 40, weekend: 60 }, 
      supply: 7 },

    { id: 8, 
      name: "Stop H", 
      location: { lat: 12.9279, lon: 77.6271 }, 
      demand: { weekday: 75, weekend: 120 }, 
      supply: 2 },

    { id: 9, 
      name: "Stop I", 
      location: { lat: 12.9568, lon: 77.7011 }, 
      demand: { weekday: 90, weekend: 130 }, 
      supply: 4 },

    { id: 10, 
      name: "Stop J", 
      location: { lat: 12.9165, lon: 77.6001 }, 
      demand: { weekday: 45, weekend: 70 }, 
      supply: 5 }
];

// Utility function to calculate the Haversine distance
function haversineDistance(coord1, coord2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(coord1.lat);
    const φ2 = toRadians(coord2.lat);
    const Δφ = toRadians(coord2.lat - coord1.lat);
    const Δλ = toRadians(coord2.lon - coord1.lon);

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Utility function to calculate demand based on time
function calculateDemand(stop, isWeekend, hour) {
    const baseDemand = isWeekend ? stop.demand.weekend : stop.demand.weekday;
    const peakMultiplier = hour >= 8 && hour <= 10 || hour >= 17 && hour <= 20 ? 1.5 : 1;
    return baseDemand * peakMultiplier;
}

// Utility function to calculate the score for each stop
function calculateScore(stop, driverLocation, isWeekend, hour) {
    const demand = calculateDemand(stop, isWeekend, hour);
    const distance = haversineDistance(driverLocation, { lat: stop.location.lat, lon: stop.location.lon });
    const score = (demand / (stop.supply , 1)) / (distance + 1); // Avoid divide-by-zero
    return score;
}

// POST /next-stop endpoint
app.post('/next-stop', (req, res) => {
    const { currentLocation, currentTime } = req.body;

    if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
        return res.status(400).json({ error: "Invalid location. Provide latitude and longitude." });
    }

    if (!currentTime || isNaN(Date.parse(currentTime))) {
        return res.status(400).json({ error: "Invalid time. Provide a valid timestamp." });
    }
    

    const driverLocation = { lat: currentLocation.latitude, lon: currentLocation.longitude };
    const date = new Date(currentTime);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
    const hour = date.getHours();

    let bestStop = null;
    let highestScore = -Infinity;

    stops.forEach(stop => {
        const score = calculateScore(stop, driverLocation, isWeekend, hour);
        if (score > highestScore) {
            highestScore = score;
            bestStop = stop;
        }
    });

    if (bestStop) {
        res.json({
            nextStop: {
                id: bestStop.id,
                name: bestStop.name,
                location: {
                    latitude: bestStop.location.lat,
                    longitude: bestStop.location.lon
                }
            }
        });
    } else {
        res.status(404).json({ error: "No stops available." });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});












// // Import required modules
// const express = require('express');
// const bodyParser = require('body-parser');

// // Initialize the app
// const app = express();
// app.use(bodyParser.json());

// // Sample data for stops
// const stops = [
//     { id: 1, 
//       name: "Stop A", 
//       location: { lat: 12.9716, lon: 77.5946 }, 
//       demand: { weekday: 50, weekend: 80 }, 
//       supply: 5 },

//     { id: 2, 
//       name: "Stop B", 
//       location: { lat: 12.9352, lon: 77.6245 }, 
//       demand: { weekday: 70, weekend: 100 }, 
//       supply: 2 },

//     { id: 3, 
//       name: "Stop C", 
//       location: { lat: 12.9141, lon: 77.6109 }, 
//       demand: { weekday: 60, weekend: 90 }, 
//       supply: 4 },

//     { id: 4, 
//       name: "Stop D", 
//       location: { lat: 12.9784, lon: 77.6408 }, 
//       demand: { weekday: 80, weekend: 110 }, 
//       supply: 3 },

//     { id: 5, 
//       name: "Stop E", 
//       location: { lat: 12.9857, lon: 77.6058 }, 
//       demand: { weekday: 55, weekend: 75 }, 
//       supply: 6 },

//     { id: 6, 
//       name: "Stop F", 
//       location: { lat: 12.9304, lon: 77.6783 }, 
//       demand: { weekday: 65, weekend: 95 }, 
//       supply: 1 },

//     { id: 7, 
//       name: "Stop G", 
//       location: { lat: 12.9250, lon: 77.5897 }, 
//       demand: { weekday: 40, weekend: 60 }, 
//       supply: 7 },

//     { id: 8, 
//       name: "Stop H", 
//       location: { lat: 12.9279, lon: 77.6271 }, 
//       demand: { weekday: 75, weekend: 120 }, 
//       supply: 2 },

//     { id: 9, 
//       name: "Stop I", 
//       location: { lat: 12.9568, lon: 77.7011 }, 
//       demand: { weekday: 90, weekend: 130 }, 
//       supply: 4 },

//     { id: 10, 
//       name: "Stop J", 
//       location: { lat: 12.9165, lon: 77.6001 }, 
//       demand: { weekday: 45, weekend: 70 }, 
//       supply: 5 }
// ];

// // Utility function to calculate the Haversine distance
// function haversineDistance(coord1, coord2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;

//     const R = 6371e3; // Earth's radius in meters
//     const φ1 = toRadians(coord1.lat);
//     const φ2 = toRadians(coord2.lat);
//     const Δφ = toRadians(coord2.lat - coord1.lat);
//     const Δλ = toRadians(coord2.lon - coord1.lon);

//     const a = Math.sin(Δφ / 2) ** 2 +
//               Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
// }

// // Utility function to calculate demand based on time
// function calculateDemand(stop, isWeekend, hour) {
//     const baseDemand = isWeekend ? stop.demand.weekend : stop.demand.weekday;
//     const peakMultiplier = hour >= 8 && hour <= 10 || hour >= 17 && hour <= 20 ? 1.5 : 1;
//     return baseDemand * peakMultiplier;
// }

// // Utility function to calculate the score for each stop
// function calculateScore(stop, driverLocation, isWeekend, hour) {
//     const demand = calculateDemand(stop, isWeekend, hour);
//     const distance = haversineDistance(driverLocation, { lat: stop.location.lat, lon: stop.location.lon });
//     const score = (demand / (stop.supply , 1)) / (distance + 1); // Avoid divide-by-zero
//     return score;
// }

// // POST /next-stop endpoint
// app.post('/next-stop', (req, res) => {
//     const { currentLocation, currentTime } = req.body;

//     if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
//         return res.status(400).json({ error: "Invalid location. Provide latitude and longitude." });
//     }

//     if (!currentTime || isNaN(Date.parse(currentTime))) {
//         return res.status(400).json({ error: "Invalid time. Provide a valid timestamp." });
//     }
    

//     const driverLocation = { lat: currentLocation.latitude, lon: currentLocation.longitude };
//     const date = new Date(currentTime);
//     const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
//     const hour = date.getHours();

//     let bestStop = null;
//     let highestScore = -Infinity;

//     stops.forEach(stop => {
//         const score = calculateScore(stop, driverLocation, isWeekend, hour);
//         if (score > highestScore) {
//             highestScore = score;
//             bestStop = stop;
//         }
//     });

//     if (bestStop) {
//         res.json({
//             nextStop: {
//                 id: bestStop.id,
//                 name: bestStop.name,
//                 location: {
//                     latitude: bestStop.location.lat,
//                     longitude: bestStop.location.lon
//                 }
//             }
//         });
//     } else {
//         res.status(404).json({ error: "No stops available." });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });













// // Import necessary modules
// const express = require('express');
// const app = express();
// const PORT = 2000;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Sample data
// const stops = [
//   { id: 1, name: 'Stop A', location: { lat: 25.351453, lon: 82.972970 }, demand: {}, supply: 5 },
//   { id: 2, name: 'Stop B', location: { lat: 25.351475, lon: 82.996253 }, demand: {}, supply: 3 },
//   { id: 3, name: 'Stop C', location: { lat: 25.260151, lon: 82.846514 }, demand: {}, supply: 8 },
//   { id: 4, name: 'Stop D', location: { lat: 25.326810, lon: 82.986365 }, demand: {}, supply: 7 },
// ];

// // Generate demand data as a function of time and day
// function getDemandForStop(stopId, time, day) {
//   // Simulate demand based on stopId, time, and day
//   const baseDemand = stopId * 10;
//   const peakMultiplier = (time >= 8 && time <= 11) || (time >= 17 && time <= 20) ? 2 : 1;
//   const weekendMultiplier = day === 6 || day === 0 ? 1.5 : 1;

//   return baseDemand * peakMultiplier * weekendMultiplier;
// }

// // Haversine formula to calculate distance between two coordinates
// function haversineDistance(lat1, lon1, lat2, lon2) {
//   const toRadians = (degree) => (degree * Math.PI) / 180;
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Distance in kilometers
// }

// // Calculate score for each stop
// function calculateScore(demand, supply, distance) {
//   const demandWeight = 0.5;
//   const supplyWeight = 0.3;
//   const distanceWeight = 0.2;

//   return demand * demandWeight - supply * supplyWeight - distance * distanceWeight;
// }

// // API Endpoint to get the next best stop
// app.post('/next-stop', (req, res) => {
//  try{
//   const { currentLocation, time, day } = req.body;
//   if (!currentLocation || !time || day === undefined) {
//     return res.status(400).json({ error: 'Invalid request. Provide currentLocation, time, and day.' });
//   }

//   const { lat, lon } = currentLocation;

//   const scores = stops.map((stop) => {
//     const demand = getDemandForStop(stop.id, time, day);
//     const distance = haversineDistance(lat, lon, stop.location.lat, stop.location.lon);
//     const score = calculateScore(demand, stop.supply, distance);

//     return { stop, score };
//   });

//   scores.sort((a, b) => b.score - a.score);
//   const nextBestStop = scores[0]?.stop;

//   if (!nextBestStop) {
//     return res.status(500).json({ error: 'Unable to calculate next stop.' });
//   }

//   res.json({ nextBestStop });
//  }
//  catch(error){
//   console.log(error)
//   return res.status(500).json({message: error})
//  }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });































// Here's a Node.js script using Express to create a RESTful API that calculates the next best stop for a driver based on demand, supply, and distance. Let me know if you need further customization or explanation!








// // Import required modules
// const express = require('express');
// const bodyParser = require('body-parser');
// const haversine = require('haversine-distance');

// // Initialize the app
// const app = express();
// app.use(bodyParser.json());

// // Sample data for stops
// const stops = [
//     { id: 1, name: "Stop A", location: { lat: 12.9716, lon: 77.5946 }, demand: { weekday: 50, weekend: 80 }, supply: 5 },
//     { id: 2, name: "Stop B", location: { lat: 12.9352, lon: 77.6245 }, demand: { weekday: 70, weekend: 100 }, supply: 2 },
//     { id: 3, name: "Stop C", location: { lat: 12.9141, lon: 77.6109 }, demand: { weekday: 60, weekend: 90 }, supply: 4 },
//     { id: 4, name: "Stop D", location: { lat: 12.9784, lon: 77.6408 }, demand: { weekday: 80, weekend: 110 }, supply: 3 },
//     { id: 5, name: "Stop E", location: { lat: 12.9857, lon: 77.6058 }, demand: { weekday: 55, weekend: 75 }, supply: 6 },
//     { id: 6, name: "Stop F", location: { lat: 12.9304, lon: 77.6783 }, demand: { weekday: 65, weekend: 95 }, supply: 1 },
//     { id: 7, name: "Stop G", location: { lat: 12.9250, lon: 77.5897 }, demand: { weekday: 40, weekend: 60 }, supply: 7 },
//     { id: 8, name: "Stop H", location: { lat: 12.9279, lon: 77.6271 }, demand: { weekday: 75, weekend: 120 }, supply: 2 },
//     { id: 9, name: "Stop I", location: { lat: 12.9568, lon: 77.7011 }, demand: { weekday: 90, weekend: 130 }, supply: 4 },
//     { id: 10, name: "Stop J", location: { lat: 12.9165, lon: 77.6001 }, demand: { weekday: 45, weekend: 70 }, supply: 5 }
// ];

// // Utility function to calculate demand based on time
// function calculateDemand(stop, isWeekend, hour) {
//     const baseDemand = isWeekend ? stop.demand.weekend : stop.demand.weekday;
//     const peakMultiplier = hour >= 8 && hour <= 10 || hour >= 17 && hour <= 19 ? 1.5 : 1;
//     return baseDemand * peakMultiplier;
// }

// // Utility function to calculate the score for each stop
// function calculateScore(stop, driverLocation, isWeekend, hour) {
//     const demand = calculateDemand(stop, isWeekend, hour);
//     const distance = haversine(driverLocation, { lat: stop.location.lat, lon: stop.location.lon });
//     const score = (demand / (stop.supply + 1)) / (distance + 1); // Avoid divide-by-zero
//     return score;
// }

// // POST /next-stop endpoint
// app.post('/next-stop', (req, res) => {
//     const { currentLocation, timestamp } = req.body;

//     if (!currentLocation || !currentLocation.lat || !currentLocation.lon || !timestamp) {
//         return res.status(400).json({ error: "Invalid input. Provide currentLocation (lat, lon) and timestamp." });
//     }

//     const driverLocation = { lat: currentLocation.lat, lon: currentLocation.lon };
//     const date = new Date(timestamp);
//     const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
//     const hour = date.getHours();

//     let bestStop = null;
//     let highestScore = -Infinity;

//     stops.forEach(stop => {
//         const score = calculateScore(stop, driverLocation, isWeekend, hour);
//         if (score > highestScore) {
//             highestScore = score;
//             bestStop = stop;
//         }
//     });

//     if (bestStop) {
//         res.json({ nextStop: bestStop });
//     } else {
//         res.status(404).json({ error: "No stops available." });
//     }
// });

// // Start the server
// const PORT = 3200;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


































// // Import required modules
// const express = require('express');
// const bodyParser = require('body-parser');

// // Initialize the app
// const app = express();
// app.use(bodyParser.json());

// // Sample data for stops
// const stops = [
//     { id: 1, name: "Stop A", location: { lat: 12.9716, lon: 77.5946 }, demand: { weekday: 50, weekend: 80 }, supply: 5 },
//     { id: 2, name: "Stop B", location: { lat: 12.9352, lon: 77.6245 }, demand: { weekday: 70, weekend: 100 }, supply: 2 },
//     { id: 3, name: "Stop C", location: { lat: 12.9141, lon: 77.6109 }, demand: { weekday: 60, weekend: 90 }, supply: 4 },
//     { id: 4, name: "Stop D", location: { lat: 12.9784, lon: 77.6408 }, demand: { weekday: 80, weekend: 110 }, supply: 3 },
//     { id: 5, name: "Stop E", location: { lat: 12.9857, lon: 77.6058 }, demand: { weekday: 55, weekend: 75 }, supply: 6 },
//     { id: 6, name: "Stop F", location: { lat: 12.9304, lon: 77.6783 }, demand: { weekday: 65, weekend: 95 }, supply: 1 },
//     { id: 7, name: "Stop G", location: { lat: 12.9250, lon: 77.5897 }, demand: { weekday: 40, weekend: 60 }, supply: 7 },
//     { id: 8, name: "Stop H", location: { lat: 12.9279, lon: 77.6271 }, demand: { weekday: 75, weekend: 120 }, supply: 2 },
//     { id: 9, name: "Stop I", location: { lat: 12.9568, lon: 77.7011 }, demand: { weekday: 90, weekend: 130 }, supply: 4 },
//     { id: 10, name: "Stop J", location: { lat: 12.9165, lon: 77.6001 }, demand: { weekday: 45, weekend: 70 }, supply: 5 }
// ];

// // Utility function to calculate the Haversine distance
// function haversineDistance(coord1, coord2) {
//     const toRadians = (deg) => (deg * Math.PI) / 180;

//     const R = 6371e3; // Earth's radius in meters
//     const φ1 = toRadians(coord1.lat);
//     const φ2 = toRadians(coord2.lat);
//     const Δφ = toRadians(coord2.lat - coord1.lat);
//     const Δλ = toRadians(coord2.lon - coord1.lon);

//     const a = Math.sin(Δφ / 2) ** 2 +
//               Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
// }

// // Utility function to calculate demand based on time
// function calculateDemand(stop, isWeekend, hour) {
//     const baseDemand = isWeekend ? stop.demand.weekend : stop.demand.weekday;
//     const peakMultiplier = hour >= 8 && hour <= 10 || hour >= 17 && hour <= 19 ? 1.5 : 1;
//     return baseDemand * peakMultiplier;
// }

// // Utility function to calculate the score for each stop
// function calculateScore(stop, driverLocation, isWeekend, hour) {
//     const demand = calculateDemand(stop, isWeekend, hour);
//     const distance = haversineDistance(driverLocation, { lat: stop.location.lat, lon: stop.location.lon });
//     const score = (demand / (stop.supply + 1)) / (distance + 1); // Avoid divide-by-zero
//     return score;
// }

// // POST /next-stop endpoint
// app.post('/next-stop', (req, res) => {
//     const { currentLocation, currentTime } = req.body;

//     if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude || !currentTime) {
//         return res.status(400).json({ error: "Invalid input. Provide currentLocation (latitude, longitude) and currentTime." });
//     }

//     const driverLocation = { lat: currentLocation.latitude, lon: currentLocation.longitude };
//     const date = new Date(currentTime);
//     const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
//     const hour = date.getHours();

//     let bestStop = null;
//     let highestScore = -Infinity;

//     stops.forEach(stop => {
//         const score = calculateScore(stop, driverLocation, isWeekend, hour);
//         if (score > highestScore) {
//             highestScore = score;
//             bestStop = stop;
//         }
//     });

//     if (bestStop) {
//         res.json({ nextStop: bestStop });
//     } else {
//         res.status(404).json({ error: "No stops available." });
//     }
// });

// // Start the server
// const PORT = 3200;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
