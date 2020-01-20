<template>
    <div id="heatTransfer">
        <div class="heatSource">
            <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
                <el-tab-pane label="实时运行图" v-hasTabMenu="3-3-1-1">
                    <v-realRunningChart v-if="Index==0"></v-realRunningChart>
                </el-tab-pane>
                <el-tab-pane label="实时数据" v-hasTabMenu="3-3-1-2">
                    <v-realRunningData v-if="Index==1"></v-realRunningData>
                </el-tab-pane>
                <el-tab-pane label="历史数据" v-hasTabMenu="3-3-1-3">
                    <v-historyDataHeatTransfer v-if="Index==2"></v-historyDataHeatTransfer>
                </el-tab-pane>
                <el-tab-pane label="设备控制" v-hasTabMenu="3-3-1-4">
                    <v-deviceHeatTransfer v-if="Index==3"></v-deviceHeatTransfer>
                </el-tab-pane>
                <el-tab-pane label="操作记录" v-hasTabMenu="3-3-1-5">
                    <v-manegorHeatTransfer v-if="Index==4"></v-manegorHeatTransfer>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import realRunningChart from './heatTransfer/realRunningChart';
import realRunningData from './heatTransfer/realRunningData';
import historyDataHeatTransfer from './heatTransfer/historyDataHeatTransfer';
import deviceHeatTransfer from './heatTransfer/deviceHeatTransfer';
import manegorHeatTransfer from './heatTransfer/manegorHeatTransfer';
export default {
    data() {
        return{
            Index: 0,
            activeName: '0'
        }
    },
    methods: {
        tabClick(index) {
            this.Index = index.index;
        }
    },
    mounted() {

    },
    components: {
        'v-realRunningChart': realRunningChart,
        'v-realRunningData': realRunningData,
        'v-historyDataHeatTransfer': historyDataHeatTransfer,
        'v-deviceHeatTransfer': deviceHeatTransfer,
        'v-manegorHeatTransfer': manegorHeatTransfer
    },
    watch: {
        $route(to, from) {
            this.activeName = '0';
            this.Index = 0;
        }
    }
}
</script>

<style lang="scss" scoped>
#heatTransfer{
    .heatSource{
        padding: 15px;
    }
}
</style>
