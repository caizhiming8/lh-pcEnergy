<template>
	<div id="efficiencyContrast">
		<div class="efficiencyContrast">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
			    <el-tab-pane label="能效对比" name="1">
					<v-examineContrast v-if="index==0"></v-examineContrast>
			    </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import examineContrast from './examineContrast.vue'
export default{
	data(){
		return{
			index: 0,
			activeName: '1'
		}
	},
	methods:{
		Tabs(items) {
		    this.index = items.index;
		}
	},
	mounted() {

	},
	components: {
	    'v-examineContrast': examineContrast,
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
#efficiencyContrast{
	.efficiencyContrast{
		.el-tabs{
		    width: 98%;
		    margin: 20px auto 20px;
		}
	}
}
</style>
