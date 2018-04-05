function onOpen()
{
  createManu_();
}

function createManu_()
{
  var ui = SpreadsheetApp.getUi();
  // Add a custom menu to the spreadsheet.
  ui 
      .createMenu('Admin')
      .addItem('Update', 'writeDataFromSheets')
      .addSubMenu(ui.createMenu('Install')
          .addItem('Install Settings Sheets', 'installImporter')
          .addItem('Set 1 Hour Trigger', 'triggerWriteDataFromSheets')                          
          )
      .addSeparator()
      .addItem('Delete extra cells', 'deleteEmptyCells')  
      .addToUi()

}
