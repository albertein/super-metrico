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

  var createSpan = function(text, className) {
    var span = document.createElement("SPAN");
    if (className)
      span.className = className;
    if (text) 
      span.appendChild(document.createTextNode(text));
    return span;
  };

  var lookup = function(node, parent) {
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
      var matches = [];
      while (results = regex.exec(text)) {
        match = true;
        var prelude = results[1];
        var value, originalValue = results[2];
        value = parseFloat(originalValue.replace(',', ''));
        var whitespace = results[3];
        var unit, originalUnit = results[4];
        unit = originalUnit;
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
        var preSpan = createSpan(prelude);
        var span;
        (function(convertedText, originalText) {
          span = createSpan(convertedText, "super-metrico-converted");
          span.addEventListener("click", function() {
            if (this.getAttribute("data-super-metrico-original") == "true") {
              this.innerText = convertedText;
              this.setAttribute("data-super-metrico-original", "false");
            } else {
              this.innerText = originalText;
              this.setAttribute("data-super-metrico-original", "true");
            }
          });
        })(value + whitespace + unit, originalValue + whitespace + originalUnit);

        var endSpan;
        if (ending.length > 0)
          endSpan = createSpan(ending);
        matches.push({
          prelude: preSpan,
          match: span,
          end: endSpan
        });
        lastIndex = regex.lastIndex;
      }
      if (!match)
        return;

      var container = createSpan(null, "super-metrico-container");
      for (var i in matches) {
        var match = matches[i];
        container.appendChild(match.prelude);
        container.appendChild(match.match);
        if (match.end) container.appendChild(match.end);
      }
      var closingText = text.substring(lastIndex);
      if (closingText)
        container.appendChild(createSpan(closingText));

      parent.replaceChild(container, node);
    } else {
      for (var i in node.childNodes) {
        lookup(node.childNodes[i], node);
      }
    }
  };
  var body = document.getElementsByTagName("body").item();
  lookup(body);
})();