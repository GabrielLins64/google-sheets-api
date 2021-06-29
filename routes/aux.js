exports.parseDates = (dates) => {
  let strDates = [];

  dates.forEach(date => {
    let day = new Date(date.day)
    let strDate = day.getUTCDate().toString() + '/';
    let month = day.getUTCMonth() + 1;
    strDate += month.toString() + '/';
    strDate += day.getFullYear() + ' - ' + date.hour.toString() + ':00';
    strDates.push(strDate);
  });

  return strDates;
}