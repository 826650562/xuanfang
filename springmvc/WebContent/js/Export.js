/**
 * 
 */
function toExcel(FileName, JSONData, ShowLabel) {  
    //先转化json  
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;            
    var excel = '<table>';      
      
    //设置表头  
    var row = "<tr align='canter'>";//设置Excel的左居中
    for (var i = 0, l = ShowLabel.length; i < l; i++) {  
        for (var key in ShowLabel[i]) {
            row += "<td>" + ShowLabel[i][key] + '</td>';  
        }
    }                      
    //换行  
    excel += row + "</tr>";  
      
    //设置数据  
    for (var i = 0; i < arrData.length; i++) {  
        var rowData = "<tr align='center'>"; 

        for (var y = 0; y < ShowLabel.length; y++) {
            for(var k in ShowLabel[y]){
                if (ShowLabel[y].hasOwnProperty(k)) {
                     rowData += "<td style='vnd.ms-excel.numberformat:@'>" + (arrData[i][k]===null? "" : arrData[i][k]) + "</td>";
　　　　　　　　　　　　　　　　　 //vnd.ms-excel.numberformat:@ 输出为文本
                }
            }
        }

        excel += rowData + "</tr>";  
            }  
  
            excel += "</table>";  
  
        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';  
    excelFile += '; charset=UTF-8">';  
    excelFile += "<head>";  
    excelFile += "<!--[if gte mso 9]>";  
    excelFile += "<xml>";  
    excelFile += "<x:ExcelWorkbook>";  
    excelFile += "<x:ExcelWorksheets>";  
    excelFile += "<x:ExcelWorksheet>";  
    excelFile += "<x:Name>";  
    excelFile += "{worksheet}";  
    excelFile += "</x:Name>";  
    excelFile += "<x:WorksheetOptions>";  
    excelFile += "<x:DisplayGridlines/>";  
    excelFile += "</x:WorksheetOptions>";  
    excelFile += "</x:ExcelWorksheet>";  
    excelFile += "</x:ExcelWorksheets>";  
    excelFile += "</x:ExcelWorkbook>";  
    excelFile += "</xml>";  
    excelFile += "<![endif]-->";  
    excelFile += "</head>";  
    excelFile += "<body>";  
    excelFile += excel;  
    excelFile += "</body>";  
    excelFile += "</html>";  
  
              
        var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);  
      
    var link = document.createElement("a");      
    link.href = uri;  
      
    link.style = "visibility:hidden";  
    link.download = FileName + ".xls";  
      
    document.body.appendChild(link);  
    link.click();  
    document.body.removeChild(link);  
}