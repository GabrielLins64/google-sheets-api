module.exports = function (app) {
  var functions = require('./functions');

  app
      .route('/')
      .get(functions.getSheet)
      .post(functions.writeRow);
  
  app
      .route('/:colA/:colB')
      .get(functions.getSheetCols);
  
  app
      .route('/:id')
      .get(functions.getRowById)
      .patch(functions.updateStatus);
};