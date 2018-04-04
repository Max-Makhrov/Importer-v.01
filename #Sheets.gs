/*
  Creates sheet if it does not exist
  Returns sheet object
 
  * ss           SpreadSheet                 default: current sheet
  * name         Name of sheet
*/
function createSheetIfNotExists(ss, name) { 
  var ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  
  try {ss.setActiveSheet(ss.getSheetByName(name));}
    catch (e) {ss.insertSheet(name);} 
  
  var sheet = ss.getSheetByName(name);
  return sheet;
}

function getThisSheetId()
{
  return SpreadsheetApp.getActive().getId();
}