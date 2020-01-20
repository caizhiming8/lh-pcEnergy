<template>
    <div id="crewRunReal">
        <!-- <div class="crewRunReal">
			<div class="placeDiv">
			    <div class="placeDiv-l">
                    <img src="../../../../../static/img/status.png">
			        <b>通讯状态:</b>
			        <span v-if="state==1">正常</span>
                    <span v-if="state==0">离线</span>
			        <span v-if="state=='-'">-</span>
			    </div>
			    <div class="placeDiv-c">
                    <img src="../../../../../static/img/time.png">
			        <b>时间:</b>
			        <span>{{time}}</span>
			    </div>
			    <div class="placeDiv-r">
                    <img src="../../../../../static/img/template.png" >
			        <b>室外温度:</b>
			        <span>{{temperature}}</span>
			    </div>
			</div>
			<div class="d4 d">{{d4name}}:{{d4}}<br>{{d6name}}:{{d6}}</div>
			<div class="d5 d">{{d7name}}:{{d7}}<br>{{d8name}}:{{d8}}</div>
			<div class="d10 d">{{d10}}</div>
			<div class="d11 d">{{d11}}</div>
			<div class="d12 d">{{d12}}</div>
			<div class="d13 d">{{d13}}</div>
			<div class="d14 d">{{d14name}}: {{d14}}<br>{{d15name}}: {{d15}}</div>
			<div class="d17 d">{{d17}}</div>
			<div class="d18 d">{{d18}}</div>
			<div class="d19 d">{{d19}}</div>
			<div class="d20 d">{{d20}}</div>
			<div class="d21 d">{{d21}}</div>
			<div class="d22 d">冷却塔运行状态：{{d22}}</div>
			<div class="d23 d">{{d23}}</div>
			<div class="d24 d">{{d24}}</div>
			<div class="d25 d">{{d25name}}: {{d25}}<br>{{d26name}}: {{d26}}</div>
			<div class="d27 d">{{d27name}}: {{d27}}<br>{{d28name}}: {{d28}}</div>
        </div> -->

        <div class="box1" v-if="buildingId==201"></div>
        <div class="box2" v-if="buildingId==202"></div>
    </div>
</template>

<script>
import api from '../../../../api/api.js';
export default {
	data() {
		return{
			buildingId:"",
			systemId:"",
			subsystemId:"",

			d1: '0',
			d2: '0',
			d3: '0',
			d4: '0',
			d5: '0',
			d6: '0',
			d7: '0',
			d8: '0',
			d9: '0',
			d10: '0',
			d11: '0',
			d12: '0',
			d13:'0',

			d14: '0',
			d15: '0',
			d16: '0',
			d17: '0',
			d18: '0',
			d19: '0',
			d20: '0',
			d21: '0',
			d22: '0',
			d23: '0',
			d24: '0',
			d25: '0',
			d26: '0',
			d27: '0',
			d28: '0',

			d4name:"",
			d5name:"",
			d6name:"",
			d7name:"",
			d8name:"",
			d9name:"",
			d14name:"",
			d15name:"",
			d16name:"",
			d25name:"",
			d26name:"",
			d27name:"",
			d28name:"",
			state: 0,
			websockit: '',
			time: '',
			temperature: '',
            apis: ''

		}
	},
	methods:{
		initData() {
            this.apis = window.location.href.split("http://")[1].split(":")[0];
            this.websockits();
		},
        websockits() {
            if ("WebSocket" in window) {
		        let ws =  new WebSocket(`ws://${this.apis}:8081/BMPlatServers/myWebSocket/${this.systemId}/${this.subsystemId}/${this.buildingId}`);
		        this.websockit = ws;
		        ws.onmessage = (evt)=>{
		            let obj = JSON.parse(evt.data);
	                this.temperature = obj.data1x1x1 == undefined ? "-" : obj.data1x1x1.value;
					this.state = obj.status == undefined ? "-" : obj.status ;
					this.time = obj.time == undefined ? "-" : obj.time;
					this.d4 = obj.data1x4x1 == undefined ? "-" : obj.data1x4x1.value;
					this.d4name = obj.data1x4x1 == undefined ? "-" : obj.data1x4x1.dataName;
					this.d5 = obj.data2x4x1 == undefined ? "-" : obj.data2x4x1.value;
					this.d5name = obj.data2x4x1 == undefined ? "-" : obj.data2x4x1.dataName;
					this.d6 = obj.data3x4x1 == undefined ? "-" : obj.data3x4x1.value;
					this.d6name = obj.data3x4x1 == undefined ? "-" : obj.data3x4x1.dataName;
					this.d7 = obj.data7x13x1 == undefined ? '-' : obj.data7x13x1.value == 1 ? '运行' : '停止';
					this.d7name = obj.data7x13x1 == undefined ? "-" : obj.data7x13x1.dataName;
					this.d8 = obj.data1x13x1 == undefined ? "-" : obj.data1x13x1.value;
					this.d8name = obj.data1x13x1 == undefined ? "-" : obj.data1x13x1.dataName;
					this.d9 = obj.data9x5x1 == undefined ? "-": obj.data9x5x1.value;
					this.d9name = obj.data9x5x1 == undefined ? "-" : obj.data9x5x1.dataName;
					this.d10 = obj.data4x5x1 == undefined ? "-" : obj.data4x5x1.value;
					this.d11 = obj.data5x5x1 == undefined ? "-" : obj.data5x5x1.value;
					this.d12 = obj.data6x5x1 == undefined ? "-" : obj.data6x5x1.value;
					this.d13 = obj.data7x5x1 == undefined ? "-" : obj.data7x5x1.value;

					this.d14 = obj.data7x14x1 == undefined ? "-" : obj.data7x14x1.value == 1 ? '运行':'停止';
					this.d14name = obj.data7x14x1 == undefined ? "-" : obj.data7x14x1.dataName;
					this.d15 = obj.data1x14x1 == undefined ? "-" : obj.data1x14x1.value;
					this.d15name = obj.data1x14x1 == undefined ? "-" : obj.data1x14x1.dataName;
					this.d16 = obj.data9x6x1 == undefined ? "-" : obj.data9x6x1.value;
					this.d16name = obj.data9x6x1 == undefined ? "-" : obj.data9x6x1.dataName;
					this.d17 = obj.data4x6x1 == undefined ? "-" : obj.data4x6x1.value;
					this.d18 = obj.data5x6x1 == undefined ? "-" : obj.data5x6x1.value;
					this.d19 = obj.data6x6x1 == undefined ? "-" : obj.data6x6x1.value;
					this.d20 = obj.data7x6x1 == undefined ? "-" : obj.data7x6x1.value;
					this.d21 = obj.data10x7x1 == undefined ? "-" : obj.data10x7x1.value;
					this.d22 = obj.data3x8x1 == undefined ? "-" : obj.data3x8x1.value == 1 ? '运行' : '停止';
					this.d23 = obj.data1x9x1 == undefined ? "-" : obj.data1x9x1.value;
					this.d24 = obj.data1x10x1 == undefined ? "-" : obj.data1x10x1.value=="1"?"开":"关";
					this.d25 = obj.data3x11x1 == undefined ? "-" : obj.data3x11x1.value=="1"?"开":"关";
					this.d25name = obj.data3x11x1 == undefined ? "-" : obj.data3x11x1.dataName;
					this.d26 = obj.data1x11x1 == undefined ? "-" : obj.data1x11x1.value;
					this.d26name = obj.data1x11x1 == undefined ? "-" : obj.data1x11x1.dataName;
					this.d27 = obj.data5x12x1 == undefined ? "-" : obj.data5x12x1.value;
					this.d27name = obj.data5x12x1 == undefined ? "-" : obj.data5x12x1.dataName;
					this.d28 = obj.data7x12x1 == undefined ? "-" : obj.data7x12x1.value;
					this.d28name = obj.data7x12x1 == undefined ? "-" : obj.data7x12x1.dataName;
		        };
		    }else{
		        this.$message.warning('您的浏览器不支持websockit');
		    }
        }
	},
	mounted(){
		this.systemId = window.location.href.split('=')[1].split(',')[0];
		this.subsystemId = window.location.href.split("=")[1].split(",")[1];
		this.buildingId = window.location.href.split("=")[1].split(',')[2];
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
	        this.initData();
	    }
	}
}
</script>

<style lang="scss" scoped>
	#crewRunReal{
		.crewRunReal{
			background:url(../../../../../static/img/conditioner.png) no-repeat 0 0;
			background-size:100% 100%;
			height:800px;
			position: relative;
            padding-top: 24px;
			div.d{
			    position: absolute;
			    background: url(../../../../../static/img/circle3.png) no-repeat 0 0;
                background-size: 100% 100%;
			    padding: 10px 15px;
                -webkit-border-radius: 3px;
               -moz-border-radius: 3px;
			    border-radius: 3px;
			    color: #242424;
			}
			.d1{
			    left: 13%;
				top: 9%;
			}
			.d2{
			    left: 39%;
				top: 9%;
			}
			.d3{
			    left: 51%;
				top: 9%;
			}
			.d4{
			    left: 44%;
				top: 71%;
			}
			.d5{
			    left: 13%;
				top: 55%;
			}
			.d10{
			    left: 36%;
				top: 27%;
			}
			.d11{
			    left: 42%;
				top: 27%;
			}
			.d12{
			    left: 24%;
				top: 71%;
			}
			.d13{
			    left: 30.8%;
				top: 71%;
			}
			.d14{
			    left: 72%;
				top: 46%;
			}
			.d17{
			    left: 74%;
				top: 26%;
			}
			.d18{
			    left: 86%;
				top: 30%;
			}
			.d19{
			    left: 71%;
				top:7%;
			}
			.d20{
			    left: 74%;
				top:18%;
			}
			.d21{
			    left: 87%;
				top:90%;
			}
			.d22{
			    left: 93%;
				top:1%;
			}
			.d23{
			    left: 93%;
				top:89%;
			}
			.d24{
			    left: 95.5%;
				top:67%;
			}
			.d25{
			    left:0%;
				top:39%;
			}
			.d27{
			    left:8%;
				top:73%;
			}
			.placeDiv{
			    overflow: hidden;
			    font-size: 18px;
			    background: #91BDE4;
                color: #404040;
                -webkit-border-radius: 0 25px 25px 0;
                -moz-border-radius: 0 25px 25px 0;
                border-radius: 0 25px 25px 0;
                display: inline-block;
                padding-right: 50px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
			    .placeDiv-l{
			        float: left;
			        overflow: hidden;
			        padding: 10px 0 10px 15px;
                    img{
                        float: left;
                        width: 30px;
                        height: 30px;
                        display: block;
                    }
			        b{
			            display: block;
			            float: left;
			            height: 30px;
                        margin-left: 10px;
			            line-height: 30px;
			            font-weight: 700;
			        }
			        span{
			            margin-left: 10px;
			            float: left;
			            display: block;
                        font-size: 18px;
                        font-weight: bold;
                        position: relative;
                        top: 3px;
			        }
			    }
			    .placeDiv-c{
			        padding: 10px 0 10px 15px;
			        float: left;
			        height: 30px;
			        margin-left: 60px;
			        line-height: 30px;
			        overflow: hidden;
			        font-weight: 700;
                    img{
                        display: block;
                        float: left;
                        width: 30px;
                        height: 30px;
                    }
			        b{
			            display: block;
			            float: left;
			            font-weight: 700;
                        margin-left: 10px;
			        }
			        span{
			            display: block;
			            float: left;
			            margin-left: 10px;
			        }
			    }
			    .placeDiv-r{
			        float: left;
			        margin-left: 60px;
			        overflow: hidden;
			        padding: 10px 0 10px 15px;
			        height: 30px;
			        line-height: 30px;
			        font-weight: 700;
                    img{
                        display: block;
                        float: left;
                        width: 30px;
                        height: 30px;
                    }
			        b{
			            display: block;
			            float: left;
			            font-weight: 700;
                        margin-left: 10px;
			        }
			        span{
			            display: block;
			            float: left;
			            margin-left: 10px;
			        }
			    }
			}
		}
        .box1{
            background: url(../../../../../static/img/airzonghelou.png) no-repeat 0 0;
            background-size: 100% 100%;
            height: 800px;
        }
        .box2{
            background: url(../../../../../static/img/airmenzhenlou.png) no-repeat 0 0;
            background-size: 100% 100%;
            height: 800px;
        }
	}
</style>
