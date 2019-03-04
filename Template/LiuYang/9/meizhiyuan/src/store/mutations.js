import {
    CHANGE_OPENID,
    CHANGE_ACTIVITYID
} from './mutation-types'
export default {
    CHANGE_OPENID(state, openid){
        state.openId = openid
    },
    CHANGE_ACTIVITYID(state, activityid){
        state.activityId = activityid
    }
}