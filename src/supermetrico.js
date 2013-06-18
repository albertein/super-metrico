var superMetrico = (function() {
  var inchConverter = function(value) {
    return value * 2.54;
  };

  var poundConverter = function(value) {
    return value / 2.2046;
  };

  var feetConverter = function(value) {
    return value * 0.3048;
  };


  var process = function(text) {
    // (\d[\d\,\.]*) Matchs the numeric value
    // \s* Separator whitespace
    // (inch|pund.. etc) matchs the measurement unit
    // Global case Insensitive Multiline search
    var regex = /(\d[\d\,\.]*)\s*(inche?s?|pounds?|foot|feet|ft)/gim;
    var results;
    var container = document.createElement("UL");
    var matches = false;
    while (results = regex.exec(text)) {
      matches = true;
      var value, originalValue = results[1];
      value = parseFloat(originalValue.replace(',', ''));
      var unit, originalUnit = results[2];
      unit = originalUnit;
      if (unit.indexOf("inch") != -1) {
        value = inchConverter(value);
        unit = "cm";
      } else if (unit.indexOf("pound") != -1) {
        value = poundConverter(value);
        unit = "kgs"
      } else if (unit == "foot" || unit == "feet" || unit == "ft") {
        value = feetConverter(value);
        unit = "m";
      }
      var item = document.createElement("LI");
      item.innerText = originalValue + " " + originalUnit + " -> " + value + " " + unit;
      container.appendChild(item);
    }
    var content = document.getElementById("content");
    if (!matches) {
      container = document.createElement("DIV");
      container.className = "error";
      container.innerText = "Couldn't find any units, please make sure you first select the text containing the value with the unit";
    }
    content.appendChild(container);
  };

  return {
    init: function() {
      chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendRequest(tab.id, {method: "superMetricoSelection"}, function(response) {
            process(response.data);
         });
      });
    }
  };
})();
document.addEventListener("DOMContentLoaded", function() {
  superMetrico.init()
});