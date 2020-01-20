<template>
    <div id="failurePrediction">
        <div class="failurePrediction">
            <el-tabs type="border-card" @tab-click="Tabs">
                <el-tab-pane label="故障预测" v-hasTabMenu="4-3-1">
					<v-malfunction v-if="index==0"></v-malfunction>
				</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import malfunction from './failurePrediction/malfunction.vue'
export default {
    data() {
        return{
            index: 0
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        }
    },
    mounted() {

    },
    components: {
		'v-malfunction': malfunction,
    }
}
</script>

<style lang="scss" scoped>
#failurePrediction{
    .failurePrediction{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}
</style>
