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
import { mapGetters, mapActions } from 'vuex';

import tableMixin from '@/mixins/tableMixin';

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
        ...mapGetters({
            isAdmin: 'auth/isAdmin',
            contracts: 'contracts/items'
        }),

        headers() {
            const employee = [
                { text: 'Position', value: 'position' },
                { text: 'Start date', value: 'startDate' },
                { text: 'End date', value: 'endDate' },
                {
                    text: 'Days off/year',
                    value: 'vacationDaysPerYear'
                },
                { text: 'Days off', value: 'vacationDays' }
            ];

            if (this.isAdmin) {
                return [
                    { text: 'First name', value: 'user.firstName' },
                    { text: 'Last name', value: 'user.lastName' },
                    ...employee,
                    { text: 'Actions', value: 'actions', sortable: false }
                ];
            }

            return employee;
        }
    },

    async created() {
        await this.handleGetContracts();
    },

    methods: {
        ...mapActions({
            getContracts: 'contracts/index'
        }),

        async handleGetContracts() {
            try {
                await this.getContracts();
            } catch (error) {
                console.error(error);

                // @TODO Restore notification
            }
        }
    }
};
</script>
