<template>
    <v-dialog
        v-model="isDialogOpened"
        max-width="500px"
        @click:outside="close"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title>
                Do you really want to delete this contract?
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
import deleteDialogMixin from '@/mixins/deleteDialogMixin';

import { useContractStore } from '@/stores/contract';

export default {
    name: 'DeleteDialog',

    mixins: [deleteDialogMixin],

    methods: {
        ...mapActions(useContractStore, { deleteContract: 'destroy' }),

        async destroy() {
            try {
                await this.deleteContract(this.deletedItemId);

                this.$toast.success('Contract has been deleted');

                this.onSuccess();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while deleting the contract!');
            }
        }
    }
};
</script>
