'use strict';
 
(function () {
  $(document).ready(function () {
   // initialize the extension
    tableau.extensions.initializeAsync({ 'configure':configure }).then(function () {
      drawChartJS();
      // add event listener to change the chart if any of the settings chagned
      var unregisterSettingsEventListener = tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
        drawChartJS();
        console.log('2');
      });
    }, function () { console.log('Error while Initializing: ' + err.toString()); });
  });
 
  function drawChartJS() {
    console.log('1');
    // getting the report title that the user enter in the config window
    var report_title = tableau.extensions.settings.get("report_title");
    // adding report tilte
    $("#title").html(report_title);
    // getting the report height that the user enter in the config window
    var report_height = tableau.extensions.settings.get("report_height");
    // getting the worksheet name that the user choose from the config window
    var worksheetName = tableau.extensions.settings.get("worksheet");
    // getting new columns names from the settings
    var columnsVisiable = tableau.extensions.settings.get("columnsVisiable").split(',');
    var columnsNewNames = tableau.extensions.settings.get("columnsNewNames").split(',');
    //var columnsNames = tableau.extensions.settings.get("columnsNames").split(',');
    
    const worksheets=tableau.extensions.dashboardContent.dashboard.worksheets;
    var worksheet=worksheets.find(function (sheet) {
      return sheet.name===worksheetName;
    });
    worksheet.getSummaryDataAsync().then(function (summdata) {

      var test_data = [];
      var worksheetData = summdata.data;
      var worksheetcolumns = summdata.columns;
      var columnsNames = [];

      // get the columns names
      for (var m=0; m<worksheetcolumns.length; m++){
        columnsNames.push(worksheetcolumns[m].fieldName);
      }

      for (var i=0; i<worksheetData.length; i++) {
        var temp = {};
        for (var j=0; j<columnsNames.length; j++){
          temp[columnsNames[j]] = worksheetData[i][j].formattedValue;
        }
        test_data.push(temp);
      }
      // preparing the columns to be injected in the tabulator constractor
      var columnsDef = [];
      var element;
      for (var i=0; i<columnsNewNames.length; i++) {
        element = {title: columnsNewNames[i], field: columnsNames[i] , 
                       visible: columnsVisiable[i]=='true',
                      };
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
      //movableRows: true, //Allow users to move and reorder rows.
      headerSort: true, //Enable or disable header sorting on all columns. (default = true)
      //persistentLayout: false, //Enable persistsnt storage of column layout information (default = false)
      //persistence:{columns: ["visible", "title"]},
      pagination:"local",
      //paginationSizeSelector:true, // you can set it to ture instead if you want to auto select the list elements
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
      $('#download-csv').click(function() {
        table.download("csv", "data.csv");
        console.log(typeof(table));
      });

      //trigger download of data.xlsx file
      $('#download-xlsx').click(function() {
        table.download("xlsx", "data.xlsx", {sheetName:report_title});
      });

      //trigger download of data.pdf file
      $('#download-pdf').click(function() {
        table.download("pdf", "data.pdf", {
                orientation:"landscape", //set page orientation to portrait
                title:report_title, //add title to report
        });
      });
      console.log(table);
      console.log(typeof(table));
      console.log(table.length)
    });
  };


 
  function configure() {
    const popupUrl=`${window.location.href}/dialog.html`;
    let defaultPayload="";
    tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:600, width:600 }).then((closePayload) => {
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