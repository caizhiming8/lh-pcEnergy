<template>
<div id="assessmentQuota">
		<div class="assessmentQuota">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
				<el-tab-pane label="单位能耗考核" name="1">
					<v-unitEffectContrast v-if="index==0"></v-unitEffectContrast>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import unitEffectContrast from './assessmentQuota/unitEffectContrast.vue'
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
#assessmentQuota{
	.assessmentQuota{
		.el-tabs{
		    width: 98%;
		    margin: 20px auto 20px;
		}
	}
}
</style>
