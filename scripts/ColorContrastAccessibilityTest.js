function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}
function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
function ContrastCheck(hex) {
  //false = light; true = dark
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return r + g + b <= 382.5;
}

var ajustarLluminositatColor = function (color, percent, force = false) {
  var colorHSL = hexToHSL(color);
  if (colorHSL[2] > percent && percent > 50 && !force) {
    colorHSL[2] = 100 - (100 - colorHSL[2]) / 2;
  } else if (colorHSL[2] <= percent && percent <= 50 && !force) {
    colorHSL[2] = colorHSL[2] / 2;
  } else {
    colorHSL[2] = percent;
  }
  return HSLToHex(colorHSL[0], colorHSL[1], colorHSL[2]);
};

var generarVariablesCss = function () {
  var primaryColor = $("#ppal_color")[0].value;
  var bgColor = $("#bg_color")[0].value;
  var accesibilityLevel = $("#contrast")[0].value;

  if (accesibilityLevel == "") accesibilityLevel = "AA";

  var contrast = 0;
  if (accesibilityLevel == "A") contrast = 3;
  else if (accesibilityLevel == "AA") contrast = 4.5;
  else if (accesibilityLevel == "AAA") contrast = 7;

  ContrastAccesibility(primaryColor, bgColor);

  var darkMinimum = SuggerirColors("#ffffff", primaryColor, accesibilityLevel);
  if (darkMinimum == "") {
    darkMinimum = ajustarLluminositatColor(primaryColor, 30);
  }

  if (ContrastAccesibility(darkMinimum, "#ffffff") < contrast) {
  }

  var Dark = ajustarLluminositatColor(primaryColor, 20);

  if (ContrastAccesibility(Dark, "#ffffff") < contrast) {
  }

  var LightMinimum = SuggerirColors("#000000", primaryColor, accesibilityLevel);
  if (LightMinimum == "") {
    LightMinimum = ajustarLluminositatColor(primaryColor, 70);
  }

  if (ContrastAccesibility(LightMinimum, "#000000") < contrast) {
  }
  var Light = ajustarLluminositatColor(primaryColor, 80);

  if (ContrastAccesibility(Light, "#000000") < contrast) {
  }

  var PrimaryContrast = "";
  if (ContrastCheck(primaryColor)) {
    //dark
    PrimaryContrast = ajustarLluminositatColor(primaryColor, 95, true);
  } else {
    PrimaryContrast = ajustarLluminositatColor(primaryColor, 1, true);
  }
  if (ContrastAccesibility(PrimaryContrast, primaryColor) < contrast) {
    if (ContrastCheck(PrimaryContrast)) {
      //dark
      PrimaryContrast = ajustarLluminositatColor(primaryColor, 100, true);
    } else {
      PrimaryContrast = ajustarLluminositatColor(primaryColor, 0, true);
    }
  }

  var textColor = ajustarLluminositatColor(primaryColor, 5, true);
  if (ContrastAccesibility(textColor, "#ffffff") < contrast) {
    textColor = ajustarLluminositatColor(primaryColor, 1, true);
  }

  var DarkGray = SuggerirColors("#ffffff", "#000000", "AAA");
  var LightGray = SuggerirColors("#000000", "#000000", "AAA");

  var result = "";
  result +=
    '<p style="color:' +
    primaryColor +
    "; background: " +
    bgColor +
    '"><strong>--primary-color: </strong>' +
    primaryColor +
    ";</p>";
  result +=
    '<p style="color:' +
    bgColor +
    "; background: " +
    primaryColor +
    '"><strong>--background-color: </strong> ' +
    bgColor +
    ";</p>";

  result +=
    '<p style="color:' +
    darkMinimum +
    '; background: #ffffff;"><strong>--primary-dark-minimum: </strong>' +
    darkMinimum +
    ";</p>";

  result +=
    '<p style="color:' +
    Dark +
    '"><strong>--primary-dark: </strong> ' +
    Dark +
    ";</p>";

  result +=
    '<p style="color:' +
    LightMinimum +
    '; background: #000000;"><strong>--primary-light-minimum: </strong>' +
    LightMinimum +
    ";</p>";

  result +=
    '<p style="color:' +
    Light +
    ' ; background: #000000;"><strong>--primary-light: </strong> ' +
    Light +
    ";</p>";

  result +=
    '<p style="color:' +
    PrimaryContrast +
    " ; background: " +
    primaryColor +
    ';"><strong>--primary-contrast: </strong> ' +
    PrimaryContrast +
    ";</p>";

  result +=
    '<p style="color:' +
    textColor +
    ' ; background: #ffffff;"><strong>--text-color: </strong> ' +
    textColor +
    ";</p>";

  result +=
    '<p style="background:' +
    LightGray +
    ' ; color: #000000;"><strong>--light-gray: </strong> ' +
    LightGray +
    ";</p>";
  result +=
    '<p style="background:' +
    DarkGray +
    ' ; color: #ffffff;"><strong>--dark-gray: </strong> ' +
    DarkGray +
    ";</p>";

  $("#css-result")[0].innerHTML = result;
};

var SuggerirColors = function (colorFixed, colorVariable, accesibilityLevel) {
  var colorVariableHSL = hexToHSL(colorVariable);
  var contrastLum = 500;
  var result = "";
  var contrast = 0;
  if (accesibilityLevel == "A") contrast = 3;
  else if (accesibilityLevel == "AA") contrast = 4.5;
  else if (accesibilityLevel == "AAA") contrast = 7;

  var generateFullColorScale = function (H, S, L, steps) {
    var palette = [];

    var L1 = L;
    for (i = 0; i < steps; i++) {
      L1 = i * (100 / steps);
      palette.push(HSLToHex(H, S, L1));
    }
    return palette;
  };

  var colorPalette = generateColorScale(
    colorVariableHSL[0],
    colorVariableHSL[1],
    colorVariableHSL[2],
    100
  );

  if (
    (colorFixed == "#ffffff" || colorFixed == "#000000") &&
    (colorVariable == "#ffffff" || colorVariable == "#000000")
  ) {
    if (colorFixed == "#000000") {
      for (x = 0; x <= 100; x++) {
        var tmpColor = ajustarLluminositatColor(colorVariable, x, true);
        if (ContrastAccesibility(tmpColor, colorFixed) > contrast) {
          return tmpColor;
        }
      }
    } else {
      for (x = 100; x >= 0; x--) {
        var tmpColor = ajustarLluminositatColor(colorVariable, x, true);
        if (ContrastAccesibility(tmpColor, colorFixed) > contrast) {
          return tmpColor;
        }
      }
    }
  }

  if (ContrastCheck(colorFixed)) {
    //dark
    for (x = colorPalette.length - 1; x >= 0; x--) {
      var dif = ContrastAccesibility(colorPalette[x], colorFixed);

      if (dif >= contrast) {
        var tmpcolor = hexToHSL(colorPalette[x]);
        var TmpDif = Math.abs(tmpcolor[2] - colorVariableHSL[2]);
        if (TmpDif < contrastLum) {
          contrastLum = TmpDif;
          result = colorPalette[x];
        }
      }
    }
  } else {
    //light
    for (x = 0; x < colorPalette.length; x++) {
      var dif = ContrastAccesibility(colorPalette[x], colorFixed);

      if (dif >= contrast) {
        var tmpcolor = hexToHSL(colorPalette[x]);
        var TmpDif = Math.abs(tmpcolor[2] - colorVariableHSL[2]);
        if (TmpDif < contrastLum) {
          contrastLum = TmpDif;
          result = colorPalette[x];
        }
      }
    }
  }

  return result;
};

var printPruposalColor = function () {
  var textColor = $("#ppal_color")[0].value;
  var bgColor = $("#bg_color")[0].value;
  var accesibilityLevel = $("#contrast")[0].value;

  var textPrupose = SuggerirColors(bgColor, textColor, accesibilityLevel);
  var bgPrupose = SuggerirColors(textColor, bgColor, accesibilityLevel);

  var str = "Amb nivell " + accesibilityLevel + ":<br/>";
  if (bgPrupose != "") {
    str +=
      "Si vols mantenir el color de text, prova el color de fons (" +
      bgPrupose +
      ") <br/>";
  } else {
    str +=
      "Si vols mantenir el color de text, no hi ha cap combinació de colors amb aquest nivell d'accessibilitat. <br/>";
  }
  if (textPrupose != "") {
    str +=
      "Si vols mantenir el color de fons, prova el color de text (" +
      textPrupose +
      ") <br/>";
    $("#color-pruposal").css("color", textPrupose);
  } else {
    str +=
      "Si vols mantenir el color de fons, no hi ha cap combinació de colors amb aquest nivell d'accessibilitat.";
    $("#color-pruposal").css("color", textColor);
  }

  $("#color-pruposal")[0].innerHTML = str;

  var contrast = 0;
  if (accesibilityLevel == "A") contrast = 3;
  else if (accesibilityLevel == "AA") contrast = 4.5;
  else if (accesibilityLevel == "AAA") contrast = 7;

  var lum = ContrastAccesibility(textColor, bgColor);
  if (lum <= contrast) {
    $("#color-pruposal").show();
  } else {
    $("#color-pruposal").hide();
  }
};

var show = function (paletaText, paletaBg) {
  var result = "";
  result += "<h1> Results </h1>";
  result +=
    '<div style="display: flex;flex-direction: row;align-self: center;justify-content: space-evenly;width: 100%;"> ';
  result +=
    '<div style="display: flex; flex-direction: column; flex-grow: 1;"> ';
  result +=
    '<div class="color AAA AA A" style="text-align: center;position: sticky;top: 68px;z-index: 1; background: white"><div class="color-box ' +
    '"><p> </p></div></div>';
  for (y = 0; y < paletaBg.length; y++) {
    var bgColor = paletaBg[y];
    var classe = "";
    if (bgColor == FonsMesProper) {
      classe = "mesProper colMesProper";
    }
    result +=
      '<div class="color AAA AA A ' +
      classe +
      '" style="text-align: center;position: sticky;top: 0;z-index: 1; background: white"><div class="color-box ' +
      '"><p>' +
      paletaBg[y] +
      "</p></div></div>";
  }
  result += "</div>";
  var classColProp = "";
  var classRowProp = "";
  for (x = 0; x < paletaText.length; x++) {
    if (paletaText[x] == TextMesProper) classColProp = "mesPropera";
    else classColProp = "";
    result +=
      '<div style="display: flex; flex-direction: column; flex-grow: 1;" class="' +
      classColProp +
      '"> ';
    var textColor = paletaText[x];
    var classe = "";
    if (textColor == TextMesProper) {
      classe = "mesProper";
    }
    result +=
      '<div class="color AAA AA A ' +
      classe +
      '" style="text-align: center;position: sticky;top: 68px;z-index: 1; background: white"><div class="color-box ' +
      '"><p>' +
      textColor +
      "</p></div></div>";
    for (y = 0; y < paletaBg.length; y++) {
      var bgColor = paletaBg[y];
      result += printColor(textColor, bgColor, bgColor == FonsMesProper);
    }
    result += "</div>";
  }
  result += "</div>";
  $("#color-result")[0].innerHTML = result;
  $("#contrast").change();
};

var printColor = function (textColor, bgColor, mesProper) {
  var textColorCSS = textColor.replaceAll("#", "");
  var bgColorCSS = bgColor.replaceAll("#", "");
  document.documentElement.style.setProperty("--" + textColorCSS, textColor);
  document.documentElement.style.setProperty("--" + bgColorCSS, bgColor);

  var accesibilityClass = "";
  var contrast = ContrastAccesibility(textColor, bgColor);
  if (contrast < 3) {
    accesibilityClass = "no-A";
  } else if (contrast < 4.5) {
    accesibilityClass = "A";
  } else if (contrast < 7) {
    accesibilityClass = "AA A";
  } else {
    accesibilityClass = "AAA AA A";
  }
  var colorProper = "";
  if (mesProper) colorProper = " colMesProper ";

  return (
    '<div class="color ' +
    accesibilityClass +
    colorProper +
    '"" style="text-align: center; "><div style="background: var(--' +
    bgColorCSS +
    "); color: var(--" +
    textColorCSS +
    ')" class="color-box ' +
    '"><p>(' +
    Math.round(contrast * 10) / 10 +
    ":1)</p></div></div>"
  );
};

var AplicarColors = function () {
  var textColor = $("#ppal_color")[0].value;
  var bgColor = $("#bg_color")[0].value;
  document.documentElement.style.setProperty(
    "--text-color-original",
    textColor
  );
  document.documentElement.style.setProperty("--bg-color", bgColor);

  var contrastRatio = ContrastAccesibility(textColor, bgColor);

  var lvl = "";
  if (contrastRatio < 3) {
    lvl += "No accessible!!! (" + Math.round(contrastRatio * 10) / 10 + ":1)";
  } else if (contrastRatio < 4.5) {
    lvl = "A (" + Math.round(contrastRatio * 10) / 10 + ":1)";
  } else if (contrastRatio < 7) {
    lvl = "AA (" + Math.round(contrastRatio * 10) / 10 + ":1)";
  } else if (contrastRatio < 21) {
    lvl = "AAA (" + Math.round(contrastRatio * 10) / 10 + ":1)";
  } else {
    lvl =
      "Vigila, tot i tenir el nivell AAA (" +
      Math.round(contrastRatio * 10) / 10 +
      ":1), un contrast tan elevat pot ocasionar dificultats visuals a aquelles persones amb sensibilitat al contrast. Prova a canviar el #000000 per #111111.";
  }
  $("#contrast-lvl")[0].innerText = lvl;

  GenerarComparacions(textColor, bgColor);

  printPruposalColor();

  generarVariablesCss();
};

var ColorMesProper = function (paleta, color) {
  var MesProper = "";
  var colorHSL = hexToHSL(color);
  var DiferenciaL = 500;
  for (i = 0; i < paleta.length; i++) {
    var tmpcolor = hexToHSL(paleta[i]);
    var TmpDif = Math.abs(tmpcolor[2] - colorHSL[2]);
    if (TmpDif < DiferenciaL) {
      DiferenciaL = TmpDif;
      MesProper = paleta[i];
    }
  }
  return MesProper;
};

var GenerarComparacions = function (textColor, bgColor) {
  var textColorHSL = hexToHSL(textColor);
  var paletaText = generateColorScale(
    textColorHSL[0],
    textColorHSL[1],
    textColorHSL[2],
    10
  );
  var bgColorHSL = hexToHSL(bgColor);
  var paletaBg = generateColorScale(
    bgColorHSL[0],
    bgColorHSL[1],
    bgColorHSL[2],
    50
  );

  TextMesProper = ColorMesProper(paletaText, textColor);
  FonsMesProper = ColorMesProper(paletaBg, bgColor);

  show(paletaText, paletaBg);
};

var hexFormatChecker = function (color) {
  if (color.length > 0) {
    let regEx = /^[0-9a-fA-F]+$/;
    color = color.replace("#", "");
    let isHex = regEx.test(color);

    if (!isHex) {
      color = color.slice(0, -1);
    }

    if (color.length > 6) {
      color = color.slice(0, 6);
    }

    if (color.length > 0 && color.charAt(0) != "#") {
      color = "#" + color;
    }
  }
  return color;
};

function ContrastAccesibility(Color1, Color2) {
  var fnlluminositatColor = function (color) {
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);

    r = r / 255;
    g = g / 255;
    b = b / 255;
    if (r > 0.03928) {
      r = Math.pow((r + 0.055) / 1.055, 2.4);
    } else {
      r = r / 12.92;
    }
    if (g > 0.03928) {
      g = Math.pow((g + 0.055) / 1.055, 2.4);
    } else {
      g = g / 12.92;
    }
    if (b > 0.03928) {
      b = Math.pow((b + 0.055) / 1.055, 2.4);
    } else {
      b = b / 12.92;
    }

    var result = r * 0.2126 + g * 0.7152 + b * 0.0722;
    return result;
  };
  var lum1 = fnlluminositatColor(Color1);
  var lum2 = fnlluminositatColor(Color2);
  if (lum2 > lum1) {
    return (lum2 + 0.05) / (lum1 + 0.05);
  }
  return (lum1 + 0.05) / (lum2 + 0.05);
}

var generateColorScale = function (H, S, L, steps) {
  var palette = [];

  var L1 = L;
  for (i = 0; i < steps; i++) {
    L1 = i * (100 / steps);
    if (L1 == 0) L1 = 5;
    else if (L1 == 100) L1 = 98;

    palette.push(HSLToHex(H, S, L1));
  }
  return palette;
};
AplicarColors();

$("#ppal_color").change(function (e) {
  $("#ppal_color_text")[0].value = this.value;
  AplicarColors();
});

$("#swapColors").click(function () {
  var textColor = $("#ppal_color")[0].value;
  var bgColor = $("#bg_color")[0].value;

  $("#bg_color")[0].value = textColor;
  $("#ppal_color")[0].value = bgColor;
  $("#bg_color_text")[0].value = textColor;
  $("#ppal_color_text")[0].value = bgColor;
  AplicarColors();
});

$("#ppal_color_text").change(function (e) {
  let color = this.value;
  color = hexFormatChecker(color);

  if (color.length == 7) {
    this.value = color;
    $("#ppal_color")[0].value = color;
    AplicarColors();
  }
});

$("#bg_color").change(function (e) {
  $("#bg_color_text")[0].value = this.value;
  AplicarColors();
});

$("#bg_color_text").change(function (e) {
  let color = this.value;
  color = hexFormatChecker(color);

  if (color.length == 7) {
    this.value = color;
    $("#bg_color")[0].value = color;
    AplicarColors();
  }
});

$("#contrast").change(function () {
  var lvl = this.value;
  if (lvl != "") {
    $(".lvl").show();
    $(".color").each(function () {
      if (!this.classList.contains(lvl)) {
        $(this).addClass("accessible-unreach");
      } else {
        $(this).removeClass("accessible-unreach");
      }
    });
  } else {
    $(".lvl").hide();
    $(".accessible-unreach").each(function () {
      $(this).removeClass("accessible-unreach");
    });
  }
  printPruposalColor();
  generarVariablesCss();
});

$("#css-generator").click(function () {
  var str = ":root{";
  str += $("#css-result")[0].innerText.replaceAll("\n", " ");
  str += "}";
  navigator.clipboard
    .writeText(str)
    .then(() => {
      alert("S'han copiat les variables CSS al portapapers");
    })
    .catch((err) => {
      console.log("UPS!", err);
    });
});
