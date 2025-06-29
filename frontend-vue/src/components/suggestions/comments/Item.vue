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
        </div>

        <div class="text-pre-line"> {{ comment.content }} </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

import getFullImagePath from '@/helpers/getFullImagePath';

export default {
    name: 'CommentItem',

    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    computed: {
        formattedCreatedAt() {
            return dayjs(this.comment.createdAt).format('YYYY-MM-DD HH:mm:ss');
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
