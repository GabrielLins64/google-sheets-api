const { google } = require('googleapis');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const aux = require('./aux.js');

const credentials = require('../credentials/menteor-back.json');
const spreadsheetId = process.env.SPREADSHEETID;
const tabName = "Pedidos1";
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials/menteor-back.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets"
});

exports.getSheet = async (req, res) => {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: tabName
  })

  res.status(200).send(getRows.data);
};

exports.getSheetCols = async (req, res) => {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  let colA = req.params.colA;
  let colB = req.params.colB;

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: tabName + colA + ':' + colB
  })

  res.status(200).send(getRows.data);
};

exports.getRow = async (req, res) => {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await promisify(doc.useServiceAccountAuth)(credentials);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];

  var rows = await promisify(sheet.getRows)({
    query: 'id = ' + req.params.id
  });

  var order = rows[0];
  delete order._xml;
  delete order._links;
  delete order['app:edited'];

  res.status(200).send(order);
}

exports.updateStatus = async (req, res) => {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await promisify(doc.useServiceAccountAuth)(credentials);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];

  var rows = await promisify(sheet.getRows)({
    query: 'id = ' + req.params.id
  });

  rows.forEach(row => {
    row.status = req.body.status;
    row.save();
  });

  res.status(200).send("UPDATED");
}

exports.writeRow = async (req, res) => {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  var order = req.body;

  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: tabName,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            order.id,
            order.menteeName,
            order.menteeSurname,
            order.menteeEmail,
            order.menteePhone,
            order.menteeRcvMarketing,
            order.mentor,
            order.menteeAmount,
            order.total,
            JSON.stringify(aux.parseDates(order.mentoringDates)),
            order.status
          ]
        ]
      }
    });

    res.status(200).send("CREATED");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};