import Vue from 'vue';
import globalData from './globaldata';
var menuShowList = sessionStorage.getItem('USER_LEFTMENU');
if(menuShowList) {
  globalData.$_menuShowList = JSON.parse(menuShowList);
}
Vue.prototype.$_hasMenu = function(req) {
  for(var i =0; i< globalData.$_menuShowList.length; i++) {
    if(globalData.$_menuShowList[i].local_index == req) {
      return true;
    }
  }
  // for (let a of globalData.$_menuShowList) {
  //   if(a.local_index == req) {
  //     return true;
  //   }
  // }
  return false;
};
Vue.directive('hasTabMenu',{
  bind: function(ele,binding) {
    if(!Vue.prototype.$_hasMenu(binding.expression)) {
      setTimeout(function() {
        let a = ele.getAttribute('aria-labelledby');
        document.getElementById(a).parentNode.removeChild(document.getElementById(a));
        ele.parentNode.removeChild(ele);
      }, 50)
    }
  }
})
Vue.directive('hasMenu',{
  bind: function(ele,binding) {
    if(!Vue.prototype.$_hasMenu(binding.expression)) {
      setTimeout(function() {
        ele.parentNode.removeChild(ele);
      }, 50)
    }
  }
})
export default Vue;