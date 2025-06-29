<template>
    <h2> Comments </h2>

    <div v-if="comments.length">
        <comment-item
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
        />
    </div>

    <div v-else>
        <p>No comments found</p>
    </div>

    <v-btn
        v-if="loadMoreEnabled"
        text="Load more comments"
        @click="$emit('load-more')"
    />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'CommentsSection',

    components: {
        CommentItem: defineAsyncComponent(
            () => import('@/components/suggestions/comments/Item')
        )
    },

    props: {
        comments: {
            type: Array,
            required: true
        },

        loadMoreEnabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    emits: ['load-more']
};
</script>
