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
    worksheet.getSummaryDataAsync().then(function (summdata) {

      var test_data = [];
      var worksheetData = summdata.data;
      var worksheetcolumns = summdata.columns;
      var columnsNames = [];

      console.log(worksheetcolumns);
      // get the columns names
      for (var m=0; m<worksheetcolumns.length; m++){
        columnsNames.push(worksheetcolumns[m].fieldName);
      }

      console.log(summdata);
      for (var i=0; i<worksheetData.length; i++) {
        var temp = {};
        for (var j=0; j<columnsNames.length; j++){
          //test_data.push({category: worksheetData[i][j].formattedValue}); 
          temp[columnsNames[j]] = worksheetData[i][j].formattedValue;
        }
        test_data.push(temp);
      }
      console.log(test_data);

      //create Tabulator on DOM element with id "example-table"
      var table = new Tabulator("#example-table", {
      height:300, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      data:test_data, //assign data to table
      //layout:"fitColumns", //fit columns to width of table (optional)
      resizableColumns:false, // this option takes a boolean value (default = true)
      autoColumns: true,
      //columns:[ //Define Table Columns
        //  {title:"region", field:"category", frozen:true},
        //  {title:"sales", field:"value"},
        //  {title:"sales2", field:"value2"},
        //  {title:"sales3", field:"value3"},
        //  {title:"sales4", field:"value4"},
        //  {title:"sales5", field:"value5"},
      //]
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