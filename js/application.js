'use strict';
 
(function () {
  $(document).ready(function () {
   // initialize the extension
    tableau.extensions.initializeAsync({ 'configure':configure }).then(function () {
      drawChartJS();
      // add event listener to change the chart if any of the settings chagned
      unregisterSettingsEventListener = tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
        drawChartJS();
      });
    }, function () { console.log('Error while Initializing: ' + err.toString()); });
  });
 
  function drawChartJS() {
 
    var worksheetName = tableau.extensions.settings.get("worksheet");
 
    const worksheets=tableau.extensions.dashboardContent.dashboard.worksheets;
    var worksheet=worksheets.find(function (sheet) {
      return sheet.name===worksheetName;
    });
    worksheet.getUnderlyingDataAsync().then(function (fulldata) {

      var test_data = [];
      var worksheetData = fulldata.data;
      for (var i=0; i<worksheetData.length; i++) {
        test_data.push({category: worksheetData[i][0].formattedValue,
                        value: worksheetData[i][1].formattedValue
                      });
      }
      console.log(worksheetData);

      //create Tabulator on DOM element with id "example-table"
      var table = new Tabulator("#example-table", {
      height:300, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      data:test_data, //assign data to table
      //layout:"fitColumns", //fit columns to width of table (optional)
      resizableColumns:false, // this option takes a boolean value (default = true)
      columns:[ //Define Table Columns
          {title:"region", field:"category", frozen:true},
          {title:"sales", field:"value"},
      ]
    });
 
      
    });
  }
 
  function configure() {
    const popupUrl=`${window.location.href}/dialog.html`;
    let defaultPayload="";
    tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:400, width:430 }).then((closePayload) => {
      drawChartJS();
    }).catch((error) => {
      switch (error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log("Dialog was closed by user");
          break;
        default:
          console.error(error.message);
      }
    });
  }
})();