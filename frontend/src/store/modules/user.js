import { getKey } from '@/apis/login'
import { getUserRole } from '@/apis/user'

import Storage from '@/utils/storage'

export default {
    namespaced: true,
    state: {
        key: null,
        token: null,
        userInfo: null,
        userRole: null
    },
    getters: {
        getKey: state => state.key || Storage.get('_uak_', null),
        getToken: state => state.token || Storage.get('_uat_', null),
        getUserInfo: state => state.userInfo || Storage.get('_user_info_', null),
        getUserRole: state => state.userRole || Storage.get('_user_role_', null)
    },
    mutations: {
        _set_key_(state, key) {
            state.key = key
            Storage.set('_uak_', key)
        },
        _set_token_(state, token) {
            state.token = token
            Storage.set('_uat_', token)
        },
        _set_user_info_(state, info) {
            state.userInfo = info
            Storage.set('_user_info_', info)
        },
        _set_user_role_(state, role) {
            state.userRole = role
            Storage.set('_user_role_', role)
        }
    },
    actions: {
        async loadKey({ dispatch }) {
            const { data } = await getKey()
            dispatch('setKey', data.pubKey)
        },
        setKey({ commit }, key) {
            commit('_set_key_', key)
        },
        setToken({ commit }, token) {
            commit('_set_token_', token)
        },
        setUserInfo({ dispatch, commit }, info) {
            dispatch('setUserRole', info.rid)
            commit('_set_user_info_', info)
        },
        setUserRole({ commit }, rid) {
            getUserRole(rid)
                .then(({ data }) => {
                    commit('_set_user_role_', data.name)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
}