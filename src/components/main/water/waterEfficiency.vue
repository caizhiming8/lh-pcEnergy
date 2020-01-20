<template>
    <div id="waterEfficiency">
        <div class="linePadding">
            <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
                <el-tab-pane label="楼宇能效比对" name="1" v-hasTabMenu="2-2-3-1">
                    <v-effectComparing v-if="CurrentIndex==1"></v-effectComparing>
                </el-tab-pane>
                <el-tab-pane label="楼宇历史能效" name="2" v-hasTabMenu="2-2-3-2">
                    <v-effectHistory v-if="CurrentIndex==2"></v-effectHistory>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import effectComparing from './waterEfficiency/effectComparing.vue';
import effectHistory from './waterEfficiency/effectHistory.vue';

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
    components: {
        'v-effectComparing': effectComparing,
        'v-effectHistory': effectHistory
    }
}
</script>

<style lang="scss" scoped>
#waterEfficiency{
    .linePadding{
        padding: 20px 10px;
    }
}
</style>
