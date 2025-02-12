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
import { mapGetters, mapActions } from 'vuex';
import tableMixin from '@/mixins/tableMixin';

export default {
    name: 'VacationsTable',

    components: {
        TableHeader: () => import('@/components/vacations/TableHeader'),
        AddEditDialog: () => import('@/components/vacations/AddEditDialog'),
        DeleteDialog: () => import('@/components/vacations/DeleteDialog')
    },

    mixins: [tableMixin],

    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin',
            vacations: 'vacations/items'
        }),

        headers() {
            const employee = [
                { text: 'Start date', value: 'startDate' },
                { text: 'End date', value: 'endDate' },
                { text: 'Duration', value: 'duration' },
                { text: 'Status', value: 'approved' },
                { text: 'Actions', value: 'actions', sortable: false }
            ];

            if (this.isAdmin) {
                return [
                    { text: 'First name', value: 'user.firstName' },
                    { text: 'Last name', value: 'user.lastName' },
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
        ...mapActions({
            getVacations: 'vacations/index'
        }),

        async handleGetVacations() {
            try {
                await this.getVacations();
            } catch (error) {
                console.error(error);
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
