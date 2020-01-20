import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var state={
    test1: '',
    onRoutes1: ''
}
var mutations={
    changeSlider: function(state, payload) {
        state.onRoutes1 = payload;
    },
    test: function(state, payload) {
        state.test1 = payload;
    }
}
var VUEX = new Vuex.Store({
    state: state,
    mutations: mutations
});

export default VUEX;
