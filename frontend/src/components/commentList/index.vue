<script>
import BaseList from '@/components/list'
import CommentItem from './CommentItem'

import { getCommentList } from '@/apis/comment'

export default {
    name: 'CommentList',
    components: { BaseList, CommentItem },
    props: {
        topic: {
            type: Object,
            required: true
        },
        stats: {
            type: Object,
            default: () => null
        },
        comments: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        requestParams() {
            return {
                topic_type: this.topic.type,
                topic_title: this.topic.title,
                topic_id: this.topic.id
            }
        },
        currentReplyId() {
            return this.$store.getters.replyId
        }
    },
    methods: {
        getCommentList,
        /* 回复评论时 */
        onReply(id) {
            this.$store.dispatch('comment/setReplyId', id)
        },
        /* 刷新评论数据列表 */
        refresh() {
            this.$refs.list.refreshData()
        }
    }
}
</script>

<template>
    <div>
        <div v-if="stats" class="comment-stats">
            <span>{{ stats.label }}</span>
            <span class="comment-stats--count">共{{ stats.total }}条评论</span>
        </div>
        <BaseList
            ref="list"
            emptyText="快来发表留言吧~"
            :requestApi="getCommentList"
            :requestParams="requestParams"
        >
            <template slot-scope="{ list }">
                <ul v-if="list.length !== 0" class="comment-list">
                    <li v-for="comment in list" :key="comment.id">
                        <CommentItem
                            :topic="topic"
                            :topId="comment.id"
                            :comment="comment"
                            :replying="currentReplyId === comment.id"
                            @reply="onReply"
                        />
                    </li>
                </ul>
            </template>
        </BaseList>
    </div>
</template>

<style lang="scss" scoped>
/* 评论列表样式 */
.comment-stats {
    @include text-color(text-muted);
    line-height: $lh-xm;
    font-size: $fz-xm;
    transition: color .3s ease-in-out;
}

.comment-stats {
    margin-bottom: 30px;
}

.comment-stats--count {
    position: relative;
    margin-left: 20px;

    &::before {
        content: '';
        position: absolute;
        top: 6px;
        left: -10px;
        width: 1px;
        height: 12px;
        background-color: $cl-gray-1;
        transform: scaleX(.5);
    }
}
</style>
