<template>
    <div id="automaticControl">
        <el-tabs @tab-click="tabClick">
            <el-tab-pane label="实时控制">
                <div v-if="Index==0">
                    <v-realTimeControl></v-realTimeControl>
                </div>
            </el-tab-pane>
            <el-tab-pane label="定时控制">
                <div v-if="Index==1">
                    <v-deviceControlAuto></v-deviceControlAuto>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import realTimeControl from './autimaticControl/realTimeControl';
import deviceControlAuto from './deviceControl/deviceControlAuto';

export default {
    data() {
        return{
            Index: 0
        }
    },
    methods: {
        tabClick(index) {
            this.Index = index.index;
        }
    },
    components: {
        'v-realTimeControl': realTimeControl,
		'v-deviceControlAuto': deviceControlAuto
    }
}
</script>

<style lang="scss" scoped>
#roomPower{
    // padding: 20px;
}
</style>
