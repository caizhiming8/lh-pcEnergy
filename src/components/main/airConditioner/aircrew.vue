<template>
    <div id="aircrew">
        <div class="aircrew">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="运行监控" name="1" >
                    <div v-if="Index==1">
                        <v-crewRun></v-crewRun>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="运行控制" name="2">
                    <div v-if="Index==2">
                        <v-crewControl></v-crewControl>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="能耗管理" name="3">
                    <div v-if="Index==3">
                        <v-crewEnegy></v-crewEnegy>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import crewRun from './aircrew/crewRun.vue';
import crewControl from './aircrew/crewControl.vue';
import crewEnegy from './aircrew/crewEnegy.vue';
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
    components: {
        'v-crewRun': crewRun,
        'v-crewControl': crewControl,
        'v-crewEnegy': crewEnegy
    },
    watch:{
        $route() {
            this.Index = 1;
            this.activeName = '1';
        }
    }
}
</script>

<style lang="scss" scoped>
#aircrew{
    .aircrew{
        padding: 15px;
    }
}
</style>
