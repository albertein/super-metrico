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
    var makeUnit = function(names, metric, factor) {
      return {
        unit: names,
        metric: metric,
        convertion: function(value) { return value * factor }
      }
    };

    // Source: http://en.wikipedia.org/wiki/Imperial_units#Units
    var units = [
      makeUnit("thou|mil|th", "mm", 0.0254),
      makeUnit("inch|inches|in", "cm", 2.54),
      makeUnit("foot|feet|ft", "m", 0.3048),
      makeUnit("yard|yards|yd", "m", 0.914),
      makeUnit("mile|miles|mi", "km", 1.609344),
      makeUnit("acre|acres", "ha", 0.4047),
      //TODO: Volume units makes no sense, are ounces really used for mass measurement instead of volume?
      //TODO: The ounces and pints seen on the wild, are they the US versions or british?
      makeUnit("ounce|ounces|oz", "mm", 28.4130625),
      makeUnit("pint|pints|pt", "l", 0.473176473),
      makeUnit("quart|quarts|qt", "l", 0.946352946),
      makeUnit("gallon|gallons|gal", "l", 3.78541178),
      makeUnit("pound|pounds|lb", "kg", 0.45359237)
    ];

    var unitsRegex = '';
    for (var i in units) {
      var unit = units[i];
      unitsRegex += '|' + unit.unit;
    }
    unitsRegex = "(" + unitsRegex.substring(1) + ")"; //Remove leading pipe

    // (\d[\d\,\.]*) Matchs the numeric value
    // \s* Separator whitespace
    // (inch|pund.. etc) matchs the measurement unit
    // Global case Insensitive Multiline search
    var regex = new RegExp("(\\d[\\d\\,\\.]*)\\s*" + unitsRegex, "gim");
    var results;
    var container = document.createElement("UL");
    var matches = false;
    while (results = regex.exec(text)) {
      matches = true;
      var value, originalValue = results[1];
      value = parseFloat(originalValue.replace(',', ''));
      var unit, originalUnit = results[2];
      unit = originalUnit;
      for (var i in units) {
        var currentUnit = units[i];
        if (unit.match(currentUnit.unit)) {
          value = currentUnit.convertion(value);
          unit = currentUnit.metric;
          break;
        }
      }
      var item = document.createElement("LI");
      item.innerText = originalValue + " " + originalUnit + " > " + value + " " + unit;
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
