<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="vacations"
            :items-per-page="pagination"
            multi-sort
            class="elevation-1"
        >
            <template #top>
                <table-header />
            </template>

            <template #[`item.approved`]="{ item }">
                <v-chip :color="getColor(item.approved)" dark>
                    {{ getStatus(item.approved) }}
                </v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
                <v-btn
                    icon
                    :disabled="!isAdmin && item.approved"
                    @click="openEditDialog(item)"
                >
                    <span>
                        <v-icon small>mdi-pencil</v-icon>
                    </span>
                </v-btn>

                <v-btn
                    icon
                    :disabled="!isAdmin && item.approved"
                    @click="openDeleteDialog(item.id)"
                >
                    <span>
                        <v-icon small>mdi-delete</v-icon>
                    </span>
                </v-btn>
            </template>
        </v-data-table>

        <add-edit-dialog
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
import { useVacationStore } from '@/stores/vacation';

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

    mixins: [tableMixin],

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        ...mapState(useVacationStore, { vacations: 'items' }),

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

    async created() {
        await this.handleGetVacations();
    },

    methods: {
        ...mapActions(useVacationStore, { getVacations: 'index' }),

        async handleGetVacations() {
            try {
                await this.getVacations();
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of vacations!');
            }
        },

        getStatus(status) {
            return status ? 'Approved' : 'Pending';
        },

        getColor(status) {
            return status ? 'green' : 'orange';
        }
    }
};
</script>
