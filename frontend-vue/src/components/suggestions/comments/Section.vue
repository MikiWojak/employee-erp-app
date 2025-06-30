<template>
    <div class="d-flex justify-space-between align-center">
        <h2> Comments </h2>

        <v-btn
            text="Add a comment"
            color="green"
            prepend-icon="mdi-plus-circle-outline"
            :disabled="addEditDeleteDisabled"
            @click="$emit('add-edit')"
        />
    </div>

    <div v-if="comments.length">
        <comment-item
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :edit-delete-disabled="addEditDeleteDisabled"
            @edit="doAddEdit"
            @delete="doDelete"
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
        },

        addEditDeleteDisabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    emits: ['load-more', 'add-edit', 'delete'],

    methods: {
        doAddEdit(editedItem = null) {
            this.$emit('add-edit', editedItem);
        },

        doDelete(id) {
            this.$emit('delete', id);
        }
    }
};
</script>
