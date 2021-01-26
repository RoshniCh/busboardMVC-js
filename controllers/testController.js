const Bus = require('../models/Test');
exports.getTestData = (req, res) => {
let topBus = [
new Bus('line', 'towards', 'time')
];
res.render('testView', {
	topBus: topBus,
})
}
exports.getBusHTML = (req, res) => {

		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var readline = require('readline-sync');


		var passedPostcode = req.params.postcode
		console.log(passedPostcode)
		var urlLatLong = `https://api.postcodes.io/postcodes?q=${passedPostcode}`
		//getUrlLongLat(passedPostcode);
	    //var urlLatLong = getUrlLongLat()
		var requestLL = new XMLHttpRequest()
		requestLL.open('GET', urlLatLong, true)
		requestLL.onreadystatechange = function () {
			if (requestLL.readyState === 4) {
					var reqLL = JSON.parse(requestLL.responseText)
					getStopArr(reqLL)
			}
		}
		requestLL.send()

		function getStopArr(reqLL){ 
			var latitude = getLat(reqLL)
			var longitude = getLong(reqLL)
			var urlStopCode = `https://api.tfl.gov.uk/Stoppoint?lat=${latitude}&lon=${longitude}&stoptypes=NaptanPublicBusCoachTram`
			
			var requestSC = new XMLHttpRequest()
			requestSC.open('GET', urlStopCode, true)
			requestSC.onreadystatechange = function () {
				if (requestSC.readyState === 4) {
					var reqSC = JSON.parse(requestSC.responseText)
					var stopCode1 = getStopCode(reqSC, 1);
							var stopCode2 = getStopCode(reqSC, 2);
							var urlBus1 = makeUrlBus(stopCode1);
							var urlBus2 = makeUrlBus(stopCode2);
							getBuses(urlBus1);
					// if (reqSC.stopPoints.length >= 2){
					// 		var stopCode1 = getStopCode(reqSC, 1);
					// 		var stopCode2 = getStopCode(reqSC, 2);
					// 		var urlBus1 = makeUrlBus(stopCode1);
					// 		var urlBus2 = makeUrlBus(stopCode2);
					// 		var topFive1 = getBuses(urlBus1);
					// 		// var topFive2 = getBuses(urlBus2);
                    //         // var topBus = []
					// 		// topFive1.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))
					// 		// topFive2.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))


					// } else if (reqSC.stopPoints.length == 1){
					// 		var stopCode1 = getStopCode(reqSC, 1);
					// 		var urlBus1 = makeUrlBus(stopCode1);
					// 		var topFive1 = getBuses(urlBus1);
					// 		var topBus = []
					// 		topFive1.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))
							
					// } //else {topBus = {bus:"No bus stop nearby"}}
					
					// res.render('testView', {
					// topBus : topBus,
					// })
				}
			} 
			requestSC.send()
		}


		// function getUrlLongLat(){
  		// //	console.log("Enter your post code(no spaces)")
  		// //	let postcode = readline.prompt()
 		// 	let postcode = "NW51TL"
		// 	return `https://api.postcodes.io/postcodes?q=${postcode}`
		// }

		function getLat(reqLL){
			return reqLL.result[0].latitude
		}

		function getLong(reqLL){
			return long = reqLL.result[0].longitude
		}

		function getStopCode(reqSC, n){
		return reqSC.stopPoints[n-1].id
		}

		function makeUrlBus(stopPoint){
			return `https://api.tfl.gov.uk/StopPoint/${stopPoint}/Arrivals`
		}

		function getBuses(urlBus1){
			var requestBus1 = new XMLHttpRequest()
			requestBus1.open('GET', urlBus1, true)
			requestBus1.onreadystatechange = function () {
					if (requestBus1.readyState === 4) {
						var reqBus1 = JSON.parse(requestBus1.responseText)
						findBuses(reqBus1)
						
					}

			}
			requestBus1.send()
		}


		function findBuses(reqArray){
			let buses = reqArray.map(bus => {
					return{line : bus.lineId, time: bus.timeToStation, towards: bus.towards}
			})
			buses.sort((a, b) => {
					return a.time - b.time
			})

			let topFive = [];
			for (let a = 0; a<= 4 && a<buses.length; a++){
			topFive.push(buses[a])   
			}
			// return topFive

			// if (reqArray[0].platformName === 'null') {
			// 	console.log(`${reqArray[0].stationName}`)
			// }else{
			// 	console.log(`${reqArray[0].stationName}: Bus stop ${reqArray[0].platformName}`)
			// }
			// topFive.forEach(bus => console.log(`${bus.line} towards ${bus.towards} : ${toMinutes(bus.time)}`))
		    // var topBus = 
			// res.render('testView', {
			// 	topBus : topBus,

			var topBus = []
			topFive.forEach(bus => topBus.push(new Bus(bus.line, bus.towards, bus.time)))
	
					res.render('testView', {
					topBus : topBus,
					})

		}

		function toMinutes(seconds){
			if (Math.floor(seconds / 60) >= 1){return `${Math.floor(seconds/60)} mins`
			} else{return 'due'}
		}

	    
	
};