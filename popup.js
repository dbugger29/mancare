'use strict';
var settings = settings ||  {
					food_list_pages :[
						"https://www.facebook.com/BeerHubBHB/",
						"https://www.facebook.com/OxfordPub/"
					]};

var GetFood = () => {
	
	//resetam valoarea
	
	chrome.storage.sync.set({"food_list":null, "start_scavenging_for_food":true}, () =>
	{
		var clbk_tabs = (crt_tab) =>
		{
			console.info("tab created:", crt_tab);
		}
		for(var idx=0; idx< food_list_pages.length; idx++)
		{
			chrome.tabs.create({"url":food_list_pages[idx]}, (tab) => {});
		}
	});
}

document.getElementById('i_get_food').addEventListener('click', GetFood);
