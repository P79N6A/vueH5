const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
    baseUrl: isPro ? 'http://192.168.2.2/gaoyuan/HMS' : 'api/'
}