<template>
    <h2> Comments </h2>

    <comment-item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
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
        }
    }
};
</script>
