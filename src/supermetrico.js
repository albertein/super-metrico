(function() {

  var inchConverter = function(value) {
    return value * 2.54;
  };

  var poundConverter = function(value) {
    return value / 2.2046;
  };

  var feetConverter = function(value) {
    return value * 0.3048;
  };


  var lookup = function(node) {
    if (node.nodeType == Node.TEXT_NODE) {
      var text = node.textContent;
      // ([\s\S]*?) Matchs any prelude, lazily matchs any amount of character (white and not whitespace)
      // (/d+) Matchs the numeric value
      // (\s*) Matchs any whitespace
      // (inch|pund.. etc) matchs the measurement unit
      // (\W) ending
      // Global case Insensitive Multiline search
      var regex = /([\s\S]*?)(\d[\d\,\.]*)(\s*)(inche?s?|pounds?|foot|feet|ft)(\W)/gim;
      var match = false;
      var results;
      var replace = "";
      var lastIndex;
      while (results = regex.exec(text)) {
        match = true;
        var prelude = results[1];
        var value = parseFloat(results[2].replace(',', ''));
        var whitespace = results[3];
        var unit = results[4];
        var ending = results[5];
        replace += prelude;
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
        replace += value + whitespace + unit + ending;
        lastIndex = regex.lastIndex;
      }
      if (!match)
        return;
      replace += text.substring(lastIndex);
      node.textContent = replace;
    } else {
      for (var i in node.childNodes) {
        lookup(node.childNodes[i]);
      }
    }
  };
  var body = document.getElementsByTagName("body").item();
  lookup(body);
})();