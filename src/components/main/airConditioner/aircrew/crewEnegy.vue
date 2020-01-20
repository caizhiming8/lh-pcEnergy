<template>
    <div id="crewEnegy">
        <div class="crewEnegy">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时能耗" name="1">
                    <div v-if="Index==1">
                        <v-deviceReal></v-deviceReal>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" name="2">
                    <div v-if="Index==2">
                        <v-deviceHistory></v-deviceHistory>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import deviceReal from './deviceReal';
import deviceHistory from './deviceHistory';
export default {
    data() {
        return{
            activeName: '1',
            Index: 1
        }
    },
    methods:{
        handleClick(ids) {
            this.Index = ids.name;
        }
    },
    components: {
        'v-deviceReal': deviceReal,
        'v-deviceHistory': deviceHistory
    }
}
</script>

<style lang="scss" scoped>
#crewEnegy{
    .crewEnegy{
        /deep/ .el-tabs__nav-wrap:after{
            background-color: #fff;
        }
    }
}
</style>
