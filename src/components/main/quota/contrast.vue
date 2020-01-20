<template>
	<div id="contrast">
		<div class="contrast">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
			    <el-tab-pane label="考核审批" name="1">
					<v-examination v-if="index==0"></v-examination>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
import examination from './contrast/examination.vue'
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
	mounted(){
		
	},
	components: {
		'v-examination': examination,
	},
	watch:{
		
	}
}
</script>
<style lang="scss" scoped>
#contrast{
    .contrast{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}	
</style>