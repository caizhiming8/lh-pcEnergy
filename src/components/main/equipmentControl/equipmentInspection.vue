<template>
    <div id="equipmentInspection">
        <div class="equipmentInspection">
            <el-tabs type="border-card" @tab-click="Tabs">
                <el-tab-pane label="设备巡检" v-hasTabMenu="4-2-1">
					<div v-if="index==0">
						<v-checkingList v-if='isShow' @emits="handleEmit"></v-checkingList>
						<v-equipmentPlan v-if='!isShow' @detailEmits="handleDetail"></v-equipmentPlan>
					</div>
				</el-tab-pane>
				<el-tab-pane label="巡检记录" v-hasTabMenu="4-2-2">
					<div v-if="index==1">
						<v-inspectionRecords></v-inspectionRecords>
					</div>
				</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import checkingList from './equipmentInspection/checkingList.vue';
import equipmentPlan from './equipmentInspection/equipmentPlan.vue';
import inspectionRecords from './equipmentInspection/inspectionRecords.vue'
export default {
    data() {
        return{
            index: 0,
			isShow: true
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
			if(this.index == 1){
				this.isShow = true;
			}
        },
		// 接子组件roomPowerDevice传过来的数值
		handleEmit(data) {
		    this.isShow = false;
		    console.log(data);
		},
		handleDetail() {
		    this.isShow = true;
		}
    },
    mounted() {
		this.isShow = true;
    },
    components: {
		'v-checkingList': checkingList,
		'v-equipmentPlan': equipmentPlan,
		'v-inspectionRecords': inspectionRecords
    }
}
</script>

<style lang="scss" scoped>
#equipmentInspection{
    .equipmentInspection{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}
</style>
