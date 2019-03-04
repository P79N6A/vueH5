export default{
    changeOpenid({commit, state}, openid){
        commit('CHANGE_OPENID', openid)
    },
    changeActivityId({commit, state}, activityid){
        commit('CHANGE_ACTIVITYID', activityid)
    }
}