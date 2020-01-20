<template>
	<div id="examine">
		<div class="examine">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
			    <el-tab-pane label="实时定额考核" name="1">
					<v-unitAssessment v-if="index==0"></v-unitAssessment>
				</el-tab-pane>
			    <el-tab-pane label="历史定额考核" name="2">
					<v-collectiveAssessment v-if="index==1"></v-collectiveAssessment>
			    </el-tab-pane>
				<el-tab-pane label="所有房间定额考核" name="3">
					<v-roomEffectContrast v-if="index==2"></v-roomEffectContrast>
				</el-tab-pane>
				<el-tab-pane label="房间实时定额考核" name="4">
					<v-selfTubeAssessment v-if="index==3"></v-selfTubeAssessment>
				</el-tab-pane>
				<el-tab-pane label="房间历史定额考核" name="5">
					<v-roomAssessment v-if="index==4"></v-roomAssessment>
				</el-tab-pane>
				<!-- selfTubeAssessment -->
			</el-tabs>
		</div>
	</div>
</template>
<script>
import unitAssessment from './examine/unitAssessment'
import collectiveAssessment from './examine/collectiveAssessment'
import roomAssessment from './examine/roomAssessment'
import selfTubeAssessment from './examine/selfTubeAssessment'
import roomEffectContrast from './examine/roomEffectContrast.vue'
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
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.index = 0
		}
	},
	components: {
		'v-unitAssessment': unitAssessment,
	    'v-collectiveAssessment': collectiveAssessment,
		'v-roomAssessment': roomAssessment,
		'v-selfTubeAssessment': selfTubeAssessment,
		'v-roomEffectContrast': roomEffectContrast
	},
}
</script>
<style lang="scss" scoped>
#examine{
    .examine{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}
</style>