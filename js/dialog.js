'use strict';
 
(function () {
 
    $(document).ready(function () {
        tableau.extensions.initializeDialogAsync().then(function (openPayload) {
            buildDialog();
        });
    });
 
    function buildDialog() {
        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.forEach(function (worksheet) {
            $("#selectWorksheet").append("<option value='" + worksheet.name + "'>" + worksheet.name + "</option>");
        });
        var worksheetName = tableau.extensions.settings.get("worksheet");
        var header_color = tableau.extensions.settings.get("header_color");
        var header_font_color = tableau.extensions.settings.get("header_font_color");
        var even_color = tableau.extensions.settings.get("even_color");
        var even_font_color = tableau.extensions.settings.get("even_font_color");
        var odd_color = tableau.extensions.settings.get("odd_color");
        var odd_font_color = tableau.extensions.settings.get("odd_font_color");
        var report_title = tableau.extensions.settings.get("report_title");
        var report_height = tableau.extensions.settings.get("report_height");
        //var checkbox = tableau.extensions.settings.get("checkbox");

        if (worksheetName != undefined) {
            // if the worksheet name already exit save it the config page
            $("#selectWorksheet").val(worksheetName);
            $("#header-color").val(header_color);
            $("#header-font-color").val(header_font_color);
            $("#even-color").val(even_color);
            $("#even-font-color").val(even_font_color);
            $("#odd-color").val(odd_color);
            $("#odd-font-color").val(odd_font_color);
            $("#report-title").val(report_title);
            $("#report-height").val(report_height);
            columnsUpdate();
             
        }
 
        $('#selectWorksheet').on('change', '', function (e) {
            columnsUpdate();
        });
        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);
    }
 
    function columnsUpdate() {
        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#selectWorksheet").val();
        
        var worksheet = worksheets.find(function (sheet) {
            return sheet.name === worksheetName;
        });

        worksheet.getSummaryDataAsync().then(function (summdata) {

            var worksheetcolumns = summdata.columns;
            //var columnsNames = []
            for (var m=0; m<worksheetcolumns.length; m++){
                $("#columns").append("<tr class='select-item'><td><span>" + worksheetcolumns[m].fieldName + "&nbsp;</span></td>"+
                     "<td><input class = 'input-text' type='text' value =" + worksheetcolumns[m].fieldName + ">&nbsp;</td>"+
                     "<td><input class='input-checkbox' type='checkbox' checked></td></tr>");
                //columnsNames.push(worksheetcolumns[m].fieldName);
            };
            columnsNameUpdate(); 
            //tableau.extensions.settings.set("columnsNames", columnsNames.toString()); 
          });
            
    }
    function columnsNameUpdate(){
        var worksheetName = tableau.extensions.settings.get("worksheet");
        // using the split method to convert the string back to array
        var columnsVisiable = tableau.extensions.settings.get("columnsVisiable").split(',');
        var columnsNewNames = tableau.extensions.settings.get("columnsNewNames").split(',');
        var i = 0;
        if (worksheetName != undefined) {
            $("tr.select-item").each(function() {
                $(this).find("input.input-text").val(columnsNewNames[i]);
                // I used this form (checkbox == 'true') to convert the checkbox variable from string to boolean
                $(this).find("input.input-checkbox").prop('checked', columnsVisiable[i] == 'true');
                i = i + 1; 
            });
        }
    }
 
    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }
 
    function saveButton() {
        // saving the selected sheet name to the settings
        tableau.extensions.settings.set("worksheet", $("#selectWorksheet").val());
        // saving the header color value to the settings
        tableau.extensions.settings.set("header_color", $("#header-color").val());
        // saving the header font color value to the settings
        tableau.extensions.settings.set("header_font_color", $("#header-font-color").val());
        // saving the even rows color
        tableau.extensions.settings.set("even_color", $("#even-color").val());
        // saving the even font rows color
        tableau.extensions.settings.set("even_font_color", $("#even-font-color").val());
        // saving the odd rows color
        tableau.extensions.settings.set("odd_color", $("#odd-color").val());
        // saving the odd font rows color
        tableau.extensions.settings.set("odd_font_color", $("#odd-font-color").val());
        // saving report title
        tableau.extensions.settings.set("report_title", $("#report-title").val());
        // saving report height
        tableau.extensions.settings.set("report_height", $("#report-height").val());
        // saving the user choices in the columns names section in the configuration
        var columnsNewNames = [];
        var columnsVisiable = [];
        $("tr.select-item").each(function() {
            columnsNewNames.push($(this).find("input.input-text").val());
            // == 'true' is used here to change the datatype from string to boolean
            columnsVisiable.push($(this).find("input.input-checkbox").is(":checked"));
        });
        // using toString method to convert the array to string before saving it because set method accept only string values not array
        tableau.extensions.settings.set("columnsNewNames", columnsNewNames.toString());
        tableau.extensions.settings.set("columnsVisiable", columnsVisiable.toString());

        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();