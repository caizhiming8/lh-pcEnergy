<template>
    <div id="realRunningChart">
        <v-realRunningChart1 v-if="buildingId == 201"></v-realRunningChart1>
        <v-realRunningChart2 v-if="buildingId == 202"></v-realRunningChart2>
        <v-realRunningChart3 v-if="buildingId == 203"></v-realRunningChart3>
    </div>
</template>

<script>
    import realRunningChart1 from "./realRunningChart/realRunningChart1.vue";
    import realRunningChart2 from "./realRunningChart/realRunningChart2.vue";
    import realRunningChart3 from "./realRunningChart/realRunningChart3.vue";
export default {
    data() {
        return{
            buildingId: 0
        }
    },
    components: {
        "v-realRunningChart1": realRunningChart1,
        "v-realRunningChart2": realRunningChart2,
        "v-realRunningChart3": realRunningChart3,
    },
    mounted() {
        this.buildingId = window.location.href.split("=")[1].split(",")[2];
    },
    watch: {
        $route() {
            this.buildingId = window.location.href.split("=")[1].split(",")[2]
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
