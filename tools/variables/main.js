var starterPrimary = new Color(Colors.randomColor());
//generarPaletaCSS("AA", starterPrimary.hex);

function calculatePalette (hex){
    var pagePalette = Colors.generatePalette(hex);
    document.documentElement.style.setProperty('--brand-primary', pagePalette.basic.hex);
    document.documentElement.style.setProperty('--brand-primary-contrast', pagePalette.contrast.hex);
    document.documentElement.style.setProperty('--link-color', pagePalette.darkMin.hex);
    console.clear();
    console.log('--brand-primary: ' + pagePalette.basic.hex);
    console.log('--brand-primary-contrast: ' + pagePalette.contrast.hex);
    console.log('--link-color: ' + pagePalette.darkMin.hex);
}

function randomize (){
    var randomValue = function( inputName){
        var input = $("#"+inputName)
        var length = input.children().length
        var selected = Math.floor(Math.random() * (length-1));
        input.val(input.children()[selected].value);
    }
    randomValue("font-combo");
    randomValue("stroke");
    randomValue("radius");
    randomValue("contenedor");
    
    forceUpdate();
}

function forceUpdate(){
    $("#ppal_color").change()
    $("#font-combo").change()
    $("#stroke").change()
    $("#radius").change()
    $("#contenedor").change()
}

function inputChange(inputName){
    $("#"+inputName).change(function(){
        $("body").removeClass(function(index, className) {
            return className
              .split(" ")
              .filter(c => c.startsWith(inputName+"-"))
              .join(" ");
          });
          $("body").addClass(inputName+"-"+this.value)
    });
}

$("#slide .dots button").click(function(){
    if (this.ariaSelected !== "true"){
        $('#slide .dots button').filter('[aria-selected="true"]')[0].ariaSelected = "";
        this.ariaSelected = "true";

    }
});

calculatePalette(starterPrimary.hex);
$("#ppal_color").val(starterPrimary.hex);

$("#ppal_color").change(function(){
    calculatePalette(this.value);    
});
 inputChange("font-combo");
 inputChange("stroke");
 inputChange("radius");
 inputChange("contenedor");

randomize();