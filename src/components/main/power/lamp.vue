<template>
    <div id="lamp">
        <div class="lamp">
            <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
                <el-tab-pane label="灯控" name="1">
                    <v-lampSetting v-if="Index==0"></v-lampSetting>
                </el-tab-pane>
                <el-tab-pane label="定时控制" name="2">
                    <v-lampControl v-if="Index==1"></v-lampControl>
                </el-tab-pane>
                <el-tab-pane label="灯控记录" name="3">
                    <v-lampRecord v-if="Index==2"></v-lampRecord>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import lampSetting from './lampSetting';
import lampRecord from './lampRecord';
import lampControl from './lampControl';
export default {
    data() {
        return{
            activeName: "1",
            Index: 0
        }
    },
    methods: {
        tabClick(index) {
            this.Index = index.index;
        }
    },
    components: {
        'v-lampSetting': lampSetting,
        'v-lampRecord': lampRecord,
        'v-lampControl': lampControl
    }
}
</script>

<style lang="scss" scoped>
#lamp{
    .lamp{
        padding: 15px;
        padding-bottom: 45px;
    }
}
</style>
