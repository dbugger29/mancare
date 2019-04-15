settings = {
					food_list_pages :[
						"https://www.facebook.com/BeerHubBHB/",
						"https://www.facebook.com/OxfordPub/",
						"https://www.facebook.com/CzechInPalas/",
						"https://www.facebook.com/LegendIasi/",
						"https://www.facebook.com/bistromoo/",
						"https://www.facebook.com/treazsinu/",
						"https://www.facebook.com/chefgalerie/"
					]};
//goto first post and parse it 
const REGEX_CHECK_FOOD = new RegExp("(business.{0,20}lunch)|(meniul?.{1,50}(zilei|business|pranz))");
var addfoodItem = (foodItem, restaurant) =>
{
	chrome.storage.sync.get(["food_list"], (result) =>
	{
		var json_to_add={"restaurant" : restaurant,
						  "food" : foodItem};
		//json_to_add[restaurant] = foodItem;
		if("food_list" in result)
		{
			if(	 typeof result.food_list == "undefined" || result.food_list==null )
					result.food_list = [json_to_add];
			else
						result.food_list.push(json_to_add);
			//result.food_list = typeof result.food_list == "undefined" || result.food_list==null ?
				//																					[json_to_add]
				//																				: 	result.food_list.push(json_to_add);	
			console.info("new value:", result.food_list);
			chrome.storage.sync.set({"food_list":result.food_list}, ()=>{});																							
		}
	});
}
var getFoodDay = () =>
{
	var foodDay = (new Date()).getDay();
	var sFoodDay = "";
	switch(foodDay)
				{
					case 1: sFoodDay = "luni";
							break;
					case 2: sFoodDay = "marti";
							break;
					case 3: sFoodDay = "miercuri";
							break;
					case 4: sFoodDay = "joi";
							break;
					case 5: sFoodDay = "vineri";
							break;	
				}
	return sFoodDay;
}
var removeCommentArea = (elementClass) =>
{
    var elements = document.getElementsByClassName(elementClass);
	for(var ide =0; ide< elements.length; ide++)
		elements[ide].parentNode.removeChild(elements[ide]);
}

var ScrollToBottom = (clbk ) =>
{
	window.scroll({
	  top: 10*window.innerHeight,
	  left: 0,
	  behavior: 'smooth'
	});
	 setTimeout(clbk, 10000);	
	// setTimeout( ()=>
	// {
		// window.scroll({
			  // top: 10*window.innerHeight,
			  // left: 0,
			  // behavior: 'smooth'
		// });
		
		// setTimeout(clbk, 20000);	
		
	// }, 20000); // poate verificat altfel
}

var checkURLisFood = () =>
{
	for( var id = 0; id < settings.food_list_pages.length; id++ )
	{
		if(window.location.href== settings.food_list_pages[id] )
			return true;
	}
	return false;
}

var parseFoodPost = (current_text) =>
{
	if(current_text.indexOf("P.S.") > 0)
		current_text = current_text.substr(0,current_text.indexOf("P.S.") );
	console.info(current_text);
	current_text = current_text.replace(/\d\d:\d\d\s?-\s?\d\d:\d\d/g, "");
	if(current_text.indexOf(":") >0)
	{
		current_text =  current_text.substr(current_text.indexOf(":") );
	}
	return current_text;
}
function timeAgo(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);

	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;

	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}
var startCheck = () => 
{	
	if( checkURLisFood()  )
	{
		chrome.storage.sync.get(["start_scavenging_for_food"], (result) =>
		{
			if( result.start_scavenging_for_food == true ) //time to eat :D
			{
				var foodTitle = document.querySelectorAll("a[href='"+window.location.href+"']").length >0 ?  document.querySelectorAll("a[href='"+window.location.href+"']")[0].innerText : window.location.href;
				var nr_tries=0;
				var handler_food = (result) =>
				{
					nr_tries++;
					if(result == null && nr_tries < 10 )
					{
						//setTimeout( () =>
					//	{	
							checkFood(handler_food);		
						//}, 5000);
					}
					else
					{
						
						if( nr_tries >= 10 )
							result="could not parse";
						addfoodItem(result, foodTitle);
					}
				}
				var checkFood = ( clbk ) =>
				{
					ScrollToBottom( () =>
					{
						
						var documents = document.getElementsByClassName("userContentWrapper");
						var foodItems = "";
						console.info(documents.length);
						for(var idx=0; idx< documents.length; idx++)
						{
							if( documents[idx].getElementsByClassName("see_more_link_inner").length >0 )
							{
								(documents[idx].getElementsByClassName("see_more_link_inner")[0]).click();
							}
							var current_text = (documents[idx].getElementsByClassName("userContent")[0]).innerText;
							var sFoodDay = getFoodDay();
							current_text = current_text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
							if( REGEX_CHECK_FOOD.test( current_text.toLowerCase() ) == true)
							{
								var postDate = (documents[idx].getElementsByClassName("timestampContent")[0]).innerText;
								postDate = postDate.trim();
								var parsedHour = /^((\d+)\s+(hrs?)|(mins?))|(just now)|(a few moments ago)/g.exec(postDate);
								var postHour = -1;
								if(parsedHour && parsedHour.length >2)
									if(parsedHour[2])
										postHour = parseInt(parsedHour[2]);
									else 
										postHour = 0;
								var post_time = timeAgo(postDate);
								console.info(postHour);
								current_text = current_text.replace(/luni\s?(pana|-)\s?vineri/gi, "");
								// to do -post must not be older than 5 days
								if(	current_text.toLowerCase().indexOf(sFoodDay) >=0 || (postHour>=0 && postHour<12)  )
								{							
									//TO DO - check current day
									foodItems = parseFoodPost(current_text);
									console.info(foodItems);
									break;
								}
							}
						}
						if(foodItems.length !=0)
						{
							return clbk(foodItems);
						}
						else
							return clbk();
					});	
				}
				checkFood(handler_food);
				
			}
		});
	}
	
}


document.onreadystatechange = function () {
  var state = document.readyState;
  console.info(state);
  if( state == 'complete') 
      startCheck();
}