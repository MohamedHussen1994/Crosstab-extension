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
        //$("#SelectChartType").val(tableau.extensions.settings.get("ChartType"));
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
        $('.select').select2();
    }
 
    function columnsUpdate() {

        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#selectWorksheet").val();
        
        var worksheet = worksheets.find(function (sheet) {
            return sheet.name === worksheetName;
        });      
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
        tableau.extensions.settings.set("report_height", $("#report-height").val())
        
        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();