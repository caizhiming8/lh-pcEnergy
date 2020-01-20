<template>
    <div id="roomPowerError">
        <div class="roomPowerError">
            <div class="error-left">
                <v-commonTree></v-commonTree>
            </div>
            <div class="error-right">
                22
            </div>
        </div>
    </div>
</template>

<script>
import commonTree from './commonTree';
export default {
    components: {
        'v-commonTree': commonTree
    }
}
</script>

<style lang="scss" scoped>
#roomPowerError{
    .roomPowerError{
        overflow: hidden;
        .error-left{
            float: left;
            width: 10%;
            height: 600px;
            overflow: auto;
            padding-right: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            border-right: 1px solid #ddd;
        }
        .error-right{
            float: left;
            width: 90%;
            height: 600px;
            overflow: auto;
            padding-left: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
        }
    }
}
</style>
