<template>
    <div id="historyEnegy">
        <div class="historyEnegy">
			<div class="historyEnegy-bottom">
			    <v-historyEnegyTop></v-historyEnegyTop>
			</div>
            <div class="historyEnegy-top">
                <v-timeQuantumSearch></v-timeQuantumSearch>
            </div>
        </div>
    </div>
</template>

<script>
import historyEnegyTop from './historyEnegy/historyEnegyTop';
import timeQuantumSearch from './historyEnegy/timeQuantumSearch';
export default {
    data() {
        return{
            choiceTime: '',
            timeData: '',
            types: 2
        }
    },
    methods: {

    },
    mounted() {

    },
    components: {
        'v-historyEnegyTop': historyEnegyTop,
        'v-timeQuantumSearch': timeQuantumSearch
    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
#historyEnegy{
    .historyEnegy{
        .historyEnegy-top{}
        .historyEnegy-bottom{
            padding-top: 50px;
            border-top: 3px solid #ddd;
            // margin-top: 20px;
        }
    }
}
</style>
