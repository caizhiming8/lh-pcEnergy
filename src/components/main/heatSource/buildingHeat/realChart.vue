<template>
    <div id="realChart">
        <div class="realChart">
            <ol class="ol">
                <li v-for="(item, index) in list" v-if="list.length>0" @click="handleColor(index, item.number)" :class="currentIndex==index?'active': ''">{{index+1}}号分时分温控制器</li>
            </ol>
            <div class="placeDiv">
                <div class="placeDiv-l">
                    <img src="../../../../../static/img/icon-.png" class="img1">
                    <b>通讯状态:</b>
                    <span v-if="state==1">正常</span>
                    <span v-if="state==0">离线</span>
                    <span v-if="state=='-'">-</span>
                </div>
                <div class="placeDiv-c">
                    <img src="../../../../../static/img/tuouan1.png" class="img1">
                    <b>时间:</b>
                    <span>{{time}}</span>
                </div>
                <div class="placeDiv-r">
                    <img src="../../../../../static/img/time (1).png" class="img1">
                    <b>室外温度:</b>
                    <span>{{temperature}}</span>
                </div>
            </div>
            <div class="bg">
                <p class="p1 p">{{obj.d1}}</p>
                <p class="p2 p">{{obj.d2}}</p>
                <p class="p3 p">{{obj.d3}}</p>
                <p class="p4 p">{{obj.d4}}</p>
                <p class="p5 p">{{obj.d50}} : {{obj.d51}}<br>{{obj.d52}} : {{obj.d53}}<br>{{obj.d54}} : {{obj.d55}}<br>{{obj.d56}} : {{obj.d57}}</p>
                <p class="p6 p">{{obj.d61}} : {{obj.d62}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../../api/api.js';
export default {
    data() {
        return{
            buildingId: '',
            systemId: '',
            subsystemId: '',
            obj: {d1: "-", d2: "-", d3: "-", d4: "-", d50: "-", d51: "-", d52: "-", d53: "-", d54: "-", d55: "-", d56: "-", d57: "-", d61: '-', d62: '-'},
            websockit: '',
            state: 0,
            time: '',
            temperature: '',
            list: [],
            number: 0,
            currentIndex: 0,
            apis: ''
        }
    },
    methods: {
        initLi() {
            let data = {
                buildingId: this.buildingId
            }
            this.$axios.post(`BMPlatServers/hvacheat/queryBuildingSuits`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.list = res.data.result.list;
                        this.number = this.list[0].number;
                        this.initData();
                    }else{
                        this.list = [];
                        this.number = 1;
                        this.initData();
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        duration: 1000,
                        showClose: true
                    })
                }
            })
        },

        handleColor(i, number) {
            this.currentIndex = i;   // 点击变色
            this.number = number;    // 取参传给后台
            this.websockit.close();
            this.initData();
        },

        initData() {
            this.apis = window.location.href.split("http://")[1].split(":")[0];
            this.websockets();
        },
        websockets() {
            if ("WebSocket" in window) {
                // let ws =  new WebSocket(`${this.$websokit.websockitApi}/BMPlatServers/myWebSocket/${this.systemId}/${this.subsystemId}/${this.buildingId}/${this.number}`);
                let ws =  new WebSocket(`ws://${this.apis}:8081/BMPlatServers/myWebSocket/${this.systemId}/${this.subsystemId}/${this.buildingId}/${this.number}`);
                this.websockit = ws;
                ws.onopen = (evt)=>{
                    console.log(evt);
                }
                ws.onmessage = (evt)=>{
                    let obj = JSON.parse(evt.data);
                    // console.log(obj);
                    if(JSON.stringify(obj) != "{}") {
                        this.obj.d1 = obj.data1x1x1 == undefined ? "-" : obj.data1x1x1.value;
                        this.obj.d2 = obj.data2x1x1 = undefined ? "-" :  obj.data2x1x1.value;
                        this.obj.d3 = obj.data3x1x1 == undefined ? "-" : obj.data3x1x1.value;
                        this.obj.d4 = obj.data4x1x1 == undefined ? "-" : obj.data4x1x1.value;
                        this.obj.d50 = obj.data5x1x1 == undefined ? "-" : obj.data5x1x1.dataName;
                        this.obj.d51 = obj.data5x1x1 == undefined ? "-" : obj.data5x1x1.value;
                        this.obj.d52 = obj.data6x1x1 == undefined ? "-" : obj.data6x1x1.dataName;
                        this.obj.d53 = obj.data6x1x1 == undefined ? "-" : obj.data6x1x1.value;
                        this.obj.d54 = obj.data7x1x1 == undefined ? "-" : obj.data7x1x1.dataName;
                        this.obj.d55 = obj.data7x1x1 == undefined ? "-" : obj.data7x1x1.value;
                        this.obj.d56 = obj.data8x1x1 == undefined ? "-" : obj.data8x1x1.dataName;
                        this.obj.d57 = obj.data8x1x1 == undefined ? "-" : obj.data8x1x1.value;
                        this.obj.d61 = obj.data1x2x1 == undefined ? "-" : obj.data1x2x1.dataName;
                        this.obj.d62 = obj.data1x2x1 == undefined ? "-" : obj.data1x2x1.value;
                        this.temperature = obj.data1x8x1 == undefined ? "-" : obj.data1x8x1.value;
                        this.state = obj.status == undefined ? "-" : obj.status ;
                        this.time = obj.time  == undefined ? "-" : obj.time ;

                    }else{
                        this.obj = {d1: "-", d2: "-", d3: "-", d4: "-", d50: "-", d51: "-", d52: "-", d53: "-", d54: "-", d55: "-", d56: "-", d57: "-"};
                        this.temperature = "-";
                        this.state = "-";
                        this.time = "-";
                    }
                }
            }else{
                this.$message.warning('您的浏览器不支持websockit');
            }
        }
    },
    beforeDestroy() {
        this.websockit.close();
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.initLi();
    },
    watch: {
        $route(to, from) {
            this.websockit.close();
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.systemId = to.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = to.fullPath.split('=')[1].split(',')[1];
            this.initLi();
            this.currentIndex = 0;
        }
    }
}
</script>

<style lang="scss" scoped>
#realChart{
    .realChart{
        .ol{
            overflow: hidden;
            padding-left: 15px;
            li{
                float: left;
                margin: 0 10px;
                padding: 5px 13px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                background: #ACBCCC;
                font-size: 12px;
                cursor: pointer;
            }
            li:first-child{
                margin-left: 0;
            }
            li.active{
                background: #409eff;
                color: #fff;
            }
        }
        .bg{
            width: 100%;
            height: 600px;
            background: url(../../../../../static/img/louqian.png) no-repeat 0 0;
            background-size: 100% 100%;
            position: relative;
            .p{
                position: absolute;
                padding: 10px 15px;
                color: #fff;
                border-radius: 4px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                -o-border-radius: 4px;
            }
            .p1{
                left: 15%;
                top: 34%;
                background: url(../../../../../static/img/xxx.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
            .p2{
                left: 15%;
                top: 65%;
                background: url(../../../../../static/img/xxx.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
            .p3{
                left: 22%;
                top: 34%;
                background: url(../../../../../static/img/backs3.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
            .p4{
                left: 22%;
                top: 65%;
                background: url(../../../../../static/img/backs3.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
            .p5{
                left: 39%;
                top: 24%;
                background: url(../../../../../static/img/bgs.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
            .p6{
                left: 31%;
                top: 59%;
                background: url(../../../../../static/img/bgs.png) no-repeat 0 0;
                background-size: 100% 100%;
            }
        }
    }
    .placeDiv{
        overflow: hidden;
        font-size: 18px;
        margin-top: 10px;
        border-bottom: 3px solid #fff;
        .placeDiv-l{
            float: left;
            overflow: hidden;
            padding: 10px 0 10px 15px;
            color: #008040;
            font-size: 18px;
            font-weight: 700;
            .img1{
                float: left;
            }
            b{
                display: block;
                float: left;
                height: 30px;
                line-height: 30px;
                font-weight: 700;
                position: relative;
                top: -3px;
                left: 4px;
            }
            span{
                margin-left: 15px;
                float: left;
                display: block;
                height: 30px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
        }
        .placeDiv-c{
            padding: 10px 0 10px 15px;
            float: left;
            height: 30px;
            margin-left: 100px;
            line-height: 30px;
            overflow: hidden;
            font-weight: 700;
            color: #008040;
            .img1{
                float: left;
            }
            b{
                display: block;
                float: left;
                font-weight: 700;
                position: relative;
                top: -3px;
                left: 4px;
            }
            span{
                display: block;
                float: left;
                margin-left: 15px;
                position: relative;
                top: -2px;
            }
        }
        .placeDiv-r{
            float: left;
            margin-left: 100px;
            overflow: hidden;
            padding: 10px 0 10px 15px;
            height: 30px;
            line-height: 30px;
            font-weight: 700;
            color: #008040;
            .img1{
                float: left;
            }
            b{
                display: block;
                float: left;
                font-weight: 700;
                position: relative;
                top: -3px;
                left: 3px;
            }
            span{
                display: block;
                float: left;
                margin-left: 15px;
                position: relative;
                top: -3px;
            }
        }
    }
}
</style>
