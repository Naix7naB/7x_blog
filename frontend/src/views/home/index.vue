<script>
import Banner from './components/banner'
import Sidebar from './components/sidebar'
import ArticleList from '@/components/articleList'

export default {
    name: 'HomePage',
    components: { Banner, Sidebar, ArticleList },
    data() {
        return {
            filter: null
        }
    },
    methods: {
        setFilter(filter) {
            this.filter = filter
        }
    },
    created() {
        this.$bus.$on('setFilter', this.setFilter)
    }
}
</script>

<template>
    <div>
        <Banner />
        <div class="home-main">
            <div class="home-sidebar">
                <Sidebar />
            </div>
            <div class="home-content">
                <ArticleList :filter="filter" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* 主页样式 */
.home-main {
    display: flex;
    justify-content: center;
    width: 90%;
    margin: 80px auto 0;
    padding: 40px;
}

.home-sidebar {
    width: 30%;
    max-width: 320px;
    margin-right: 40px;
}

.home-content {
    width: 70%;
    max-width: 980px;
    min-height: calc(100vh - 160px);
}

/* 媒体查询样式 */
@media screen and (max-width: 1000px) {
    .home-main {
        flex-direction: column;
        width: 100%;
    }

    .home-sidebar {
        width: 100%;
        max-width: 100%;
        margin-right: 0;
        margin-bottom: 40px;
    }

    .home-content {
        width: 100%;
        max-width: 100%;
    }
}
</style>
