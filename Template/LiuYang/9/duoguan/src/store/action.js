export default{
    changeOpenid({commit, state}, openid){
        commit('CHANGE_OPENID', openid)
    },
    changeActivityId({commit, state}, activityid){
        commit('CHANGE_ACTIVITYID', activityid)
    },
    changeCouponCode({ commit, state}, couponcode){
        commit('CHANGE_COUPON_CODE', couponcode)
    },
    changeShowRules({ commit, state }, status) {
        commit('CHANGE_SHOW_RULES', status)
    }
}