var _import = require('../../src/router/_import_' + process.env.NODE_ENV);
var globalData = {
    '$_flowerRouter': sessionStorage.getItem('USER_FLOWROUTER')? JSON.parse(sessionStorage.getItem('USER_FLOWROUTER')): [],
    '$_menuShowList': [],
    '$_userToken': sessionStorage.getItem('USER_TOKEN'),
    '$_userInfo': sessionStorage.getItem('USER_INFO')? JSON.parse(sessionStorage.getItem('USER_INFO')): '',
    '$_filterAsyncRouter' :function (asyncRouterMap) {
        var accessedRouters = asyncRouterMap.filter(function (route) {
            if (route.component) {
                if (route.component === 'Layout') {
                    route.component = Layout
                } else {
                    route.component = _import(route.component)
                }
            }
            if (route.children && route.children.length) {
                route.children = globalData.$_filterAsyncRouter(route.children)
            }
            return true
        })
        return accessedRouters
    }
}
export default globalData;
