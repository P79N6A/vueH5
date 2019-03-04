// 需要jquery支持

const getConfig = (callBack, obj) => {
    obj.$axios.get('static/data.json').then(result => {
        callBack(result.data)
    })
};
export { getConfig }
