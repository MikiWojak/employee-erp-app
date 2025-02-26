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

import { useUserStore } from '@/stores/user';
import BaseTable from '@/components/common/BaseTable';

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

    async created() {
        await this.getItems();
    },

    methods: {
        ...mapActions(useUserStore, ['index']),

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

        async getItems() {
            try {
                const { rows } = await this.index();

                this.items = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of users!');
            }
        }
    }
};
</script>
