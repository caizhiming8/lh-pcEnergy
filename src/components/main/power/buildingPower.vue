<template>
    <div id="buildingPower">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
            <el-tab-pane label="实时用电" name="1" v-hasTabMenu="1-2-1-1">
                <v-buildingPowerReal v-if="Index==0"></v-buildingPowerReal>
            </el-tab-pane>
            <el-tab-pane label="历史用电" name="2" v-hasTabMenu="1-2-1-2">
                <v-buildingPowerHistory v-if="Index==1"></v-buildingPowerHistory>
            </el-tab-pane>
            <el-tab-pane label="能效查询" name="3" v-hasTabMenu="1-2-1-3">
                <v-efficiency v-if="Index==2"></v-efficiency>
            </el-tab-pane>
            <el-tab-pane label="设备管控" name="4" v-hasTabMenu="1-2-1-4">
                <v-deviceBuilding v-if="Index==3"></v-deviceBuilding>
            </el-tab-pane>
            <el-tab-pane label="房间管理" name="5" v-hasTabMenu="1-2-1-5">
                <v-roomPower v-if="Index==4"></v-roomPower>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import buildingPowerReal from './buildingPower/buildingPowerReal';
import buildingPowerHistory from './buildingPower/buildingPowerHistory';
import efficiency from './buildingPower/efficiency';
import deviceBuilding from './buildingPower/deviceBuilding';
import roomPower from './roomPower';
export default {
    data() {
        return{
            Index: 0,
			activeName: '1'
        }
    },
    methods: {
        tabClick(tab) {
            this.Index = tab.index;
        }
    },
    mounted() {

    },
    computed: {

    },
    components: {
        'v-buildingPowerReal': buildingPowerReal,
        'v-buildingPowerHistory': buildingPowerHistory,
        'v-efficiency': efficiency,
        'v-deviceBuilding': deviceBuilding,
        'v-roomPower': roomPower
    },
    watch: {
        $route(to,from) {
			this.activeName = '1'
			this.Index = 0
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingPower{
    padding: 20px 15px;
}
</style>
