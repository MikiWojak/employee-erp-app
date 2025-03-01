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
                        Contracts list
                    </v-toolbar-title>

                    <v-spacer />

                    <v-btn
                        v-if="isAdmin"
                        text="New contract"
                        @click="openAddEditDialog(null)"
                    />
                </v-toolbar>
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
            v-if="isAdmin"
            :is-opened="isAddEditDialogOpened"
            :edited-item="editedItem"
            @success="doGetItems"
            @close="closeAddEditDialog"
        />

        <confirmation-modal
            :is-opened="!!itemToDeleteId"
            title="Do you really want to delete this contract?"
            @confirm="doDeleteItem"
            @discard="closeDeleteDialog"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useContractStore } from '@/stores/contract';
import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'ContractsTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/contracts/AddEditDialog')
        ),
        ConfirmationModal: defineAsyncComponent(
            () => import('@/components/modals/ConfirmationModal')
        )
    },

    extends: BaseTable,

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        headers() {
            const employee = [
                { title: 'Position', value: 'position' },
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                {
                    title: 'Days off/year',
                    value: 'vacationDaysPerYear'
                },
                { title: 'Days off', value: 'vacationDays' }
            ];

            if (this.isAdmin) {
                return [
                    { title: 'First name', value: 'user.firstName' },
                    { title: 'Last name', value: 'user.lastName' },
                    ...employee,
                    { title: 'Actions', value: 'actions', sortable: false }
                ];
            }

            return employee;
        }
    },

    methods: {
        ...mapActions(useContractStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        })
    }
};
</script>
