chrome.storage.sync.get(["food_list"], (result) =>
{
	var formatedValue = "/polly\n";
	formatedValue += "\"Mancare\" \n\n";
	formatedValue += "\"*salsa*\" \n\n";
	formatedValue +="\"*fenice*\"\n\n";
	formatedValue +="\"*foodcourt*\"\n\n";
	for(var idx=0; idx<result.food_list.length;idx++)
	{ 
		console.info(result.food_list[idx].food);
		var food =  result.food_list[idx].food.replace(/(?:\r\n|\r|\n)+/g, ' ');
		food =  food.replace(/\*/g, ' ');
		food =  food.replace(/,+/g, ' ');
		food =  food.replace(/,+/g, ' ');
		food = food.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g, "");
		formatedValue+= '"*' + result.food_list[idx].restaurant +'*-' + food + '"\n\n';
	}
	
	
	document.getElementById("foodResults").value = formatedValue;
});