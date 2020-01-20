<template>
    <div id="buildingList">
        <div class="buildingList">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时能耗" name="1" >
                    <div v-if="Index==1">
                        <v-buildingReal></v-buildingReal>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" name="2">
                    <div v-if="Index==2">
                        <v-buildingHistory></v-buildingHistory>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="房间管控" name="3">
                    <div v-if="Index==3">
                        <v-buldingRoom></v-buldingRoom>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="4">
                    <div v-if="Index==4">
                        <v-controlRecord></v-controlRecord>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import buldingRoom from './buildingList/buldingRoom';
import buildingReal from './buildingList/buildingReal';
import buildingHistory from './buildingList/buildingHistory';
import controlRecord from './buildingList/controlRecord';
export default {
    data() {
        return{
            activeName: '1',
            Index: 1
        }
    },
    methods: {
        handleClick(ids) {
            this.Index = ids.name;
        }
    },
    mounted() {

    },
    components: {
        'v-buldingRoom': buldingRoom,
        'v-buildingReal': buildingReal,
        'v-buildingHistory': buildingHistory,
        'v-controlRecord': controlRecord
    },
    watch:{
        $route() {
            this.activeName = '1';
            this.Index = 1;
        }
    }
}
</script>

<style lang="scss" scoped>
#buildingList{
    .buildingList{
        padding: 15px;
    }
}
</style>
