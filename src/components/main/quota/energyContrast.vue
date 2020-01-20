<template>
	<div id="energyContrast">
		<div class="energyContrast">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
			    <!-- <el-tab-pane label="能耗对比" name="1">
					<v-expendContrast v-if="index==0"></v-expendContrast>
				</el-tab-pane> -->
			    <el-tab-pane label="能效对比" name="1">
					<v-examineContrast v-if="index==0"></v-examineContrast>
			    </el-tab-pane>
				<el-tab-pane label="单位能耗考核" name="2">
					<v-unitEffectContrast v-if="index==1"></v-unitEffectContrast>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import expendContrast from './energyContrast/expendContrast.vue'
import examineContrast from './examineContrast.vue'
import unitEffectContrast from './energyContrast/unitEffectContrast.vue'
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
		'v-expendContrast': expendContrast,
	    'v-examineContrast': examineContrast,
		'v-unitEffectContrast': unitEffectContrast,
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
#energyContrast{
	.energyContrast{
		.el-tabs{
		    width: 98%;
		    margin: 20px auto 20px;
		}
	}
}
</style>
