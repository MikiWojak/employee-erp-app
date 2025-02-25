<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="users"
            :items-per-page="pagination"
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
                <v-btn
                    variant="plain"
                    icon="mdi-pencil"
                    @click="openEditDialog(item)"
                />

                <v-btn
                    variant="plain"
                    icon="mdi-delete"
                    @click="openDeleteDialog(item.id)"
                />
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

import { useUserStore } from '@/stores/user';
import tableMixin from '@/mixins/tableMixin';

export default {
    name: 'UsersTable',

    components: {
        TableHeader: defineAsyncComponent(
            () => import('@/components/users/TableHeader')
        ),
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        ),
        DeleteDialog: defineAsyncComponent(
            () => import('@/components/users/DeleteDialog')
        )
    },

    mixins: [tableMixin],

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

    async created() {
        await this.handleGetUsers();
    },

    methods: {
        ...mapActions(useUserStore, { getUsers: 'index' }),

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
        },

        async handleGetUsers() {
            try {
                await this.getUsers();
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        }
    }
};
</script>
