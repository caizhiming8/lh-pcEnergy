<template>
    <div id="waterTower">
        <div class="linePadding">
            <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
                <el-tab-pane label="实时能耗" name="1" v-hasTabMenu="2-2-2-1">
                    <v-realTime v-if="CurrentIndex==1"></v-realTime>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" name="2" v-hasTabMenu="2-2-2-2">
                    <v-history v-if="CurrentIndex==2"></v-history>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import realTime from './waterTower/realTime.vue';
import history from './waterTower/history.vue';
export default {
    data() {
        return{
            CurrentIndex: 1,
            activeName: "1"
        }
    },
    methods: {
        handleClick(tabs) {
            this.CurrentIndex = tabs.name;
        }
    },
    mounted() {

    },
    components: {
        'v-realTime': realTime,
        'v-history': history
    }
}
</script>

<style lang="scss" scoped>
#waterTower{
    .linePadding{
        padding: 20px 10px;
    }
}
</style>
