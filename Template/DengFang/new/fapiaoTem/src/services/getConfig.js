const getConfig = (callBack, obj) => {
  obj.$axios.get('static/config.json').then(result => {
    callBack(result.data)
  })
};
export { getConfig }
