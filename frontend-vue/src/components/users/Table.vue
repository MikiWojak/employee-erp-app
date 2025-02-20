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
import { defineAsyncComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

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
        ...mapGetters({
            users: 'users/items'
        }),

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
        ...mapActions({
            getUsers: 'users/index'
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
