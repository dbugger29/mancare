'use strict';

 chrome.runtime.onInstalled.addListener(function() {
	// to do here - maybe reload background or reset?
});
var formatFoodPool = (food_list) => {
	// to do here
	alert(food_list);
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	
	console.info(changes, namespace);	
	if("food_list" in changes && "newValue" in changes.food_list )
	{
		if(changes.food_list.length == 5)// lista e gata
		{
			formatFoodPool(JSON.changes.food_list);
		}
	}
	else
	{
	}
 });
