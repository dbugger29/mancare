var settings = null;
var page_state = null;
var url = chrome.runtime.getURL('./settings.json');
var nr_req_ocr = 0;
fetch(url)
    .then((response) => response.json() ) //assuming file contains json
    .then((json) => {
		settings = json;
		if( page_state == 'complete' && settings != null ) 
			startCheck();
	});
	
//goto first post and parse it 
const REGEX_CHECK_FOOD = new RegExp("(business.{0,20}lunch)|(meniul?.{1,50}(zilei|business|pranz))|business|prânz|lunch");
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
//curl https://api.ocr.space/Parse/Image -H "apikey:helloworld" --data "isOverlayRequired=true&url=http://dl.a9t9.com/blog/ocr-online/screenshot.jpg&language=eng"
async function ParseImageContent(href_img)
{
	
	nr_req_ocr++;
	if(nr_req_ocr> settings.MAX_REQ_OCR_PAGE) return "limit exceeded";
	return new Promise(function(resolve, reject) {
			var http = new XMLHttpRequest();
			var url = 'https://api.ocr.space/parse/image';
			//to do here
			http.open('POST', url, true);
			//Send the proper header information along with the request
			http.setRequestHeader('Content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
			http.setRequestHeader('apikey', '642fae218f88957');
			var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\neng\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"isOverlayRequired\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\n"+href_img+"\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"iscreatesearchablepdf\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"issearchablepdfhidetextlayer\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
			http.onreadystatechange = function() {
				if(http.readyState == 4 && http.status == 200) {
					console.info(http.responseText);
					try{
						var j_resp = JSON.parse(http.responseText);
						if("ParsedResults" in j_resp)
						{
							return resolve(j_resp.ParsedResults[0].ParsedText);
						}
						else
							return resolve(http.responseText);
					}
					catch(ex) 
					{
						return resolve("error parsing response")
					};
					return resolve(http.responseText);
				}
			}
			http.send(postData);
	});
}



var startCheck = async () => 
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
					if(result == null && nr_tries < 5 )
					{
						//setTimeout( () =>
					//	{	
							checkFood(handler_food);		
						//}, 5000);
					}
					else
					{
						
						if( nr_tries >= 5 )
							result="could not parse";
						addfoodItem(result, foodTitle);
					}
				}
				var checkFood = ( clbk ) =>
				{
					ScrollToBottom( async () =>
					{
						var documents = document.getElementsByClassName("userContentWrapper");
						var foodItems = "";
						var current_text = "";
						console.info(documents.length);
						for(var idx=0; idx< documents.length; idx++)
						{
							if( documents[idx].getElementsByClassName("see_more_link_inner").length >0 )
							{
								(documents[idx].getElementsByClassName("see_more_link_inner")[0]).click();
							}
							if(settings.parse_image_list.indexOf(window.location.href) >= 0)
							{
								var href_img = ((document.getElementsByClassName("userContentWrapper")[1]).getElementsByTagName('img')[1]).getAttribute('src');
								current_text = await ParseImageContent( href_img );
								console.info(current_text);
								if(typeof current_text == "undefined")
									current_text = (documents[idx].getElementsByClassName("userContent")[0]).innerText;
								//alert(current_text);
							}
							else
							{	
								
								current_text = (documents[idx].getElementsByClassName("userContent")[0]).innerText;
							}
							var sFoodDay = getFoodDay();
							
							current_text = current_text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
							if( REGEX_CHECK_FOOD.test( current_text.toLowerCase() ) == true)
							{
								var postDate = (documents[idx].getElementsByClassName("timestampContent")[0]).innerText;
								postDate = postDate.trim();
								var parsedHour = /^((\d+)\s+((hrs?)|(minute?)|ora|ore|(mins?)))|(just now)|(a few moments ago)/g.exec(postDate);
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
  page_state = document.readyState;
  console.info(page_state);
  if( page_state == 'complete' && settings != null ) 
      startCheck();
}