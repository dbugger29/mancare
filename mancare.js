var settings = settings || {};	

//goto first post and parse it 

var addfoodItem = (foodItem, restaurant) =>
{
	chrome.storage.sync.get(["food_list"], (result) =>
	{
		if("food_list" in result)
		{
			result.food_list = typeof result.food_list == "undefined" ? [{ restaurant: foodItem } ]: result.food_list.push({ restaurant: foodItem } );													
		}
	}
}

