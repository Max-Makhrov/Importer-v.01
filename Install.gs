var C_idFileFrom = '1hD4eRl58l-mFiL03GrZ9vaREntGlv6PC9Ly_CGAYJ3Y'; // sample file for copy
var C_sheetNames = ['Ini', 'Settings'];

function installImporter()
{
  var file = SpreadsheetApp.getActive();
  var idFileTo = file.getId();
  
  var sheetNames = C_sheetNames;
  
  // exit if sheets with same name exist
  var sheets = file.getSheets();
  
  sheets.forEach(function(sht) 
  { 
    if (sheetNames.indexOf( sht.getName() ) > -1)
    {
      throw 'Error. Sheet ' + sht.getName() + ' already exists.';
      return -1;    
    }
  });
  
  var idFileFrom = C_idFileFrom
  copySheets_(idFileFrom, idFileTo, sheetNames);
  
  return 0;
  
}
