<template>
    <div id="buildingHeat">
        <div class="buildingHeat">
			<el-tabs @tab-click="tabclick" type="border-card" v-model="activeName">
                <el-tab-pane label="实时运行图" name="0" v-hasTabMenu="3-4-2-1">
					<v-realChart v-if="this.index==0"></v-realChart>
				</el-tab-pane>
				<el-tab-pane label="历史数据" name="1" v-hasTabMenu="3-4-2-2">
					<v-realdata v-if="this.index==1"></v-realdata>
				</el-tab-pane>
				<el-tab-pane label="设备控制" name="2" v-hasTabMenu="3-4-2-3">
					<v-devicecontrol v-if="this.index==2"></v-devicecontrol>
				</el-tab-pane>
				<el-tab-pane label="操作记录" name="3" v-hasTabMenu="3-4-2-4">
					<v-controlhistory v-if="this.index==3" ></v-controlhistory>
				</el-tab-pane>
				<el-tab-pane label="历史能耗" name="4" v-hasTabMenu="3-4-2-6">
					<v-consumehistory v-if="this.index==4"></v-consumehistory>
				</el-tab-pane>
				<el-tab-pane label="历史能效" name="5" v-hasTabMenu="3-4-2-5">
					<v-effhistory v-if="this.index==5"></v-effhistory>
				</el-tab-pane>
			</el-tabs>
		</div>
    </div>
</template>

<script>
    import realChart from "./buildingHeat/realChart.vue";
	import consumehistory from "./buildingHeat/consumehistory.vue";
	import controlhistory from "./buildingHeat/controlhistory.vue";
	import devicecontrol  from "./buildingHeat/devicecontrol.vue";
	import effhistory from "./buildingHeat/effhistory.vue";
	import realdata from "./buildingHeat/realdata.vue";
export default {
	components:{
		"v-consumehistory":consumehistory,
		"v-controlhistory":controlhistory,
		"v-devicecontrol":devicecontrol,
		"v-effhistory":effhistory,
        "v-realdata":realdata,
		"v-realChart":realChart
	},
	data(){
		return{
			index:"",
            activeName: '0'
		}
	},
	methods:{
		tabclick(item){
			this.index = item.index;
		}
	},
    watch: {
        $route(to, from) {
            this.activeName = "0";
            this.index = 0;
        }
    }
}
</script>

<style lang="scss" scoped>
	#buildingHeat{
		.buildingHeat{
			padding:15px
		}
	}
</style>
