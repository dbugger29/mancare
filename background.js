var settings = null;
var url = chrome.runtime.getURL('./settings.json');

fetch(url)
    .then((response) => response.json() ) //assuming file contains json
    .then((json) => {
		settings = json;
		console.info(settings);
	});

//var idxL = 0;
 chrome.runtime.onInstalled.addListener(function() {
	// to do here - maybe reload background or reset?
});
var formatFoodPool = (food_list) => {
	// to do here
	alert(food_list);
}

var clbk_tabs = (crt_tab) =>
{
	console.info("tab created:", crt_tab);
	//idxL++;
}
		
const delay = ms => new Promise(res => setTimeout(res, ms));
	
chrome.storage.onChanged.addListener( async function(changes, namespace) {
	
	while( settings == null )
	{
		await delay(50);
	}
	console.info(changes, namespace);	
	//{"food_list":null, "start_scavenging_for_food":true}
	if("food_list" in changes && changes.food_list.newValue== null && "start_scavenging_for_food" in changes && changes.start_scavenging_for_food.newValue == true )
	{
		chrome.tabs.create({"url":settings.food_list_pages[0]}, clbk_tabs);	
	}		
	else
		if("food_list" in changes && "newValue" in changes.food_list )
		{
			if( changes.food_list.newValue!=null && changes.food_list.newValue.length == settings.food_list_pages.length )// lista e gata
			{
				//formatFoodPool(changes.food_list);
				chrome.storage.sync.set({"start_scavenging_for_food":false}, () => {});
				 chrome.tabs.create({url: "food_results.html"});
			}
			else
			{
				if( changes.food_list.newValue.length < settings.food_list_pages.length)
				{
					chrome.tabs.create({"url":settings.food_list_pages[changes.food_list.newValue.length]}, clbk_tabs);
				}
			}
		}
 });
