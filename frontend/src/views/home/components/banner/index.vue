<script>
import About from './About'
import Wave from './Wave'

const BG_IMAGE = process.env.VUE_APP_AI_IMAGE_API_PATH

export default {
    name: 'Banner',
    components: { About, Wave },
    data() {
        return {
            banner: null,
            background: BG_IMAGE
        }
    },
    methods: {
        /* 滚动值内容区域 */
        jumpEnter() {
            const offset = this.banner.clientHeight
            this.$bus.$emit('scrollTo', { offset })
        },
        /* 每十分钟刷新背景图片 */
        refreshImageInterval(delay = 600 * 1000) {
            return setInterval(() => {
                const timestamp = Date.now()
                this.background = `${BG_IMAGE}/?timestamp=${timestamp}`
            }, delay)
        }
    },
    mounted() {
        this.banner = this.$refs.banner
        window.addEventListener('load', () => {
            window.$timer = this.refreshImageInterval()
        })
        window.addEventListener('beforeunload', () => {
            clearInterval(window.$timer)
            window.$timer = null
        })
    }
}
</script>

<template>
    <section ref="banner" class="banner">
        <div class="banner-background">
            <el-image class="is-background" fit="cover" :src="background" />
        </div>
        <div class="banner-about">
            <About />
        </div>
        <div class="banner-wave">
            <Wave />
        </div>
        <div class="banner-button" @click="jumpEnter">
            <fa-icon
                bounce
                size="3x"
                icon="fa-solid fa-caret-down"
                style="--fa-animation-duration: 2s"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
/* 网站介绍页面样式 */
.banner {
    position: relative;
    color: $cl-light-1;
    background-color: transparent;
}

.banner-background {
    height: 100vh;
}

.banner-about {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 800px;
    transform: translate(-50%, -50%);
}

.banner-wave {
    z-index: 9;
    position: absolute;
    bottom: -1px;
    width: 100%;
    height: 10%;
}

.banner-button {
    z-index: 10;
    position: absolute;
    bottom: 6%;
    left: 50%;
    color: $cl-light-5;
    transform: translateX(-50%);
    cursor: pointer;
}

/* 媒体查询样式 */
@media screen and (max-width: 1000px) {
    .banner-about {
        min-width: 0;
    }
}
</style>
