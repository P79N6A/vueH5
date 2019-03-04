import {
    CHANGE_OPENID,
    CHANGE_ACTIVITYID,
    CHANGE_COUPON_CODE,
    CHANGE_SHOW_RULES
} from './mutation-types'
export default {
    CHANGE_OPENID(state, openid){
        state.openid = openid
    },
    CHANGE_ACTIVITYID(state, activityid){
        state.activity_id = activityid
    },
    CHANGE_COUPON_CODE(state, coupon_code){
        state.coupon_code = coupon_code
    },
    CHANGE_SHOW_RULES(state, status){
        state.has_show_rules = status
    }
}