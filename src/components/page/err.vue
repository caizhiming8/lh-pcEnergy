<template>
    <div id="err" ref="refs">
        <img class="img1" src="../../../static/img/err.jpg">
        <div class="placeImg">
            <img class="img2" src="../../../static/img/errMesage.jpg">
        </div>
        <div class="btn">
            <el-button round type="success" @click="goHome">回到主页</el-button>
            <el-button round type="success" @click="goBack">（{{time}} s）返回页面</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            wid: 0,
            time: 10,
            j: 0
        }
    },
    methods: {
        // 初始化placeDom的width
        initDom() {
            let wid = document.body.clientWidth || document.documentElement.clientWidth;
            document.querySelector('#err .placeImg').style.width = wid + 'px';
            this.wid = wid;

            // 倒计时按钮
            let timer = setInterval(()=>{
                if(this.time == 0) {
                    clearInterval(timer);
                }else{
                    this.time--;
                }
            }, 1000);
        },
        // 页面不见了字体滚动
        initData() {
            let Dom = document.querySelector('#err .placeImg img');
            let i = -500;
            let timer = setInterval(()=>{
                if(i <= Number(this.wid)) {
                    Dom.style.left = i + 'px';
                    i++;
                }else{
                    i = -500;
                }
            }, 3);
        },
        goHome() {
            this.$router.push('/');
        },
        goBack() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.initDom();
        this.initData();
    }
}
</script>

<style lang="scss" scoped>
#err{
    img.img1{
        width: 300px;
        height: 325.8px;
        display: block;
        margin: 100px auto 0;
    }
    .placeImg{
        position: relative;
        width: 100%;
        height: 100px;
        overflow: hidden;
        img.img2{
            position: absolute;
            left: -500px;
            top: 0;
            width: 500px;
            height: 100%;
        }
    }
    .btn{
        text-align: center;
    }
}
</style>
