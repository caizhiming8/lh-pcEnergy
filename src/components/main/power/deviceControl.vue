<template>
    <div id="deviceControl">
        <div class="deviceControl">
            <el-tabs type="border-card" @tab-click="tabClick">
				<el-tab-pane label="实时控制">
				    <v-realTimeControl v-if="Index==0"></v-realTimeControl>
				</el-tab-pane>
                <el-tab-pane label="定时控制">
                    <v-deviceControlAuto v-if="Index==1"></v-deviceControlAuto>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import realTimeControl from './autimaticControl/realTimeControl';
import deviceControlAuto from './deviceControl/deviceControlAuto';
/* import deviceControlAuto from './deviceControl/deviceControlAuto'; */
/* import automaticControl from './automaticControl'; */
/* import operation from './deviceControl/operation'; */
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
		/* 'v-automaticControl': automaticControl, */
		'v-realTimeControl': realTimeControl,
		'v-deviceControlAuto': deviceControlAuto
    },
}
</script>

<style lang="scss" scoped>
#deviceControl{
    .deviceControl{
        padding: 15px;
    }
}
</style>
