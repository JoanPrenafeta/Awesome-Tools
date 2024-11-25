class Color {
    #hex= ""; //#XXXXXX
    #R= 0; // 0 - 255
    #G= 0; // 0 - 255
    #B= 0; // 0 - 255
    #H= 0; // 0 - 360
    #S= 0; // 0 - 100
    #L= 0; // 0 - 100

    constructor(hex = "#000000") {
        if (Colors.isValidHexColor(hex)) {
            this.setColorByHex(hex);
        } else {
            debugger
            throw new Error(`Invalid HEX: ${hex}`);
        }
    }

    setColorByHex(hex){
        if (Colors.isValidHexColor(hex)){
            hex = Colors.formatHex(hex,true);
            
            this.#hex = hex;

            let rgb = Colors.hexToRGB(hex);
            this.#R= rgb[0];
            this.#G= rgb[1];
            this.#B= rgb[2];

            let hsl = Colors.hexToHSL(hex);
            this.#H= hsl[0];
            this.#S= hsl[1];
            this.#L= hsl[2];
        }
    };

    setColorByHSL(H, S, L){
        let hex = Colors.hslToHex(H, S, L);
        if (Colors.isValidHexColor(hex)){
            hex = Colors.formatHex(hex,true);
            this.#hex = hex;

            let rgb = Colors.hexToRGB(hex);
            this.#R= rgb[0];
            this.#G= rgb[1];
            this.#B= rgb[2];

            this.#H= H;
            this.#S= S;
            this.#L= L;
        }
    };

    setColorByRGB(R, G, B){
        let hex = Colors.rgbToHEX(R,G,B);

        if (Colors.isValidHexColor(hex)){
            hex = Colors.formatHex(hex,true);
            this.#hex = hex;

            this.#R= R;
            this.#G= G;
            this.#B= B;

            let hsl = Colors.hexToHSL(hex);
            this.#H= hsl[0];
            this.#S= hsl[1];
            this.#L= hsl[2];
        }
    };

    isDarkColor(){
        return (this.R + this.G + this.B <= 382.5)
    };

     contrastColor(){
        if (this.isDarkColor()){
            return new Color("#FFFFFF");
        } 
        return new Color("#000000");
    };

    //HEX
    set hex(value) {
        this.setColorByHex(value)
    };

    get hex() {
        return this.#hex;
    };

    //HSL
    set H(value) {
        this.setColorByHSL(value,this.#S, this.#L);
    };

    get H() {
        return this.#H;
    };

    set S(value) {
        this.setColorByHSL(this.#H, value, this.#L);
    };

    get S() {
        return this.#S;
    };

    set L(value) {
        this.setColorByHSL(this.#H, this.#S, value);
    };

    get L() {
        return this.#L;
    };

    //RGB

    set R(value) {
        this.setColorByRGB(value,this.#G, this.#B);
    };

    get R() {
        return this.#R;
    };

    set G(value) {
        this.setColorByRGB(this.#R, value, this.#B);
    };

    get G() {
        return this.#G;
    };

    set B(value) {
        this.setColorByRGB(this.#R, this.#G, value);
    };

    get B() {
        return this.#B;
    };

};

const Colors = {
    accessibilityLevel: {
        a: 3,
        aa: 4.5,
        aaa: 7,
        highContast: 12,
    },


    isValidHexColor: function (color) {
        const hexPattern = /^#?[0-9A-Fa-f]{1,6}$/;
        return hexPattern.test(color);
    },

    formatHex: function(color, hastag = false){
        let hex = color.replaceAll("#","");
        if (hex.length == 0){
            throw new Error ("No color selected")
        }
        else if (hex.length == 1){
            hex = "" + hex + hex + hex + hex + hex + hex;
        }
        else if (hex.length == 2){
            hex =  "" + hex + hex + hex;
        }
        else if (hex.length == 3){
            hex = "" + hex + hex;
        }
        else{
            while (hex.length < 6){
                hex += hex.charAt(hex.length-1)
            }
            if (hex.length > 6){
                hex = hex.substring(0,6)
            }
        }
        if (hastag) hex = "#"+hex;
        return hex;
    },

    hslToHex: function(h, s, l){
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
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
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    },

    hexToHSL(H) {
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

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h, s, l];
    },

    hexToRGB: function(hex){
        hex = hex.replaceAll("#","");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return [r,g,b]
    },

    rgbToHEX: function (r, g, b) {
       if ( r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw new Error("Invalid RGB");
        }
        
        const toHex = (value) => value.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },

    isDarkColor: function(hex){
        let RGB = this.hexToRGB(hex);
        const r = RGB[0]; 
        const g = RGB[1]; 
        const b = RGB[2];
        if (r + g + b <= 382.5){
            return true
        }
        return false
    },

    contrastColor: function(hex){
        if (isDarkColor(hex)){
            return "#FFFFFF";
        }
        else{
            return "#000000";
        }
    },

    randomColor: function(){//Return a random HEX color.
        const Red = Math.floor(Math.random() * 256); // 0 - 255
        const Green = Math.floor(Math.random() * 256); // 0 - 255
        const Blue = Math.floor(Math.random() * 256); // 0 - 255

        return this.rgbToHEX (Red, Green, Blue);
    },

    colorLuminance: function(color) {
        let RGB = this.hexToRGB(color);
        let r = RGB[0]; 
        let g = RGB[1]; 
        let b = RGB[2];

        r = r / 255;
        g = g / 255;
        b = b / 255;
        if (r > 0.03928) { r = Math.pow(((r + 0.055) / 1.055), 2.4) } else { r = r / 12.92 }
        if (g > 0.03928) { g = Math.pow(((g + 0.055) / 1.055), 2.4) } else { g = g / 12.92 }
        if (b > 0.03928) { b = Math.pow(((b + 0.055) / 1.055), 2.4) } else { b = b / 12.92 }

        var result = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
        return result;
    },

    setLuminance: function(color, percent){
        var colorHSL = this.hexToHSL(color);
        if (percent>= 100){
            percent = 100;
        }
        else if (percent <= 0){
            percent = 0;
        }
        
        return this.HSLToHex(colorHSL[0],colorHSL[1],percent);
    },

    contrastBetweenColors: function(firstColor, secondColor){
        var lum1 = this.colorLuminance(firstColor);
        var lum2 = this.colorLuminance(secondColor);
        if (lum2 > lum1) {
            return (lum2 + 0.05) / (lum1 + 0.05)
        }
        return (lum1 + 0.05) / (lum2 + 0.05)
    },

    checkAccessibilityLevel: function(firstColor, secondColor, accessibilityLevel){
        let contrast = this.contrastBetweenColors(firstColor, secondColor)
        if (contrast >=21){
            console.log("Excessive contrast can lead to visual discomfort.");
            return false;
        }
        return (contrast>=accessibilityLevel)
    },

    closestAccessibleColor: function(variableColor, fixedColor, accessibilityLevel = this.accessibilityLevel.aa){
        if (this.checkAccessibilityLevel(fixedColor, variableColor, accessibilityLevel)){
            return variableColor;
        }
        let newColor = variableColor;
        var contrast = this.contrastBetweenColors(fixedColor, newColor);
        var hslColor = this.hexToHSL(newColor);
        var h = hslColor[0];
        var s = hslColor[1];
        var l = hslColor[2];
        
        var increasingLuminance = false;
        if (contrast >= 16){
            increasingLuminance = this.isDarkColor(newColor)
        }
        else{
            increasingLuminance = (this.contrastBetweenColors(fixedColor, newColor) <= this.contrastBetweenColors(fixedColor, this.hslToHex(h, s, l+1)));
        }
        while (!this.checkAccessibilityLevel(fixedColor, newColor, accessibilityLevel) || this.contrastBetweenColors(fixedColor, newColor) > 16){
            if (increasingLuminance) l +=1;
            else l -= 1;

            if (l<0 || l>100){
                throw new Error("Imposible to find accessible color")
            }
            newColor = this.hslToHex(h, s, l);                
        }
        return newColor;
    }
}

var generatePalette = function (starterColor, contrast = Colors.accessibilityLevel.aa){
    var brandColor = new Color(starterColor);
    var brandLightMin = new Color(Colors.closestAccessibleColor(starterColor, "#000000", contrast));
    var brandDarkMin = new Color(Colors.closestAccessibleColor(starterColor, "#ffffff", contrast));
    var brandDark = brandColor;
    brandDark.L = brandDark.L/2;
    var brandLight = brandColor;
    brandLight.L = brandLight.L + ((100-brandLight.L)/2);
    var brandContrast = brandColor.contrastColor();

    return {
        basic: brandColor,
        lightMin: brandLightMin,
        darkMin: brandDarkMin,
        dark: brandDark,
        light: brandLight,
        contrast: brandContrast,
    }
} 

var PrimaryPalette = generatePalette(Colors.randomColor())