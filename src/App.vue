<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        data() {
            return{

            }
        },
        watch: {
            $route(to) {
                if(to.path == "/login") {}else{
                    this.$session.set("expires", window.location.href.split("#/")[1]);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #app{
        height: 100%;
    }
</style>
