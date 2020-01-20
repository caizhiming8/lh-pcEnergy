<template>
    <div id="operationControllingHistory">
        <div class="echarts" ref="Echarts04"></div>
    </div>
</template>

<script>
export default {
    data() {
        return{

        }
    },
    methods: {
        init() {
            let myChart04 = this.$echarts.init(this.$refs.Echarts04);
            let wid4 = document.body.clientWidth || document.documentElement.clientWidth
            var resize4 = {
              width: wid4 - 300,
              height: 300
            };
            myChart04.resize(resize4);
            let option04 = {
                title: {
                    text: '历史数据',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'历史数据',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    }
                ]
            };
            myChart04.setOption(option04);
        }
    },
    mounted() {
        setTimeout(()=>{
            this.init();
        }, 400);
    }
}
</script>

<style lang="scss" scoped>
#operationControllingHistory{
    .echarts{
        width: 100%;
        height: 300px;
    }
}
</style>
