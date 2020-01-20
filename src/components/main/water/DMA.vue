<template>
    <div id="DMA">
        <div class="DMA">
            <el-tabs type="border-card">
                <el-tab-pane label="DMA节点流向" v-hasTabMenu="2-5-1-1">
                    <v-dmaTodo></v-dmaTodo>
                </el-tab-pane>
                <el-tab-pane label="DMA分区" v-hasTabMenu="2-5-1-2">
                    <v-dmaList></v-dmaList>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import dmaList from './DMA/dmaList.vue';
import dmaTodo from './DMA/dmaTodo.vue';
export default {
    data() {
        return{

        }
    },
    methods: {
        handleCurrentChange() {

        }
    },
    mounted() {

    },
    components: {
        'v-dmaList': dmaList,
        'v-dmaTodo': dmaTodo
    }
}
</script>

<style lang="scss" scoped>
#DMA{
    padding: 20px 15px;
    .DMA{

    }
}
</style>
