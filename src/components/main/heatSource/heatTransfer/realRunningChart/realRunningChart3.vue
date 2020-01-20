<template>
    <div id="realRunningChart">
        <div class="realRunningChart">
            <div class="placeDiv">
                <div class="placeDiv-l">
                    <img src="../../../../../../static/img/status.png" class="img1">
                    <b>通讯状态:</b>
                    <span v-if="state==1">正常</span>
                    <span v-if="state==0">离线</span>
                    <span v-if="state=='-'">-</span>
                </div>
                <div class="placeDiv-c">
                    <img src="../../../../../../static/img/time.png" class="img1">
                    <b>时间:</b>
                    <span>{{time}}</span>
                </div>
                <div class="placeDiv-r">
                    <img src="../../../../../../static/img/template.png" class="img1">
                    <b>室外温度:</b>
                    <span>{{temperature}}</span>
                </div>
            </div>

            <div @mouseover="mouseoverEvent($event)">
                <div class="d1 d">{{d1}}</div>
                <div class="d2 d">{{d2}}</div>

                <div class="d4 d">{{d4}}</div>
                <div class="d5 d">{{d5}}</div>
                <div class="d6 d">{{d6name}} : {{d6}}<br>{{d61name}} : {{d61}}<br>{{d62name}} : {{d62}}<br>{{d63name}} : {{d63}}</div>
                <div class="d7 dd">{{d7name}} : {{d7}}<br>{{d71name}} : {{d71}}<br>{{d72name}} : {{d72}}<br>{{d73name}} : {{d73}}</div>
                <div class="d8 dd">{{d8}}</div>
                <div class="d9 dd">{{d9}}</div>
                <div class="d10 dd">{{d10}}</div>
                <div class="d11 dd">{{d11}}</div>
                <div class="d12 dd">{{p2_1}} : {{p2}} <br/> {{p2_10}} : {{p20}}</div>
                <div class="p1 ddd">{{p1}}</div>
                <div class="p2 ddd">{{p3_1}} : {{p3}} <br/> {{p3_10}} : {{p30}}</div>
                <div class="x1 ddd">{{x1}}</div>
                <div class="x2 ddd">{{x2}}</div>
                <div class="x3 ddd">{{x30}} : {{x3}} <br/>{{x3_10}} : {{x3_1}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../../../api/api.js';
export default {
    data() {
        return{
            d1: '-',
            d2: '-',
            d3: '-',
            d4: '-',
            d5: '-',
            d6: '-',
            d7: '-',
            d71: '-',
            d72: '-',
            d73: '-',
            d8: '-',
            d9: '-',
            d10: '-',
            d11: '-',
            d12: '-',
            d13: '-',
            d14: '-',
            d61: '-',
            d62: '-',
            d63: '-',
            d7name: '-',
            d71name: '-',
            d72name: '-',
            d73name: '-',
            d61name: '-',
            d62name: '-',
            d63name: '-',
            d6name: '-',
            x3_10: '-',
            x30: "-",
            x3_1: '-',
            x3: "-",
            p1: "-",
            p2: "-",
            p20: "-",
            p2_10: '-',
            p2_1: '-',
            p3: "-",
            p3_1: '-',
            p30: "-",
            p3_10: '-',
            p4: "-",
            p4_1: '-',
            p40: "-",
            p4_10: '-',
            state: "-",
            systemId: '-',
            subsystemId: '-',
            buildingId: '-',
            websockit: '-',
            time: '-',
            temperature: '-',
            x1: "-",
            x2: "-",
            list: [],
            currentIndex: 0,
            number: 1,
            apis: '',
            x4Name: '-',
            x4value: '-',
            v5name: '-',
            x5value: '-',
            num: 10
        }
    },
    methods: {
        handleColor(i, number) {
            this.currentIndex = i;   // 点击变色
            this.number = number;    // 取参传给后台
            this.websockit.close();
            this.initData();
        },

        // 取数据添值
        initData() {
            this.apis = window.location.href.split("http://")[1].split(":")[0];
            this.websockits();
        },
        websockits() {
            if ("WebSocket" in window) {
                // let ws =  new WebSocket(`${this.$websokit.websockitApi}/BMPlatServers/myWebSocket/${this.systemId}/${this.subsystemId}/${this.buildingId}/1`);
                let ws =  new WebSocket(`ws://${this.apis}:8081/BMPlatServers/myWebSocket/${this.systemId}/${this.subsystemId}/${this.buildingId}/1`);
                this.websockit = ws;

                ws.onopen = function()  {

                };

                ws.onmessage = (evt)=>{
                    let obj = JSON.parse(evt.data);
                    // console.log(obj);
                    if(JSON.stringify(obj) != "{}") {
                        this.d1 = obj.data1x1x1 == undefined ? "-" : obj.data1x1x1.value;
                        this.d4 = obj.data1x2x1 == undefined ? "-" : obj.data1x2x1.value;
                        this.d8 = obj.data2x1x1 == undefined ? "-" : obj.data2x1x1.value;
                        this.d10 = obj.data2x2x1 == undefined ? "-" : obj.data2x2x1.value;
                        this.d2 = obj.data3x1x1 == undefined ? "-" : obj.data3x1x1.value;
                        this.d5 = obj.data3x2x1 == undefined ? "-" : obj.data3x2x1.value;
                        this.d9 = obj.data4x1x1 == undefined ? "-" : obj.data4x1x1.value;
                        this.d11 = obj.data4x2x1 == undefined ? "-" : obj.data4x2x1.value;
                        this.d7 = obj.data5x1x1 == undefined ? "-" : obj.data5x1x1.value;
                        this.d7name = obj.data5x1x1 == undefined ? "-" : obj.data5x1x1.dataName;
                        this.d6 = obj.data5x2x1 == undefined ? "-" : obj.data5x2x1.value;
                        this.d6name = obj.data5x2x1 == undefined ? "-" : obj.data5x2x1.dataName;
                        this.d71 = obj.data6x1x1 == undefined ? "-" : obj.data6x1x1.value;
                        this.d71name = obj.data6x1x1 == undefined ? "-" : obj.data6x1x1.dataName;
                        this.d61 = obj.data6x2x1 == undefined ? "-" : obj.data6x2x1.value;
                        this.d61name = obj.data6x2x1 == undefined ? "-" : obj.data6x2x1.dataName;
                        this.d72 = obj.data7x1x1 == undefined ? "-" : obj.data7x1x1.value;
                        this.d72name = obj.data7x1x1 == undefined ? "-" : obj.data7x1x1.dataName;
                        this.d62 = obj.data7x2x1 == undefined ? "-" : obj.data7x2x1.value;
                        this.d62name = obj.data7x2x1 == undefined ? "-" : obj.data7x2x1.dataName;
                        this.d73 = obj.data8x1x1 == undefined ? "-" : obj.data8x1x1.value;
                        this.d73name = obj.data8x1x1 == undefined ? "-" : obj.data8x1x1.dataName;
                        this.d63 = obj.data8x2x1 == undefined ? "-" : obj.data8x2x1.value;
                        this.d63name = obj.data8x2x1 == undefined ? "-" : obj.data8x2x1.dataName;

                        this.p1 = obj.data1x7x1 == undefined ? "-" : obj.data1x7x1.value;
                        this.p2 = obj.data1x3x1 == undefined ? "-" : obj.data1x3x1.value;
                        this.p2_1 = obj.data1x3x1 == undefined ? "-" : obj.data1x3x1.dataName;
                        this.p20 = obj.data2x3x1 == undefined ? "-" : obj.data2x3x1.value;
                        this.p2_10 = obj.data2x3x1 == undefined ? "-" : obj.data2x3x1.dataName;
                        this.p3 = obj.data1x3x2 == undefined ? "-" : obj.data1x3x2.value;
                        this.p3_1 = obj.data1x3x2 == undefined ? "-" : obj.data1x3x2.dataName;
                        this.p30 = obj.data2x3x2 == undefined ? "-" : obj.data2x3x2.value;
                        this.p3_10 = obj.data2x3x2 == undefined ? "-" : obj.data2x3x2.dataName;
                        this.p4 = obj.data1x3x3 == undefined ? "-" : obj.data1x3x3.value;
                        this.p4_1 = obj.data1x3x3 == undefined ? "-" : obj.data1x3x3.dataName;
                        this.p40 = obj.data2x3x3 == undefined ? "-" : obj.data2x3x3.value;
                        this.p4_10 = obj.data2x3x3 == undefined ? "-" : obj.data2x3x3.dataName;

                        this.state = obj.status == undefined ? "-" : obj.status ;
                        this.time = obj.time == undefined ? '-' : obj.time;
                        this.temperature = obj.data1x8x1 == undefined ? "-" : obj.data1x8x1.value;
                        this.x1 = obj.data1x4x1 == undefined ? "-" : obj.data1x4x1.value;
                        this.x2 = obj.data3x9x1 == undefined ? "-" : obj.data3x9x1.value;

                        this.x3 = obj.data8x5x1 == undefined? "-" : obj.data8x5x1.value;
                        this.x30 = obj.data8x5x1 == undefined? "-" : obj.data8x5x1.dataName;
                        this.x3_1 = obj.data11x5x1 == undefined? "-" : obj.data11x5x1.value;
                        this.x3_10 = obj.data11x5x1 == undefined? "-" : obj.data11x5x1.dataName;

                        this.x4value = obj.data11x6x1 == undefined? "-" : obj.data11x6x1.value;
                        this.x4Name = obj.data11x6x1 == undefined? "-" : obj.data11x6x1.dataName;
                        this.x5value = obj.data11x6x2 == undefined? "-" : obj.data11x6x2.value;
                        this.v5name = obj.data11x6x2 == undefined? "-" : obj.data11x6x2.dataName;
                    }else{
                        this.d1 = "-";
                        this.d4 = "-";
                        this.d8 = "-";
                        this.d10 = "-";
                        this.d2 = "-";
                        this.d5 = "-";
                        this.d9 = "-";
                        this.d11 = "-";
                        this.d7 = "-";
                        this.d7name = "-";
                        this.d6 = "-";
                        this.d6name = "-";
                        this.d71 = "-";
                        this.d71name = "-";
                        this.d61 = "-";
                        this.d61name = "-";
                        this.d72 = "-";
                        this.d72name = "-";
                        this.d62 = "-";
                        this.d62name = "-";
                        this.d73 = "-";
                        this.d73name = "-";
                        this.d63 = "-";
                        this.d63name = "-";

                        this.p1 = "-";
                        this.p2 = "-";
                        this.p2_1 = "-";
                        this.p20 = "-";
                        this.p2_10 = "-";
                        this.p3 = "-";
                        this.p3_1 = "-";
                        this.p30 = "-";
                        this.p3_10 = "-";
                        this.p4 = "-";
                        this.p4_1 = "-";
                        this.p40 = "-";
                        this.p4_10 = "-";

                        this.state = "-";
                        this.time = "-";
                        this.temperature = "-";
                        this.x1 = "-";
                        this.x2 = "-";

                        this.x3 = "-";
                        this.x30 = "-";
                        this.x3_1 = "-";
                        this.x3_10 = "-";
                    }
                };
            }else{
                this.$message.warning('您的浏览器不支持websockit');
            }
        },
        mouseoverEvent(ev) {
            ev.srcElement.style.zIndex = this.num++;
        }
    },
    mounted() {
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData();
    },
    beforeDestroy() {
        this.websockit.close();
    },
    watch: {
        $route(to, from) {
            this.websockit.close();
            this.systemId = to.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = to.fullPath.split('=')[1].split(',')[1];
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.list = [];
            this.number = 0;
            this.initData();
        }
    }
}
</script>

<style lang="scss" scoped>
#realRunningChart{
    .realRunningChart{
		background: url(../../../../../../static/img/bangonglou.jpg) no-repeat 0 0;
		background-size: 100% 100%;
		width: 100%;
		height: 600px;
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-o-border-radius: 5px;
		-moz-border-radius: 5px;
        position: relative;
        top: 20px;
        div.d{
            position: absolute;
            top: 18%;
            background: url(../../../../../../static/img/circle3.png) no-repeat 0 0;
            padding: 4px 10px;
            color: #242424;
            background-size: 100% 100%;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            -o-border-radius: 3px;
        }
        div.dd{
            position: absolute;
            top: 40%;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            -o-border-radius: 3px;
            background: url(../../../../../../static/img/big.png) no-repeat 0 0;

            color: #242424;
            background-size: 100% 100%;
            padding: 4px 10px;
        }
        div.ddd{
            position: absolute;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            -o-border-radius: 3px;
            background: url(../../../../../../static/img/big.png) no-repeat 0 0;
            color: #242424;
            background-size: 100% 100%;
            padding: 4px 10px;
        }
        div.d6{
            background: url(../../../../../../static/img/big.png) no-repeat 0 0;
            color: #242424;
            background-size: 100% 100%;
            padding: 4px 10px;
        }
        div.d7{
            background: url(../../../../../../static/img/big.png) no-repeat 0 0;
            color: #242424;
            background-size: 100% 100%;
            padding: 4px 10px;
        }
        .x1{
            left: 36%;
            top: 18%;
        }
        .x2{
            left: 38%;
            top: 86%;
        }
        .x3{
            right: 34%;
            bottom: 1%;
        }
        .p1{
            left: 16%;
            top: 89%;
        }
        .p2{
            left: 61%;
            top: 72%;
        }
        .d1{
            left: 19%;
        }
        .d2{
            left: 26%;
        }
        .d3{
            left: 28%;
        }
        .d4{
            left: 70.5%;
        }
        .d5{
            left: 78%;
        }
        .d6{
            top: 31% !important;
            left: 56%;
        }
        .d7{
            top: 32% !important;
            left: 7%;
        }
        .d8{
            left: 23%;
        }
        .d9{
            left: 32%;
        }
        .d10{
            left: 82%;
            top: 48% !important;
        }
        .d11{
            left: 88%;
            top: 48% !important;
        }
        .d12{
            left: 61%;
            top: 57% !important;
        }
        .d13{
            left: 66%;
            top: 39%;
        }
        .d14{
            left: 52%;
            top: 48%;
        }
        .placeDiv{
            overflow: hidden;
            font-size: 18px;
            background: #91BDE4;
            display: inline-block;
            padding-right: 20px;
            border-radius: 0 25px 25px 0;
            .placeDiv-l{
                float: left;
                overflow: hidden;
                padding: 10px 0 10px 15px;
                color: #404040;
                .img1{
                    width: 30px;
                    height: 30px;
                    float: left;
                }
                b{
                    display: block;
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    font-weight: 700;
                    margin-left: 5px;
                }
                span{
                    margin-left: 15px;
                    float: left;
                    font-weight: 700;
                    display: block;
                    border-radius: 4px;
                    -webkit-border-radius: 4px;
                    -moz-border-radius: 4px;
                    -o-border-radius: 4px;
                    position: relative;
                    top: 3px;
                }
            }
            .placeDiv-c{
                padding: 10px 0 10px 0px;
                float: left;
                height: 30px;
                margin-left: 40px;
                line-height: 30px;
                overflow: hidden;
                font-weight: 700;
                color: #404040;
                .img1{
                    width: 30px;
                    height: 30px;
                    float: left;
                }
                b{
                    display: block;
                    float: left;
                    font-weight: 700;
                    margin-left: 5px;
                }
                span{
                    display: block;
                    float: left;
                    margin-left: 15px;
                }
            }
            .placeDiv-r{
                float: left;
                margin-left: 40px;
                overflow: hidden;
                padding: 10px 0 10px 0px;
                height: 30px;
                line-height: 30px;
                font-weight: 700;
                color: #404040;
                .img1{
                    width: 30px;
                    height: 30px;
                    float: left;
                }
                b{
                    display: block;
                    float: left;
                    font-weight: 700;
                    margin-left: 5px;
                }
                span{
                    display: block;
                    float: left;
                    margin-left: 15px;
                }
            }
        }
	}
}
</style>
