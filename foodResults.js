chrome.storage.sync.get(["food_list"], (result) =>
{
	var formatedValue = "/polly\n \"salsa\"\n";
	for(var idx=0; idx<result.food_list.length;idx++)
	{
		formatedValue+= '"' + result.food_list[idx].food + " - " + result.food_list[idx].restaurant +'"\n';
	}
	
	
	document.getElementById("foodResults").value = formatedValue;
});