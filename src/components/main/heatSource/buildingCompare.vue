<template>
	<div id="buildingCompare">
		<div class="buildingCompare">
			<el-tabs type="border-card" @tab-click="tabclick">
				<el-tab-pane label="能耗对比" v-hasTabMenu="3-4-1-1">
					<v-consumeCompare v-if="this.index==0"></v-consumeCompare>
				</el-tab-pane>
				<el-tab-pane label="能效对比" v-hasTabMenu="3-4-1-2">
					<v-effCompare v-if="this.index==1"></v-effCompare>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import consumeCompare from "./buildingCompare/consumeCompare.vue";
	import effCompare from "./buildingCompare/effCompare.vue";

	export default {
		components : {
			"v-consumeCompare":consumeCompare,
			"v-effCompare":effCompare
		},
		data(){
			return{
				index:""
			}
		},
		methods:{
			tabclick(item){
				this.index = item.index;
			}
		}
	}
</script>
<style lang="scss" scoped>
	#buildingCompare{
		padding: 15px;
		.buildingCompare{

		}
	}
</style>
