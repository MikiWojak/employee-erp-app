<template>
    <div class="my-2">
        <div>
            <b> {{ comment.user.fullName }} </b>, {{ formattedCreatedAt }}
        </div>

        <div class="text-pre-line"> {{ comment.content }} </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

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
    }
};
</script>

<style scoped>
.text-pre-line {
    white-space: pre-line;
}
</style>
