<template>
    <div class="my-2">
        <div class="d-flex align-center ga-2">
            <v-avatar size="36px">
                <v-img
                    v-if="comment.user?.avatar"
                    alt="Icon"
                    :src="getFullImagePath(comment.user.avatar)"
                />
                <v-icon v-else icon="mdi-account-circle" size="36px" />
            </v-avatar>

            <div>
                <div>
                    <b> {{ comment.user.fullName }} </b>
                </div>
                <div>
                    {{ formattedCreatedAt }}
                </div>
            </div>

            <div class="d-flex align-center">
                <v-btn
                    v-if="isAuthor"
                    variant="plain"
                    icon="mdi-pencil"
                    @click="$emit('edit', comment)"
                />

                <v-btn
                    v-if="isAuthor"
                    variant="plain"
                    icon="mdi-delete"
                    color="red"
                    @click="$emit('delete', comment.id)"
                />
            </div>
        </div>

        <div class="text-pre-line"> {{ comment.content }} </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import getFullImagePath from '@/helpers/getFullImagePath';

export default {
    name: 'CommentItem',

    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    emits: ['edit', 'delete'],

    computed: {
        ...mapState(useAuthStore, ['loggedUser']),

        formattedCreatedAt() {
            return dayjs(this.comment.createdAt).format('YYYY-MM-DD HH:mm:ss');
        },

        isAuthor() {
            return this.comment.userId === this.loggedUser?.id;
        }
    },

    methods: {
        getFullImagePath
    }
};
</script>

<style scoped>
.text-pre-line {
    white-space: pre-line;
}
</style>
