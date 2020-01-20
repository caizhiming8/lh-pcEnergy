<template>
    <div id="totalSubsystemPower">
        <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
            <el-tab-pane label="实时能耗" name="1" v-hasTabMenu="1-3-1-1">
                <v-totalSubsystemPowerReal v-if="Index==0"></v-totalSubsystemPowerReal>
            </el-tab-pane>
            <el-tab-pane label="历史能耗" name="2" v-hasTabMenu="1-3-1-2">
                <v-totalSubsystemPowerHistory v-if="Index==1"></v-totalSubsystemPowerHistory>
            </el-tab-pane>
            <el-tab-pane label="能耗分布" name="3" v-hasTabMenu="1-3-1-3">
                <v-totalSubsystemPowerDistribute v-if="Index==2"></v-totalSubsystemPowerDistribute>
            </el-tab-pane>
            <el-tab-pane label="楼宇" name="4" v-hasTabMenu="1-3-1-4">
                <v-buildingList v-if="Index==3"></v-buildingList>
            </el-tab-pane>
            <el-tab-pane label="房间" name="5" v-hasTabMenu="1-3-1-5">
                <v-buildingListRoom v-if="Index==4"></v-buildingListRoom>
            </el-tab-pane>
            <el-tab-pane label="设备管控" name="6" v-hasTabMenu="1-3-1-6">
                <v-deviceControl v-if="Index==5"></v-deviceControl>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import totalSubsystemPowerReal from './totalSubsystemPower/totalSubsystemPowerReal.vue';
import totalSubsystemPowerHistory from './totalSubsystemPower/totalSubsystemPowerHistory.vue';
import totalSubsystemPowerDistribute from './totalSubsystemPower/totalSubsystemPowerDistribute.vue';

import buildingListRoom from './buildingList/buildingListRoom.vue';

import buildingList from './buildingList.vue';
import deviceControl from './deviceControl.vue';
export default {
    data() {
        return{
            Index: 0,
			activeName : '1'
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
        'v-totalSubsystemPowerReal': totalSubsystemPowerReal,
        'v-totalSubsystemPowerHistory': totalSubsystemPowerHistory,
        'v-totalSubsystemPowerDistribute': totalSubsystemPowerDistribute,
        'v-buildingListRoom': buildingListRoom,
        'v-buildingList': buildingList,
        'v-deviceControl': deviceControl,
    },
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.Index = 0
		}
	}
}
</script>

<style lang="scss" scoped>
#totalSubsystemPower{
    padding: 15px;
}
</style>
