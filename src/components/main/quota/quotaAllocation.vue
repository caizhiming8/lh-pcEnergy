<template>
	<div id="quotaAllocation">
		<div class="quotaAllocation">
			<el-tabs type="border-card" @tab-click="tabs" v-model="activeName">
				<el-tab-pane label="定额配置" name="1">
					<v-administer v-if="index==0"></v-administer>
				</el-tab-pane>
				<el-tab-pane label="定额申请" name="2">
					<v-application v-if="index==1"></v-application>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import administer from './administer';
import application from './application';
export default{
	data(){
		return{
			index: 0,
			activeName: '1'
		}
	},
	methods:{
		tabs(tab) {
		    this.index = tab.index;
		}
	},
	mounted() {

	},
	components: {
	    'v-administer': administer,
		'v-application': application
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
	#quotaAllocation{
	    padding: 20px 15px;
	}
</style>
