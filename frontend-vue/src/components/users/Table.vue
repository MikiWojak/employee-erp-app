<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="pagination"
            multi-sort
            class="elevation-1"
        >
            <template #top>
                <v-toolbar flat>
                    <v-toolbar-title class="text-h6 font-weight-bold">
                        Employees list
                    </v-toolbar-title>

                    <v-spacer />

                    <v-btn
                        text="New employee"
                        @click="openAddEditDialog(null)"
                    />
                </v-toolbar>
            </template>

            <template #[`item.vacationLeft`]="{ item }">
                <v-chip dark :color="getVacationLeftColor(item)">
                    {{ getVacationLeft(item) }}
                </v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
                <v-btn
                    variant="plain"
                    icon="mdi-pencil"
                    @click="openAddEditDialog(item)"
                />

                <v-btn
                    variant="plain"
                    icon="mdi-delete"
                    @click="openDeleteDialog(item.id)"
                />
            </template>
        </v-data-table>

        <add-edit-dialog
            :is-opened="isAddEditDialogOpened"
            :edited-item="editedItem"
            @success="doGetItems"
            @close="closeAddEditDialog"
        />

        <confirmation-modal
            :is-opened="!!itemToDeleteId"
            title="Do you really want to delete this user?"
            @confirm="doDeleteItem"
            @discard="closeDeleteDialog"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useUserStore } from '@/stores/user';
import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'UsersTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        ),
        ConfirmationModal: defineAsyncComponent(
            () => import('@/components/modals/ConfirmationModal')
        )
    },

    extends: BaseTable,

    computed: {
        ...mapState(useUserStore, { users: 'items' }),

        headers() {
            return [
                { title: 'First name', value: 'firstName' },
                { title: 'Last name', value: 'lastName' },
                { title: 'Date of birth', value: 'dateOfBirth' },
                { title: 'Email', value: 'email' },
                { title: 'Days off left', value: 'vacationLeft' },
                { title: 'Actions', value: 'actions', sortable: false }
            ];
        }
    },

    methods: {
        ...mapActions(useUserStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        getVacationLeft(item) {
            return item.vacationDaysSum - item.vacationDaysUsed;
        },

        getVacationLeftColor(item) {
            const value = this.getVacationLeft(item);

            if (value > 0) {
                return 'green';
            }

            if (value === 0) {
                return 'orange';
            }

            return 'red';
        }
    }
};
</script>
