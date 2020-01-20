<template>
    <div id="heatSourceSystem">
		<div class="heatSourceSystem">
			<el-tabs type="border-card" @tab-click="tabclick" v-model="activeName">
				<el-tab-pane label="实时数据" v-hasTabMenu="3-2-1-1"> 
					<v-sourcerealdata v-if="this.index == 0"></v-sourcerealdata>
				</el-tab-pane>
				<el-tab-pane label="历史数据" v-hasTabMenu="3-2-1-2">
					<v-sourcehistorydata v-if="this.index == 1"></v-sourcehistorydata>
				</el-tab-pane>
				<el-tab-pane label="热源能效" v-hasTabMenu="3-2-1-3">
					<v-sourceEff v-if="this.index == 2"></v-sourceEff>
				</el-tab-pane>
				<el-tab-pane label="能耗对比" v-hasTabMenu="3-2-1-4">
					<v-consumeCompare v-if="this.index == 3"></v-consumeCompare>
				</el-tab-pane>
				<el-tab-pane label="政策规范" v-hasTabMenu="3-2-1-5">
					<v-sourceprofile v-if="this.index == 4"></v-sourceprofile>
				</el-tab-pane>
				<el-tab-pane label="市政联系方式" v-hasTabMenu="3-2-1-6">
					<v-sourceperson v-if="this.index == 5"></v-sourceperson>
				</el-tab-pane>
			</el-tabs>
		</div>
    </div>
</template>

<script>
	import sourcerealdata from "./heatSourceSystem/sourcerealdata.vue";
	import sourcehistorydata from "./heatSourceSystem/sourcehistorydata.vue";
	import sourceprofile from "./heatSourceSystem/sourceprofile.vue";
	import sourceperson from "./heatSourceSystem/sourceperson.vue";
	import sourceEff from "./heatSourceSystem/sourceEff.vue";
	import consumeCompare from "./heatSourceSystem/consumeCompare.vue";

export default {
	components : {
		"v-sourcerealdata":sourcerealdata,
		"v-sourcehistorydata":sourcehistorydata,
		"v-sourceprofile":sourceprofile,
		"v-sourceperson":sourceperson,
		"v-sourceEff":sourceEff,
		"v-consumeCompare":consumeCompare
	},
	data(){
		return{
			index:"",
            activeName: "0"
		}
	},
	methods:{
		tabclick(item){
			this.index = item.index;
		}
	},
    watch: {
        $route(to, from) {
            this.activeName = '0';
            this.index = 0;
        }
    }
}
</script>

<style lang="scss" scoped>
	#heatSourceSystem{
		.heatSourceSystem{
			padding: 15px;
		}
	}
</style>
