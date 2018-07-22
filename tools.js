const processStatus = [
    { id: 'A', name: '未処理'},
    { id: 'B', name: '処理中'},
    { id: 'C', name: '完了'},
  ];
  
exports.getProcessStatusId = function(status) {
  const row = processStatus.find(function(elem) {
    return elem.name == status;
  });
  
  if (row) {
    return row.id;
  }
  return null;
};

exports.getProcessStatus = function(statusId) {
  const row = processStatus.find(function(elem) {
    return elem.id == statusId;
  });

  if (row) {
    return row.name;
  }
  return null;
};  

exports.parseJsonDate = function(jsonDate) {
    var offset = new Date().getTimezoneOffset();
    var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate);
  
    if (parts[2] == undefined)
        parts[2] = 0;
  
    if (parts[3] == undefined)
        parts[3] = 0;
  
    var date = new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
    var localDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ` +
      `${date.getHours()}時${date.getMinutes()}分`;    
    return localDate;
  };
