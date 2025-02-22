<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="contracts"
            :items-per-page="pagination"
            multi-sort
            class="elevation-1"
        >
            <template #top>
                <table-header />
            </template>

            <template #[`item.actions`]="{ item }">
                <v-btn icon @click="openEditDialog(item)">
                    <span>
                        <v-icon small>mdi-pencil</v-icon>
                    </span>
                </v-btn>

                <v-btn icon @click="openDeleteDialog(item.id)">
                    <span>
                        <v-icon small>mdi-delete</v-icon>
                    </span>
                </v-btn>
            </template>
        </v-data-table>

        <add-edit-dialog
            v-if="isAdmin"
            :is-opened="!!editedItem"
            :edited-item="editedItem"
            @close="closeEditDialog"
        />

        <delete-dialog
            :is-opened="!!deletedItemId"
            :deleted-item-id="deletedItemId"
            @close="closeDeleteDialog"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import tableMixin from '@/mixins/tableMixin';
import { useAuthStore } from '@/stores/auth';
import { useContractStore } from '@/stores/contract';

export default {
    name: 'ContractsTable',

    components: {
        TableHeader: defineAsyncComponent(
            () => import('@/components/contracts/TableHeader')
        ),
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/contracts/AddEditDialog')
        ),
        DeleteDialog: defineAsyncComponent(
            () => import('@/components/contracts/DeleteDialog')
        )
    },

    mixins: [tableMixin],

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),
        ...mapState(useContractStore, { contracts: 'items' }),

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

    async created() {
        await this.handleGetContracts();
    },

    methods: {
        ...mapActions(useContractStore, {
            getContracts: 'index'
        }),

        async handleGetContracts() {
            try {
                await this.getContracts();
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of contracts!');
            }
        }
    }
};
</script>
