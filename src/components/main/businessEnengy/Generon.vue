<template>
    <div id="Generon">
        <div class="Generon">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时能耗" name="1" v-hasTabMenu="8-1-1">
                    <v-GeneronReal v-if="currentActiveName==1"></v-GeneronReal>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" name="2" v-hasTabMenu="8-1-2">
                    <v-GeneronHistory v-if="currentActiveName==2"></v-GeneronHistory>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import GeneronReal from './Generon/GeneronReal';
import GeneronHistory from './Generon/GeneronHistory';
export default {
    data() {
        return{
            activeName: '1',
            currentActiveName: 1
        }
    },
    methods: {
        handleClick(index) {
            this.currentActiveName = index.name;
        }
    },
    components: {
        'v-GeneronReal': GeneronReal,
        'v-GeneronHistory': GeneronHistory
    }
}
</script>

<style lang="scss" scoped>
#Generon{
    padding: 15px;
    .Generon{

    }
}
</style>
