'use strict';

var GetFood = () => {
	
	//resetam valoarea
	
	chrome.storage.sync.set({"food_list":null, "start_scavenging_for_food":true}, () =>
	{
	});
}

document.getElementById('i_get_food').addEventListener('click', GetFood);
