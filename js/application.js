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
    
    // getting the report title that the user enter in the config window
    var report_title = tableau.extensions.settings.get("report_title");
    // adding report tilte
    $("#title").html(report_title);
    console.log(report_title);
    // getting the report height that the user enter in the config window
    var report_height = tableau.extensions.settings.get("report_height");
    // getting the worksheet name that the user choose from the config window
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

      //console.log(worksheetcolumns);
      // get the columns names
      for (var m=0; m<worksheetcolumns.length; m++){
        columnsNames.push(worksheetcolumns[m].fieldName);
      }

      //console.log(summdata);
      for (var i=0; i<worksheetData.length; i++) {
        var temp = {};
        for (var j=0; j<columnsNames.length; j++){
          //test_data.push({category: worksheetData[i][j].formattedValue}); 
          temp[columnsNames[j]] = worksheetData[i][j].formattedValue;
        }
        test_data.push(temp);
      }
      //console.log(test_data);
      // preparing the columns to be injected in the tabulator constractor
      var columnsDef = []
      for (var key in test_data[0]){
          console.log(key);
          var element = {title: key, field: key , headerDblClick:function(e, column){column.updateDefinition({editableTitle:true});}};
          columnsDef.push(element);
      };
      //create Tabulator on DOM element with id "example-table"
      var table = new Tabulator("#example-table", {
      height: report_height, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      data:test_data, //assign data to table
      columns: columnsDef,
      //layout:"fitColumns", //fit columns to width of table (optional)
      //autoColumns: true,
      resizableColumns: true, // this option takes a boolean value (default = true)
      movableColumns: true, //Allow users to move and reorder columns 
      movableRows: true, //Allow users to move and reorder rows.
      headerSort: true, //Enable or disable header sorting on all columns. (default = true)
      //persistentLayout: false, //Enable persistsnt storage of column layout information (default = false)
      pagination:"local",
      paginationSizeSelector:true, // you can set it to ture instead if you want to auto select the list elements
      // using callback to handle styling on the table
      renderComplete:function(){
        var header_color = tableau.extensions.settings.get("header_color");
        var header_font_color = tableau.extensions.settings.get("header_font_color");
        var even_color = tableau.extensions.settings.get("even_color");
        var even_font_color = tableau.extensions.settings.get("even_font_color");
        var odd_color = tableau.extensions.settings.get("odd_color");
        var odd_font_color = tableau.extensions.settings.get("odd_font_color");
        
        // change the background color of the header
        var x = document.getElementsByClassName("tabulator-col");
        var i;
        for (i = 0; i < x.length; i++) {
          x[i].style.backgroundColor = header_color;
          x[i].style.color = header_font_color;
        };
        // chaning the background color of the even rows
        var x = document.getElementsByClassName("tabulator-row-even");
        var i;
        for (i = 0; i < x.length; i++) {
          x[i].style.backgroundColor = even_color;
          x[i].style.color = even_font_color;
        };
        // changing the background color of odd rows
        var x = document.getElementsByClassName("tabulator-row-odd");
        var i;
        for (i = 0; i < x.length; i++) {
          x[i].style.backgroundColor = odd_color;
          x[i].style.color = odd_font_color;
        };
      },
    });

      //trigger download of data.csv file
      document.getElementById("download-csv").addEventListener("click", function(){
        table.download("csv", "data.csv");
      });

      //trigger download of data.xlsx file
      document.getElementById("download-xlsx").addEventListener("click", function(){
        table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
      });

      //trigger download of data.pdf file
      document.getElementById("download-pdf").addEventListener("click", function(){
        table.download("pdf", "data.pdf", {
            orientation:"portrait", //set page orientation to portrait
            title:"Example Report", //add title to report
        });
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