<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="users"
            :items-per-page="pagination"
            :mobile-breakpoint="breakpoint"
            multi-sort
            class="elevation-1"
        >
            <template #top>
                <table-header />
            </template>

            <template #[`item.vacationLeft`]="{ item }">
                <v-chip dark :color="getVacationLeftColor(item)">
                    {{ getVacationLeft(item) }}
                </v-chip>
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
import { mapGetters } from 'vuex';
import tableMixin from '@/mixins/tableMixin';
import breakpointMixin from '@/mixins/breakpointMixin';

export default {
    components: {
        TableHeader: () => import('@/components/users/TableHeader'),
        AddEditDialog: () => import('@/components/users/AddEditDialog'),
        DeleteDialog: () => import('@/components/users/DeleteDialog')
    },

    mixins: [tableMixin, breakpointMixin],

    computed: {
        ...mapGetters({
            users: 'users/items'
        }),

        headers() {
            return [
                { text: 'First name', value: 'firstName' },
                { text: 'Last name', value: 'lastName' },
                { text: 'Date of birth', value: 'dateOfBirth' },
                { text: 'Email', value: 'email' },
                { text: 'Days off left', value: 'vacationLeft' },
                { text: 'Actions', value: 'actions', sortable: false }
            ];
        }
    },

    methods: {
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
