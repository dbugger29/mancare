'use strict';

var food_list_pages = [
	"https://facebook.com/blabla",
];

var GetFood = () => {
	
	//resetam valoarea
	
	chrome.storage.sync.set({"food_list":null}, () =>
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
