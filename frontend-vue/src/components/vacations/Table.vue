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
                <table-header @refetch-items="getItems" />
            </template>

            <template #[`item.approved`]="{ item }">
                <v-chip :color="getColor(item.approved)" dark>
                    {{ getStatus(item.approved) }}
                </v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
                <v-btn
                    variant="plain"
                    icon="mdi-pencil"
                    :disabled="!isAdmin && item.approved"
                    @click="openEditDialog(item)"
                />

                <v-btn
                    variant="plain"
                    icon="mdi-delete"
                    :disabled="!isAdmin && item.approved"
                    @click="openDeleteDialog(item.id)"
                />
            </template>
        </v-data-table>

        <add-edit-dialog
            :is-opened="!!editedItem"
            :edited-item="editedItem"
            @refetch-items="getItems"
            @close="closeEditDialog"
        />

        <delete-dialog
            :is-opened="!!deletedItemId"
            :deleted-item-id="deletedItemId"
            @refetch-items="getItems"
            @close="closeDeleteDialog"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useVacationStore } from '@/stores/vacation';
import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'VacationsTable',

    components: {
        TableHeader: defineAsyncComponent(
            () => import('@/components/vacations/TableHeader')
        ),
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/vacations/AddEditDialog')
        ),
        DeleteDialog: defineAsyncComponent(
            () => import('@/components/vacations/DeleteDialog')
        )
    },

    extends: BaseTable,

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        headers() {
            const employee = [
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                { title: 'Duration', value: 'duration' },
                { title: 'Status', value: 'approved' },
                { title: 'Actions', value: 'actions', sortable: false }
            ];

            if (this.isAdmin) {
                return [
                    { title: 'First name', value: 'user.firstName' },
                    { title: 'Last name', value: 'user.lastName' },
                    ...employee
                ];
            }

            return employee;
        }
    },

    methods: {
        ...mapActions(useVacationStore, { getItems: 'index' }),

        getStatus(status) {
            return status ? 'Approved' : 'Pending';
        },

        getColor(status) {
            return status ? 'green' : 'orange';
        }
    }
};
</script>
