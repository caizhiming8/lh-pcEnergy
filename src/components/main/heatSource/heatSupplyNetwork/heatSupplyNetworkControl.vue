<template>
    <div id="heatSupplyNetworkControl">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="实时运行图" name="1" v-hasTabMenu="3-5-1-1">
                <v-heatSupplyNetworkControlRealPicture v-if="Index==0"></v-heatSupplyNetworkControlRealPicture>
            </el-tab-pane>
            <el-tab-pane label="历史数据" name="2" v-hasTabMenu="3-5-1-2">
                <v-heatSupplyNetworkControlHistory v-if="Index==1"></v-heatSupplyNetworkControlHistory>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import heatSupplyNetworkControlRealPicture from './heatSupplyNetworkControl/heatSupplyNetworkControlRealPicture.vue';
import heatSupplyNetworkControlHistory from './heatSupplyNetworkControl/heatSupplyNetworkControlHistory.vue';
export default {
    data() {
        return{
            activeName: '1',
            Index: 0
        }
    },
    methods: {
        handleClick(index) {
            this.Index = index.index;
        }
    },
    components: {
        'v-heatSupplyNetworkControlRealPicture': heatSupplyNetworkControlRealPicture,
        'v-heatSupplyNetworkControlHistory': heatSupplyNetworkControlHistory,
    }
}
</script>

<style lang="scss" scoped>
#heatSupplyNetworkControl{
    padding: 15px;
}
</style>
