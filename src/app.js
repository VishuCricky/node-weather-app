const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
/* 
The library/module just exposes a single function and in the below line we
call that function.
*/
/* console.log(__dirname);
console.log(path.join(__dirname, "../public")); */

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express Config
const publicDirPath = path.join(__dirname, "../public");
// To customize views path
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

// Setup handlebars enfine and views location
/* 
Instead of using the static files we can use the dynamic ones and
we have template engine, with handlebars we will be able to render dynamic 
content, we will be use and reuse little pieces of markup throughout various pages 
of the app
*/
app.set("view engine","hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to work
/* 
We are going to configure express to serve up the directory.
In a way to customize our server
*/
app.use(express.static(publicDirPath));

/* 
We will configure the server to one domain and the rest will be routes for that
domain
app.com
app.com/help
app.com/about
*/
app.get("",(incomingReq, outgoingRes) => {
	outgoingRes.render("index",{
		title: "Weather",
		name: "Vishnu Prasad"
	});
});

app.get("/about",(incomingReq, outgoingRes) => {
	outgoingRes.render("about",{
		title: "About Me",
		name: "Vishnu Prasad"
	});
});

app.get("/help",(incomingReq, outgoingRes) => {
	outgoingRes.render("help",{
		title: "Help",
		name: "Vishnu Prasad",
		helpText: "This is some helpful text."
	});
});

app.get("/weather",(incomingReq, outgoingRes) => {

	if(!incomingReq.query.address){
		return outgoingRes.send({
			error: "You must provide an address!"
		});
	}
	const address = incomingReq.query.address;
	geocode(address,(error,{latitude,longitude,location} = {}) => {
    if(error){
			return outgoingRes.send({
				error
			});
    }
    forecast(latitude,longitude,(error,forecastData) => {
      if(error){
        return outgoingRes.send({
					error
				});
      }
      outgoingRes.send({
				forecast: `${forecastData.weatherDescription}. The current temperature is ${forecastData.temperature}, but it feels like ${forecastData.feelsLike}.`,
				location,
				address
			});
    });
  });
	
});

app.get("/help/*",(incomingReq, outgoingRes) => {
	outgoingRes.render("404",{
		title: "404 Help",
		name: "Vishnu Prasad",
		errorMsg: "Help Article not found"
	});
});

app.get("*",(incomingReq, outgoingRes) => {
	outgoingRes.render("404",{
		title: "404",
		name: "Vishnu Prasad",
		errorMsg: "Page not found"
	});
});

/* 
The below code is commented out as it is not much of a use now,
since we have configured the path to express to serve up,
which is nothing but `index.html`
It is more like a default page which loads up
*/
/* app.get("",(incomingReq, outgoingRes) => {
  outgoingRes.send("<h1>Weather</h1>");
});

app.get("/help",(incomingReq, outgoingRes) => {
	outgoingRes.send([{
		name: "vishnu"
	},{
		name: "cricky"
	}]);
});

app.get("/about",(incomingReq, outgoingRes) => {
  outgoingRes.send("<h1>About</h1>");
}); */


/* 
To start the server in a particular port locally,it's not required to mention port 
if we have our own domain, as it will have some default ports
*/
/* app.listen(3000,() => {
	console.log("Server is up on port 3000");
}); */
app.listen(port,() => {
	console.log("Server is up on port "+port);
});