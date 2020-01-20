<template>
	<div id="secondOrderHistory">
		<ul class="tabUl">
			<li v-for="(item, index) in List" @click="handleChangeColor(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
		</ul>
		<div v-if="currentIndex==0">
			<v-totalTubeTistory></v-totalTubeTistory>
		</div>
		<div v-if="currentIndex==1">
			<v-periodicHistory></v-periodicHistory>
		</div>
		<div v-if="currentIndex==2">
			<v-totalTubeRoom></v-totalTubeRoom>
		</div>
		<div v-if="currentIndex==3">
			<v-periodicRoom></v-periodicRoom>
		</div>
	</div>
</template>
<script>
import totalTubeTistory from './secondOrderHistory/totalTubeTistory.vue'
import totalTubeRoom from './secondOrderHistory/totalTubeRoom.vue'
import periodicHistory from './secondOrderHistory/periodicHistory.vue'
import periodicRoom from './secondOrderHistory/periodicRoom.vue'
export default {
    data() {
        return{
            index: 0,
			activeName: '1',
			List: [{name: '时间性历史能耗'}, {name: '周期性历史能耗'}, {name: '历史能耗TOP项'}, {name: '历史周期能耗TOP项'}],
			currentIndex: 0
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        },
		handleChangeColor(ins) {
			this.currentIndex = ins;
		}
    },
    mounted() {

    },
    components: {
		'v-totalTubeTistory': totalTubeTistory,
		'v-totalTubeRoom': totalTubeRoom,
		'v-periodicHistory': periodicHistory,
		'v-periodicRoom': periodicRoom,

    },
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.index = 0
		}
	}
}
</script>
<style lang="scss" scoped>
#secondOrderHistory{
	.tabUl{
		overflow: hidden;
		padding-bottom: 20px;
		padding-top: 20px;
		li{
			float: left;
			margin: 0 20px;
			cursor: pointer;
			border: 1px solid #409eff;
			-webkit-border-radius: 3px;
			-moz-border-radius: 3px;
			border-radius: 3px;
			color: #409eff;
			font-size: 12px;
			padding: 6px 15px;
		}
		li.active{
			background: #409eff;
			color: #fff;
		}
	}
}
</style>
