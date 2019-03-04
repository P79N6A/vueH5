const getConfig = (callBack) => {
  $.ajax({
    url: './static/data/config.json',
    dataType: "json",
    success: (date) => {
      callBack(date);
    }
  })
};
export {getConfig}
