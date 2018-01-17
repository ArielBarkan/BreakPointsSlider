
/****Colors*****/
var rowBPbgColor          = "#FFFFFF";
var rowBPbgColorOnSlide   = "#eef1f4";
var rowBPbgColorOnDelete  = "#e7502a";
var maxBpStart            = 1500;
/**
Default breakpoints (coming from system or previously defined by user)
****/
var initialBreakpointsArray         = [
  {bpName: "Mobile",  imgIcon: "mobile1.png",  bpStart: 0,     bpStop: 479,   IsActive: "checked",  mainScreen:"" },
  {bpName: "Phablet", imgIcon: "other1.png",   bpStart: 480,   bpStop: 785,   IsActive: "",  mainScreen:"checked" },
  {bpName: "Tablet",  imgIcon: "tablet1.png",  bpStart: 786,   bpStop: 1023,  IsActive: "checked",  mainScreen:"" },
  {bpName: "PC",      imgIcon: "big1.png",     bpStart: 1024,  bpStop: NaN,  IsActive: "checked",  mainScreen:"" },
];

var labels  = {
  save    : "Save",
  edit    : "Edit",
  delete  : "Delete"
};

var sliderBreakPointsArray;
var range;

var finalBreakpoint   = initialBreakpointsArray;
var bpTrTemplate = '<tr disabled data-val="placeHolder_data-val" class="trItem">';
    bpTrTemplate += '<td name="mainScreen"><input type="radio" name="isMain" placeHolder_mainScreen disabled></td>';
    bpTrTemplate += '<td name="imgIcon"><img src="custom/icons/placeHolder_imgIcon"></td>';
    bpTrTemplate += '<td name="bpName" ><input type="text" name="bpNameVal" value="placeHolder_bpName" disabled></td>';
    bpTrTemplate += '<td name="bpStart">placeHolder_bpStart</td>';
    bpTrTemplate += '<td name="IsActive"><input type="checkbox" name="IsActiveVal"  placeHolder_IsActive disabled ><label name="checkboxController"></label></td>';
    bpTrTemplate += '<td class="bpEditRow" style="width: 50px">'+labels["edit"]+'</td>';
    bpTrTemplate += '<td class="bpDeleteRow">'+labels["delete"]+'</td>';
    bpTrTemplate += '</tr>';
    bpTrTemplate += '<tr"><td colspan="7"><hr></td></tr>';


$( document ).ready(function() {
  setupSlider();

	$("#newimgIcon").msDropdown();

  $("#consoleData").on("click", function(){
    consoleBreakPoints();
  })
  $("#apply").on("click", function(){
    addBpToArray();
  })

  $("tbody").delegate(".bpDeleteRow", "click", function() {

    var bpToDeleteFromArray = $(this).closest("tr").data("val");
    confirmDeleteBpFromArray(bpToDeleteFromArray);
    return false;
  });

  $("tbody").delegate(".bpSaveRow", "click", function() {
    var bpToEdit = $(this).closest("tr").data("val");
    $(this).html("Edit");
      $(this).addClass('bpEditRow').removeClass('bpSaveRow');

      saveUpdateRow(bpToEdit);
    return false;
  });

  $("tbody").delegate("label[class^=enabledCheckbox]", "click", function() {
    var tempClosestCheckBox =   $(this).closest('tr').find('[type=checkbox]');
    tempClosestCheckBox.prop('checked', ((tempClosestCheckBox.prop('checked'))?false:true));
console.log(tempClosestCheckBox.prop('checked'));



var tempClass = (tempClosestCheckBox.prop('checked'))?'enabledCheckbox_true':'enabledCheckbox_false';
$(this).removeClass( "enabledCheckbox_false", "enabledCheckbox_true").addClass(tempClass);
    return false;
  });

  $("tbody").delegate(".bpEditRow", "click", function() {
    var bpToEdit = $(this).closest("tr").data("val");
      $(this).html(labels["save"]);
        $(this).addClass('bpSaveRow').removeClass('bpEditRow');
    convertRowToEdited(bpToEdit);
    return false;
  });

  $("tbody").delegate("input[name=isMain]:radio", "change", function() {
      var bpToSetAsMain = $(this).closest("tr").data("val");
      updateMainBreakPoint(bpToSetAsMain);
  });



});

function handleCheckBox(){

}
function saveUpdateRow(bpToEdit){
  var tempBpRowToEdit = $("#btTable tbody").find("tr[data-val="+bpToEdit+"]");
  finalBreakpoint[bpToEdit]["bpName"]=tempBpRowToEdit.find("input[name=bpNameVal]").val()
finalBreakpoint[bpToEdit]["IsActive"] = (tempBpRowToEdit.find("input[name=IsActiveVal]").prop("checked"))?"checked":"";


var tempCheckBoxStatus  = tempBpRowToEdit.closest("tr").find("input[name=IsActiveVal]").prop("checked");
var tempLabelToSwitch   = tempBpRowToEdit.closest("tr").find("label[name=checkboxController]");
var tempBg = (tempCheckBoxStatus)?'custom/css/checkboxSelectedDisabled.png':'custom/css/checkboxUnselectedDisabled.png';

//tempLabelToSwitch.css({});
tempBpRowToEdit.find("label[name=checkboxController]").removeClass( "enabledCheckbox_true enabledCheckbox_false");
  tempBpRowToEdit.find("td input").prop('disabled', true);

};
function convertRowToEdited(bpToEdit){
  var tempBpRowToEdit     = $("#btTable tbody").find("tr[data-val="+bpToEdit+"]").find("td input:disabled");
  var tempCheckBoxStatus  = tempBpRowToEdit.closest("tr").find("input[name=IsActiveVal]").prop("checked");
  var tempLabelToSwitch   = tempBpRowToEdit.closest("tr").find("label[name=checkboxController]");

var tempClass = (tempCheckBoxStatus)?'enabledCheckbox_true':'enabledCheckbox_false';
tempLabelToSwitch.removeClass( "enabledCheckbox_false", "enabledCheckbox_true").addClass(tempClass);
  tempBpRowToEdit.prop('disabled', false);
};

function updateMainBreakPoint(bpToSetAsMain){
  $.each(finalBreakpoint, function (key, value) {
    value["mainScreen"] = (key == bpToSetAsMain)?"checked":"";
  });
};
function addBpToArray(){
  var tempNewBpName     = $("#newBpName").val();
  var tempNewIcon       = $("#newimgIcon option:selected").val();
  var tempNewStartAt    = parseInt($("#newBpStart").val());
  var tempNewEndAt      = 200;
  var tempNewIsActive = ($("#newIsActive").prop("checked"))?"checked":"";
  if(tempNewBpName.length <2 ){
    alert("Breakpoint name is missing , please update and resubmit")
    return false;
  }
  if(tempNewStartAt > maxBpStart){
    alert("The maximux width alowed is "+maxBpStart+" , please update and resubmit")
    return false;
  }
  if(!$.isNumeric(tempNewStartAt )){
    alert("Please type a number , please update and resubmit")
    return false;
  }
  finalBreakpoint.push(
    {bpName: tempNewBpName,    imgIcon: tempNewIcon,  bpStart: tempNewStartAt, bpStop:tempNewEndAt, IsActive: tempNewIsActive, mainScreen: '' }
  )

  $("#newBpName").val("");
  $("#newimgIcon option[value=0]").attr('selected','selected');
  $("#newBpStart").val("");
  $("#newIsActive").prop("checked", false);
  setupSlider();
}
function getMax(array){
    array.sort(function(a, b){return a - b});
    return array[array.length-1];
}

function destroy(){
  try{range.noUiSlider.destroy()}catch(e){};
}
function confirmDeleteBpFromArray(bpToDeleteFromArray){

  var tempBpName        = finalBreakpoint[bpToDeleteFromArray]["bpName"];
  var tempBpStart       = finalBreakpoint[bpToDeleteFromArray]["bpStart"];
  var tempBpRowToDelete = $("#btTable tbody").find("tr[data-val="+bpToDeleteFromArray+"]");
  tempBpRowToDelete.css("background-color", rowBPbgColorOnDelete);
  tempBpRowToDelete.find('input[type="text"][name="bpNameVal"]').css("background-color", rowBPbgColorOnDelete);
    setTimeout(function(){
      var confirmDeleteBreakPoint = confirm("Are you sure you want to delete '"+tempBpName+"' breakpoint that start at "+tempBpStart+"px ?");
      if (confirmDeleteBreakPoint == true) {
        deleteBpFromArray(bpToDeleteFromArray);
      }else{
        tempBpRowToDelete.css("background-color", rowBPbgColor);
        tempBpRowToDelete.find('input[type="text"][name="bpNameVal"]').css("background-color", rowBPbgColor);
      }},
    100);
}

function deleteBpFromArray(bpToDeleteFromArray){
  finalBreakpoint.splice(bpToDeleteFromArray,1);
  setupSlider();
}

function setupSlider(){
sliderBreakPointsArray  = buildBreakPointsArrayForSlider();
destroy();

if(sliderBreakPointsArray.length>1){

  range = document.getElementById('range');
  range.style.height = '5px';
  range.style.margin = '0 auto 30px';
  noUiSlider.create(range, {
  	start: sliderBreakPointsArray, // 4 handles, starting at...
  	margin: 1, // Handles must be at least 300 apart
  	//limit: 1000, // ... but no more than 1000

  	connect: true, // Display a colored bar between the handles
  	direction: 'ltr', // Put '0' at the bottom of the slider
  	orientation: 'horizontal', // Orient the slider vertically
  	behaviour: 'hover', // Move handle on tap, bar is draggable
    format: wNumb({
      postfix: ' px',
      decimals: 0
    }),
  	tooltips: true,
  	range: {
  		'min': 0,
  		'max': getMax(sliderBreakPointsArray)
  	},
  	pips: { // Show a scale with the slider
  		mode: 'steps',
  		stepped: true,
  		density: 1,
      format: wNumb({
  			postfix: ' px',
        decimals: 0
  		})
  	}
  });



    var bpHandles = range.getElementsByClassName('noUi-origin');

    disableFirstAndLast();

    addIconsToBreakPointsHandles();

    range.noUiSlider.on('slide', function(values, handle ){
      var tempRowUpdated = $('#btTable tbody').find("tr[data-val='"+handle+"']");
      tempRowUpdated.css("background-color", rowBPbgColorOnSlide);
      tempRowUpdated.find('input[type="text"][name="bpNameVal"]').css("background-color", rowBPbgColorOnSlide);
      var tempTdUpdated  = tempRowUpdated.find("td[name='bpStart']");
      tempTdUpdated.html(values[handle].replace(' px',''));
    });

    range.noUiSlider.on('end', function(values, handle ){
      var tempRowUpdated= $('#btTable tbody').find("tr[data-val='"+handle+"']");
      tempRowUpdated.css("background-color", rowBPbgColor);
      tempRowUpdated.find('input[type="text"][name="bpNameVal"]').css("background-color", rowBPbgColor);
    });
    range.noUiSlider.on('set', function(evt){
      rebuiltBreakePointsArrayWithUpdatedBreakpoints();
    });

    }
    rebuiltBreakePointsArrayWithUpdatedBreakpoints();
    buildBreakPointsTable();
    mainBreakPointHandle();
}


function mainBreakPointHandle(){
  if(!$("input[name=isMain]:radio:checked").length){
    var tempNewMain = (parseInt(finalBreakpoint.length) - parseInt(1));
    $("#btTable tbody").find("tr[data-val='"+tempNewMain+"']").find("input[name=isMain]:radio").prop("checked", true);
    updateMainBreakPoint(tempNewMain);
  }
}
function rebuiltBreakePointsArrayWithUpdatedBreakpoints(){
    updatedBreakPointsArray = range.noUiSlider.get();
    $.each(finalBreakpoint, function (key, value) {
      value["bpStart"]  = parseInt(updatedBreakPointsArray[key]);
      value["bpStop"]   = parseInt(updatedBreakPointsArray[key+1])-1;
    });
}

function buildBreakPointsArrayForSlider(){
  finalBreakpoint.sort(function(a, b) {
      return parseFloat(a.bpStart) - parseFloat(b.bpStart);
  });
  var sliderArrayTemp = [];
    $.each(finalBreakpoint, function (key, value) {
      sliderArrayTemp.push(parseInt(value["bpStart"]))
    });
    return sliderArrayTemp;
};

function buildBreakPointsTable(){
  $('#btTable tbody').empty();
               $.each(finalBreakpoint, function (key, value) {
                   var bpTrTemplate_updated = bpTrTemplate;
                   bpTrTemplate_updated = bpTrTemplate_updated.replace("placeHolder_data-val", key);
                   $.each(value, function (key, value) {
                           bpTrTemplate_updated = bpTrTemplate_updated.replace("placeHolder_" + key, value);
                   });
                   if(key===0){
                        bpTrTemplate_updated = bpTrTemplate_updated.replace('<td class="bpDeleteRow">'+labels["delete"]+'</td>', '');
                      bpTrTemplate_updated = bpTrTemplate_updated.replace('<td class="bpEditRow">'+labels["edit"]+'</td>', '<td class="bpEditRow" colspan="2">'+labels["edit"]+'</td>');
                   }
                   $('#btTable tbody').append(bpTrTemplate_updated);
               });

}

function addIconsToBreakPointsHandles(){
 var tempAllHandlesArray = $(".noUi-handle");
    $.each(tempAllHandlesArray, function (index, div) {
        $(this).find(".noUi-tooltip").before("<div class='noUi-custom-icon' style='background-image: url(custom/icons/"+finalBreakpoint[index]['imgIcon']+")'></div>")
    });

}


function disableFirstAndLast(){
  var origins = range.getElementsByClassName('noUi-origin');
  origins[0].setAttribute('disabled', true);
  origins[(origins.length-1)].setAttribute('disabled', true);
}

function consoleBreakPoints(){
  console.log("==================START=============================");
  console.table(finalBreakpoint);
  console.log("==================END=============================");
}
