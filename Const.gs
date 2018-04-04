var C_RANGE_EVAL = 'eval';



// Declare
var STR_DELIMEER1 // delim1
var STR_DELIMEER2 // delim2
var STR_IDS // files ids
var STR_SHEETS // sheet names
var STR_RANGES // first data rows
var STR_IDS_TO // files ids to
var STR_SHEET_TARGET // sheet where to
var STR_RANGE_TARGET // Start import from cell
var STR_SQL_TEXTS // SQL texts

// get settings from named range
function getSettings()
{
  var range = SpreadsheetApp.getActive().getRangeByName(C_RANGE_EVAL);
  
  /*
    sample data for this script looks like this:    
    [
      ";",
      "~",
      "1LC6QmhBU-0OhUWo7R_eKPjuSCkmdpl6tRHPu83Co3Hk;1389-68_t6yFVQb72P8YhBPaTEnyE7sxJ7Imd9tPNF08;14L2QMZBtwzWDz-IkALq9-EUjdjvKDPdJJ9EyodSidRs",
      "Sales Central;Sales West;Sales East",
      "A2:G2;A2:G2;A2:G2",
      "Sales Total;Sales Total;Sales Total",
      "A2"
    ]
    Note:
    The data is collected from a cell of named range called "eval"
  */
  
  var value = range.getValue();
  var data = JSON.parse(value);
  
  // Assign
  STR_DELIMEER1 = data[0];
  STR_DELIMEER2 = data[1];
  STR_IDS = data[2];
  STR_SHEETS = data[3];
  STR_RANGES = data[4];
  STR_IDS_TO = data[5];
  STR_SHEET_TARGET = data[6];
  STR_RANGE_TARGET = data[7];
  STR_SQL_TEXTS = data[8];
}