settings = settings ||  {
					food_list_pages :[
						"https://www.facebook.com/BeerHubBHB/",
						"https://www.facebook.com/OxfordPub/"
					]};
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

if( window.location.href in settings.food_list_pages )
{
	chrome.storage.sync.get(["start_scavenging_for_food"], (result) =>
	{
		if( result.start_scavenging_for_food == true ) //time to eat :D
		{
			var foodTitle = document.querySelectorAll("a[href='"+window.location.href+"']").length >0 ?  document.querySelectorAll("a[href='"+window.location.href+"']")[0].innerText : window.location.href;
			var documents = document.getElementsByClassName("userContentWrapper");
			for(var idx=0; idx< documents.length; idx++)
			{
				var current_text= documents[idx].innerText;
				//verificare zi a saptamanii
				var foodDay = (new Date()).getDay();
				var sFoodDay = "";
				switch(foodDay)
				{
					case 1: sFoodDay = "luni";
							break;
					case 2: sFoodDay = "marti";
							break;
				}
			}
				
		}
	}
	
}
