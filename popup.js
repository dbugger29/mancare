'use strict';
var settings = settings ||  {
					food_list_pages :[
						"https://www.facebook.com/BeerHubBHB/",
						"https://www.facebook.com/OxfordPub/",
						"https://www.facebook.com/CzechInPalas/",
						"https://www.facebook.com/LegendIasi/",
						"https://www.facebook.com/chefgalerie/"
					]};

var GetFood = () => {
	
	//resetam valoarea
	
	chrome.storage.sync.set({"food_list":null, "start_scavenging_for_food":true}, () =>
	{
	});
}

document.getElementById('i_get_food').addEventListener('click', GetFood);
