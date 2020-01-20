<template>
    <div id="realAlarm">
        <div class="linePadding">
            <div class="alartShadow">
                <v-alarmStatistics class="alarmStatistics"></v-alarmStatistics>
                <v-flowAlart class="flowAlart"></v-flowAlart>
            </div>
        </div>
    </div>
</template>

<script>
import alarmStatistics from './realAlarm/alarmStatistics.vue';
import flowAlart from './realAlarm/flowAlart.vue';

export default {
    data() {
        return{

        }
    },
    components: {
        'v-alarmStatistics': alarmStatistics,
        'v-flowAlart': flowAlart
    }
}
</script>

<style lang="scss" scoped>
#realAlarm{
    .linePadding{
        padding: 20px 10px;
        .alartShadow{
            box-shadow: 0 0 6px #ddd;
            -webkit-box-shadow: 0 0 6px #ddd;
            -moz-box-shadow: 0 0 6px #ddd;
            -o-box-shadow: 0 0 6px #ddd;
            padding: 30px 15px;
            .alarmStatistics{
                border-bottom: 1px solid #ddd;
            }
            .flowAlart{
                margin-top: 40px;
            }
        }
    }
}
</style>
