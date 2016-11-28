// Console header
console.log("%c%s","color: #000; background: green; font-size: 12px;", "STARTING LASERWEB");

// ????
var activeObject, fileName;

// Intialise
lw.log.init();
lw.store.init();
lw.file.init();
lw.menu.init();
lw.numpad.init();
lw.viewer.init();
lw.dxf.loadFonts();

init3D();
filePrepInit();
initTabs();
initJog();
//errorHandlerJS();
var paperscript = {};
rasterInit();
macrosInit();
//svgInit();
initSocket();
initTour();
initSmoothie();
initEsp8266();
initTree();


// Tooltips
$(document).tooltip();
$(document).click(function() {
    $(this).tooltip("option", "hide", {
        effect: "clip",
        duration: 500
    }).off("focusin focusout");
});

$('#g-open').on('click', function() {
    $('#googledrive').modal('show');
});
// Top toolbar Menu

// Fix for opening same file from http://stackoverflow.com/questions/32916687/uploading-same-file-into-text-box-after-clearing-it-is-not-working-in-chrome?lq=1
$('#file').bind('click', function() {
    $('#file').val(null);
});

// View -> reset
$('#viewReset').on('click', function() {
    resetView();
});

$('#savesettings').on('click', function() {
    lw.store.refreshStore();
});

$('#backup').on('click', function() {
    lw.store.saveFile();
});

// Tabs on right side
$('#drotabtn').on('click', function() {
    $('#drotab').show();
    $('#gcodetab').hide();
    $("#drotabtn").addClass("active");
    $("#gcodetabbtn").removeClass("active");
});


$('#gcodetabbtn').on('click', function() {
    $('#drotab').hide();
    $('#gcodetab').show();
    $("#drotabtn").removeClass("active");
    $("#gcodetabbtn").addClass("active");
});

// Show/Hide Macro Pad
$('#toggleviewer').on('click', function() {
    if ($( "#toggleviewer" ).hasClass( "active" )) {

    } else {
        $('#hometab').show();
        $('#camleftcol').hide();
        $('#settingscol').hide();
        $("#toggleviewer").addClass("active");
        $("#togglefile").removeClass("active");
        $("#togglesettings").removeClass("active");
    }
});

$('#togglefile').on('click', function() {
    if ($( "#togglefile" ).hasClass( "active" )) {

    } else {
        $('#hometab').hide();
        $('#camleftcol').show();
        $('#settingscol').hide();
        $("#toggleviewer").removeClass("active");
        $("#togglefile").addClass("active");
        $("#togglesettings").removeClass("active");
    }
});

$('#togglesettings').on('click', function() {
    if ($( "#togglesettings" ).hasClass( "active" )) {

    } else {
        $('#hometab').hide();
        $('#camleftcol').hide();
        $('#settingscol').show();
        $("#toggleviewer").removeClass("active");
        $("#togglefile").removeClass("active");
        $("#togglesettings").addClass("active");
    }
});

// Progressbar
// NProgress.configure({ parent: '#gcode-menu-panel' });
NProgress.configure({
    showSpinner: false
});

// Check if all required settings are loaded
lw.store.checkParams();

// Bind Quote System
$('.quoteVar').keyup(function(){
    var setupfee = ( parseFloat($("#setupcost").val()) ).toFixed(2);
    var materialcost = ( parseFloat($("#materialcost").val()) * parseFloat($("#materialqty").val()) ).toFixed(2);
    var timecost = ( parseFloat($("#lasertime").val()) * parseFloat($("#lasertimeqty").val()) ).toFixed(2);
    var unitqty = ( parseFloat($("#qtycut").val()) ).toFixed(2);
    var grandtot = (materialcost*unitqty) + (timecost*unitqty) + parseFloat(setupfee);
    var grandtotal = grandtot.toFixed(2);
    $("#quoteprice").empty();
    $("#quoteprice").html('<div class="table-responsive"><table class="table table-condensed"><thead><tr><td class="text-center"><strong>Qty</strong></td><td class="text-center"><strong>Description</strong></td><td class="text-right"><strong>Unit</strong></td><td class="text-right"><strong>Total</strong></td></tr></thead><tbody><tr><td>1</td><td>Setup Cost</td><td class="text-right">'+setupfee+'</td><td class="text-right">'+setupfee+'</td></tr><tr><td>'+unitqty+'</td><td>Material</td><td class="text-right">'+materialcost+'</td><td class="text-right">'+(materialcost*unitqty).toFixed(2)+'</td></tr><tr><td>'+unitqty+'</td><td>Laser Time</td><td class="text-right">'+timecost+'</td><td class="text-right">'+(timecost*unitqty).toFixed(2)+'</td></tr><tr><td class="thick-line"></td><td class="thick"></td><td class="thick-line text-center"><strong>Total</strong></td><td class="thick-line text-right">'+ grandtotal +'</td></tr></tbody></table></div>' );
});

$('#controlmachine').hide();
$('#armmachine').show();
$('#armpin').pincodeInput({
    // 4 input boxes = code of 4 digits long
    inputs:4,
    // hide digits like password input
    hideDigits:true,
    // keyDown callback
    keydown : function(e){},
    // callback when all inputs are filled in (keyup event)
    complete : function(value, e, errorElement){
        var val = lw.store.get(armpin);
        if (val) {

        } else {
            val = "1234"
        }
        if ( value != val ){
            $("#armerror").html("Code incorrect");
            // $("#armButton").addClass('disabled');
        } else {
            $("#armerror").html("Code correct");
            $('#controlmachine').show();
            $('#armmachine').hide();
            // $("#armButton").removeClass('disabled');
        }
    }
});
$('#setarmpin').pincodeInput({
    // 4 input boxes = code of 4 digits long
    inputs:4,
    // hide digits like password input
    hideDigits:false,
    // keyDown callback
    keydown : function(e){},
    // callback when all inputs are filled in (keyup event)
    complete : function(value, e, errorElement){
        lw.store.set(armpin, value);
        $("#setpinmsg").html("<h3>Pin set to "+value+"</h3>");
        setTimeout(function(){ $('#pinresetmodal').modal('hide') }, 500);
        // $('#pinresetmodal').modal('hide');
    }
});

var overridePinCode = lw.store.get('safetyLockDisabled');
if (overridePinCode == 'Enable') {
    $('#controlmachine').show();
    $('#armmachine').hide();
}

cncMode = $('#cncMode').val()
if (cncMode == "Enable") {
    document.title = "CNCWeb";
    $("#statusmodal").modal('show');
    $("#statusTitle").html("<h4>CNC Mode Activated</h4>");
    $("#statusBody").html("Note: You have activated <b>CNC mode</b> from <kbd>Settings</kbd> -> <kbd>Tools</kbd> -> <kbd>Enable CNC Cam</kbd>");
    $("#statusBody2").html("While in CNC mode, Laser Raster Engraving is not enabled.  Please only open GCODE, DXF or SVG files.<hr>To revert to Laser Mode, go to <kbd>Settings</kbd> -> <kbd>Tools</kbd> -> <kbd>Enable CNC Cam</kbd>, and change it to <kbd>Disabled</kbd><hr>Please help us improve this experimental feature by giving feedback, asking for improvements, sharing ideas and posting bugs in the <a class='btn btn-sm btn-success' target='_blank' href='https://plus.google.com/communities/115879488566665599508'>Support Community</a>");
};

// Command Console History
$("#command").inputHistory({
    enter: function () {
        var commandValue = $('#command').val();
        sendGcode(commandValue);
    }
});

setTimeout(function(){ $('#viewReset').click(); }, 100);


// Version check

var version = $('meta[name=version]').attr("content");
$.get( "https://raw.githubusercontent.com/openhardwarecoza/LaserWeb3/master/version.txt", function( data ) {
    lw.log.print("Version currently Installed : " + version , 'message', "git")
    lw.log.print("Version available online on Github : " + data , 'message', "git")
    if ( parseInt(version) < parseInt(data) ) {
        lw.log.print("<b><u>NB:  UPDATE AVAILABLE!</u></b>  - Execute 'git pull' from your laserweb terminal " , 'error', "git")
    } else {
        lw.log.print("Your version of LaserWeb is Up To Date! " , 'success', "git")
    }

});

// A few gcode input fields need to be caps for the firmware to support it
$('.uppercase').keyup(function() {
    // this.value = this.value.toLocaleUpperCase();
});

// Error handling
function errorHandlerJS() {
    window.onerror = function(message, url, line) {
        message = message.replace(/^Uncaught /i, "");
        //alert(message+"\n\n("+url+" line "+line+")");
        console.log(message + "\n\n(" + url + " line " + line + ")");
        if (message.indexOf('updateMatrixWorld') == -1 ) { // Ignoring threejs/google api messages, add more || as discovered
            lw.log.print(message + "\n(" + url + " on line " + line + ")", 'error');
        }
    };
};


// =============================================================================

// LaserWeb scope
var lw = lw || {};

(function () {
    'use strict';

    lw.toggleFullScreen = function() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            lw.log.print('Going Fullscreen', 'success', "fullscreen");
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            lw.log.print('Exiting Fullscreen', 'success', "fullscreen");
        }
    }

    $('#toggleFullScreen').on('click', lw.toggleFullScreen);

})();
