<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="close"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title>
                Do you really want to delete this employee?
            </v-card-title>

            <v-card-actions>
                <v-spacer />

                <v-btn text @click="close">
                    <span>No</span>
                </v-btn>

                <v-btn text @click="destroy">
                    <span>Yes</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
import deleteDialogMixin from '@/mixins/deleteDialogMixin';

export default {
    name: 'DeleteDialog',

    mixins: [deleteDialogMixin],

    methods: {
        ...mapActions({
            deleteUser: 'users/destroy'
        }),

        async destroy() {
            try {
                await this.deleteUser(this.deletedItemId);

                this.$notify({
                    type: 'success',
                    text: 'User has been deleted'
                });

                this.close();
            } catch (error) {
                console.error(error);

                this.$notify({
                    type: 'error',
                    text: 'Error while deleting the user!'
                });
            }
        }
    }
};
</script>
