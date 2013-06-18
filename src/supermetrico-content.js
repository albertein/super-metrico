chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "superMetricoSelection")
    sendResponse({data: window.getSelection().toString()});
  else
    sendResponse({}); 
});