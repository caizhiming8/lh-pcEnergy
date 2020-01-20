<template>
    <div id="DeviceQuery">
        <div class="DeviceQuery">
            <el-tabs type="border-card" @tab-click="Tabs">
                <el-tab-pane label="设备查询" v-hasTabMenu="4-1-1">
					<v-equipmentFile v-if="index==0"></v-equipmentFile>
				</el-tab-pane>
                <el-tab-pane label="统计分析" v-hasTabMenu="4-1-2">
					<v-runAnalysis v-if="index==1"></v-runAnalysis>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import equipmentFile from './DeviceQuery/equipmentFile.vue'
import runAnalysis from './DeviceQuery/runAnalysis.vue'
export default {
    data() {
        return{
            index: 0
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        }
    },
    mounted() {

    },
    components: {
		'v-equipmentFile': equipmentFile,
        'v-runAnalysis': runAnalysis,
    }
}
</script>

<style lang="scss" scoped>
#DeviceQuery{
    height: 100%;
    .DeviceQuery{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}
</style>
