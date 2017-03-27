function initColorPicker(id) {
    var canvas_el = $(document.createElement('canvas')); 
    canvas_el.id =  'canvas_'+ id;
    width = "600";
    height = "440";
    console.log(canvas_el);
    // var canvas = canvas_el.getContext('2d');

	// var img = new Image();
	// img.src = 'img/image.jpg';

	// $(img).load(function(){
	//   canvas.drawImage(img,0,0);
	// });

}

function getRGB(canvasId) {
    var canvas = document.getElementById(canvasId).getContext('2d');

    // getting user coordinates
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    window.alert(event.pageX + ', ' + canvas.offsetLeft);
    // getting image data and RGB values
    var img_data = canvas.getImageData(x, y, 1, 1).data;
    var R = img_data[0];
    var G = img_data[1];
    var B = img_data[2];  
    var rgb = R + ',' + G + ',' + B;

    return rgb;
    // convert RGB to HEX
    var hex = rgbToHex(R,G,B);
    // making the color the value of the input
    $('#rgb input').val(rgb);
    $('#hex input').val('#' + hex);
}

function getHex(canvasId) {
    var canvas = document.getElementById(canvasId).getContext('2d');

    // getting user coordinates
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    // getting image data and RGB values
    var img_data = canvas.getImageData(x, y, 1, 1).data;
    var R = img_data[0];
    var G = img_data[1];
    var B = img_data[2];  

    // convert RGB to HEX
    var hex = rgbToHex(R,G,B);

    return hex;
}

//////////////////
function addColorPicker_(widgetID, graphID, data, w, h, x, y) {
    //initColorPicker(graphID);
    // var canvas_el = $(document.createElement('canvas')); 
    // canvas_el.id =  'canvas_'+ id;
    // width = "600";
    // height = "440";
    // console.log(canvas_el);

    //var canvaspicker = document.getElementById("canvas_"+graphID);
    //var divStr = canvaspicker.outerHTML;
    var canvasStr = '<canvas width="230" height="180" id="canvas_'+graphID+'"></canvas>';

    var div = '<div class="widget-color colorpicker" style="  -webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="colorpicker'+graphID.substring(11)+'" class="" style="display: block;margin: 0 auto;">'+canvasStr+'<div><button id="setColorBtn" class="" style="" onclick="setColor(\''+graphID+'\')">Set Color</button></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);

    var canvaspicker = document.getElementById("canvas_"+graphID);
    var canvas = canvaspicker.getContext('2d');
	var img = new Image();
	img.src = 'img/image.jpg';
    //img.style = 'width:100%';

	$(img).load(function(){
	  canvas.drawImage(img,0,0);
	});

////
	$('#canvas_'+graphID).click(function(event){
        //var canvaspicker = document.getElementById("canvas_"+graphID);
        //console.log(canvaspicker);
        // getting user coordinates
        var x = event.pageX - canvaspicker.offsetLeft;
        var y = event.pageY - canvaspicker.offsetTop;
        //window.alert(canvaspicker.offsetTop + ', ' + canvaspicker.offsetLeft);   
        // getting image data and RGB values
        var img_data = canvas.getImageData(x, y, 1, 1).data;
        window.alert(img_data);
        var R = img_data[0];
        var G = img_data[1];
        var B = img_data[2];  
        
        var rgb_string = R + ',' + G + ',' + B;
        window.alert(rgb_string);
        });
////

    var c_i = parseInt(graphID.substring(11));
    if (c_i >= colorPickerIndex) {
        colorPickerIndex = c_i + 1;
    }
    graphs[graphID] = {};
    graphs[graphID]["type"] = "colorpicker";
    graphs[graphID]["chartData"] = data;
}