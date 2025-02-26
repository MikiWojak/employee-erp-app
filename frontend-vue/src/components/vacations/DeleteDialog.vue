<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="close"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title>
                Do you really want to delete this vacation?
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
import { mapActions } from 'pinia';

import { useVacationStore } from '@/stores/vacation';
import BaseDeleteDialog from '@/components/common/BaseDeleteDialog';

export default {
    name: 'DeleteDialog',

    extends: BaseDeleteDialog,

    methods: {
        ...mapActions(useVacationStore, { deleteVacation: 'destroy' }),

        async destroy() {
            try {
                await this.deleteVacation(this.deletedItemId);

                this.$toast.success('Vacation has been deleted');

                this.onSuccess();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while deleting the vacation!');
            }
        }
    }
};
</script>
