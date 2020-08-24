const request = require("postman-request");

const forecast = (latitude,longitude,callback) => {
	const url = `http://api.weatherstack.com/current?access_key=6595b5985f9d2bb8da9e2e393408cd92&query=${latitude},${longitude}&units=m`;
	
	request({url, json:true},(error,{body} = {}) => {
		try {
			if(error){
				callback("Unable to connect to weather service!",undefined);
			}else if(body.error){
				callback("Unable to find location",undefined);
			}else{
				callback(undefined,{
					weatherDescription : body.current.weather_descriptions[0],
					temperature : body.current.temperature,
					feelsLike : body.current.feelslike
				});
			}
		}catch (e) {
			callback("Unable to find location",undefined);
			//console.log(`Unable to find location, ${e}`);
		}
	});
};

module.exports = forecast;