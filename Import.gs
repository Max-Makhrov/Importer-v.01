var C_SPLIT_FORID = '=';
function writeDataFromSheets()
{
  var start = new Date(); // timer start
  
  getSettings();
  
  var sheetNamesTo = STR_SHEET_TARGET.split(STR_DELIMEER1);
  var allFileIds = STR_IDS.split(STR_DELIMEER1);
  var allFileToIds = STR_IDS_TO.split(STR_DELIMEER1);
  var allSheetNames = STR_SHEETS.split(STR_DELIMEER1);
  var allRangeNames = STR_RANGES.split(STR_DELIMEER1);
  var allSqlTexts = STR_SQL_TEXTS.split(STR_DELIMEER1);

  // get tasks
  var tasks = {}; 
  var sources = {};
  var source = {};
  var task = {};
  
  var allTaskIds = allFileToIds.map(function(elt, index) { return elt + '#' + sheetNamesTo[index]; } );

  allTaskIds.forEach(
  function(elt, i)
  {
    // get tasks objects
    if (!(elt in tasks)) 
    { 
      tasks[elt] = {}; 
      task = tasks[elt];
      task.fileIds = [allFileIds[i]];
      task.sheetNames = [allSheetNames[i]];
      task.rangeNames = [allRangeNames[i]];
      task.sqlTexts = [allSqlTexts[i]]
    }
    else
    {
      task = tasks[elt];
      task.fileIds.push(allFileIds[i]);
      task.sheetNames.push(allSheetNames[i]);
      task.rangeNames.push(allRangeNames[i]);  
      task.sqlTexts.push(allSqlTexts[i])
    } 
    
    // get sources object    
    var sourceId = allFileIds[i] + C_SPLIT_FORID + allSheetNames[i];
    if (!(sourceId in sources)) 
    { 
      sources[sourceId] = {}; 
      source = sources[sourceId];
      source.fileId = allFileIds[i];
      source.sheetName = allSheetNames[i];
      source.tasksToDo = 1;
      source.data = [];
    }
    else
    {
      source = sources[sourceId];
      source.tasksToDo++;
    }    
  }
  );

 
 // do tasks
 for (var key in tasks) {
 
  task = tasks[key];
  var fileIds = task.fileIds;
  var sheetNames = task.sheetNames;
  var rangeNames = task.rangeNames;
  var sqlTexts = task.sqlTexts;
  var data = getDataFromSheets_(fileIds, sheetNames, rangeNames, sqlTexts, sources);
  if (data.length > 0) 
  {
   // write the result into sheet
    var pairFileSheet = key.split('#'); 
    var file = SpreadsheetApp.openById(pairFileSheet[0]);
    var sheet = createSheetIfNotExists(file, pairFileSheet[1]);
    var range = sheet.getRange(STR_RANGE_TARGET);
    // sheet.clearContents(); // clear old values
    writeDataIntoSheet_(file, sheet, data, range.getRow(), range.getColumn());
  }
 }
 
 Logger.log(new Date() - start); // timer end

}


function getDataFromSheets_(fileIds, sheetNames, rangeNames, sqlTexts, sources)
{  
  // get arrays
  var arrays = [];
  var array = [];
  
  for (var i = 0, l = fileIds.length; i < l; i++)
  {
    array = getDataFromSheet_(fileIds[i], sheetNames[i], rangeNames[i], sqlTexts[i], sources);
    if('null' != array && typeof array !== 'undefined' && array != null)  { arrays.push(array); }     
  }
  return combine2DArrays_(arrays);
}



function getDataFromSheet_(fileId, sheetName, rangeName, sqlText, sources)
{
  var file = SpreadsheetApp.openById(fileId);
  var sheet = file.getSheetByName(sheetName);
  var r1 = sheet.getRange(rangeName);
  var row1 = r1.getRow();
  var col1 = r1.getColumn();
  var col2 = r1.getLastColumn();
  
  var row2 = sheet.getLastRow(); // last row from sheet
  
  if (row2 < row1) return null;
  
  var range = sheet.getRange(row1, col1, row2-row1+1, col2-col1+1);


  // get / remember / delete
  
  /*
  {  
    sources =
     1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ#East=   {  
        sheetName=East,
        data=      [  
  
        ],
        tasksToDo=1.0,
        fileId=1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ
     },
     1tXYqYT39zn0BM-d7QzkkBm2hKBob5Fj3NC5K66Rsvjk#Data=   {  
        sheetName=Data,
        data=      [  
  
        ],
        tasksToDo=4.0,
        fileId=1tXYqYT39zn0BM-d7QzkkBm2hKBob5Fj3NC5K66Rsvjk
     },
     1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ#West=   {  
        sheetName=West,
        data=      [  
  
        ],
        tasksToDo=1.0,
        fileId=1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ
     }
  } 
  */
  
  var data = [];
  var sourceKey = fileId + C_SPLIT_FORID + sheetName;
  var source = sources[sourceKey];

  if (source.data.length === 0)
  {
    data = range.getValues();
  }
  else
  {
    data = source.data;
  }
  var tasksLeft = source.tasksToDo;
  if (tasksLeft === 1)
  {
    source.data = []; // delete unnecessary data
  }
  else
  {
    source.data = data; // remember data
    source.tasksToDo--; // tasks to do minus 1 
  }
  sources[sourceKey] = source; // write back 
  
  // run SQL on the data
  return getAlaSqlResult_(data, sqlText);
}
 

// combine 2d arrays of different sizes
function combine2DArrays_(arrays)
{
  
  // check 2D-arryas are not empty
  if (arrays.length === 1 && arrays[0].length === 0) { return arrays[0]; }
  
  // detect max L
  var l = 0;
  var row = [];
  var result = [];
  var elt = '';
  arrays.forEach(function(arr) { l = Math.max(l, arr[0].length); } );
  arrays.forEach(function(arr) {
    for (var i = 0, h = arr.length; i < h; i++)
    {
      var row = arr[i];
      // fill with empty value
      for (var ii = row.length; ii < l; ii++) { row.push(''); }
      result.push(row);
    }
  }
  );  
  return result;
}


/*
    use getSheetsInfo(ids)
    
    write the report into sheet:
    
    input:
      * file                       SpreadSheet
      * strSheet                   'Sheet1'
      * data                       [['Name', 'Age'], ['Max', 28], ['Lu', 26]]
                              
  If strSheet doesn't exist → creates new sheet
                                    
*/
function writeDataIntoSheet_(file, sheet, data, rowStart, colStart) {
  file = file || SpreadsheetApp.getActiveSpreadsheet();
  
  // get sheet as object
  switch(typeof sheet) {
    case 'object':
        break;
    case 'string':
        sheet = createSheetIfNotExists(file, sheet);
        break;
    default:
        return 'sheet is invalid';
  }
  
  // get dimansions and get range
  rowStart = rowStart || 1;
  colStart = colStart || 1;   
  var numRows = data.length;
  var numCols = data[0].length; 
  var range = sheet.getRange(rowStart, colStart, numRows, numCols);
  
  // clear old data if rowStart or colStart are not defined
  if(!rowStart && !colStart) { sheet.clearContents(); }

  
  // set values
  range.setValues(data);
  
  // report success
  return 'Wtite data to sheet -- ok!';

}







function triggerWriteDataFromSheets()
{
  var nameFunction = 'writeDataFromSheets';
  setTriggerOnHour_(nameFunction)
}


function setTriggerOnHour_(nameFunction)
{
  if (checkTriggerExists_(nameFunction, 'SPREADSHEETS')) { return -1; } // trigger exists
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger(nameFunction)
      .timeBased()
      .everyHours(1)
      .create();

}


/*
  USAGE
  
  var exists = checkTriggerExists_('test_getSets', 'SPREADSHEETS')
*/
function checkTriggerExists_(nameFunction, triggerSourceType)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};

  
  for (var i = 0; i < triggers.length; i++) {
   trigger = triggers[i];
   if (trigger.getHandlerFunction() == nameFunction && trigger.getTriggerSource() == triggerSourceType) return true;
  }
  
  return false; 

}
