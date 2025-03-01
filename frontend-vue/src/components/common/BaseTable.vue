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
                        {{ title }}
                    </v-toolbar-title>

                    <v-spacer />

                    <v-btn
                        v-if="isAddButtonIncluded"
                        text="Add"
                        @click="openAddEditDialog(null)"
                    />
                </v-toolbar>
            </template>

            <template
                v-for="(field, index) in customFields"
                :key="index"
                #[`item.${field.name}`]="{ item }"
            >
                <span>
                    {{ field.value(item) }}
                </span>
            </template>

            <template #[`item.actions`]="{ item }">
                <v-btn
                    variant="plain"
                    icon="mdi-pencil"
                    :disabled="areActionButtonsDisabled(item)"
                    @click="openAddEditDialog(item)"
                />

                <v-btn
                    variant="plain"
                    icon="mdi-delete"
                    :disabled="areActionButtonsDisabled(item)"
                    @click="openDeleteDialog(item.id)"
                />
            </template>
        </v-data-table>
    </div>

    <add-edit-dialog
        :is-opened="isAddEditDialogOpened"
        :edited-item="editedItem"
        @success="doGetItems"
        @close="closeAddEditDialog"
    />

    <confirmation-modal
        :is-opened="!!itemToDeleteId"
        :title="deleteConfirmationModalTitle"
        @confirm="doDeleteItem"
        @discard="closeDeleteDialog"
    />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'BaseTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/common/BaseAddEditDialog')
        ),
        ConfirmationModal: defineAsyncComponent(
            () => import('@/components/modals/ConfirmationModal')
        )
    },

    data() {
        return {
            title: 'Table',
            deleteConfirmationModalTitle:
                'Do you really want to delete this item?',
            items: [],
            editedItem: null,
            itemToDeleteId: null,
            isAddEditDialogOpened: false
        };
    },

    computed: {
        isAddButtonIncluded() {
            return true;
        },

        areActionButtonsIncluded() {
            return true;
        },

        baseHeaders() {
            return [];
        },

        pagination() {
            return 10;
        },

        headers() {
            return [
                ...this.baseHeaders,
                ...(this.areActionButtonsIncluded
                    ? [{ title: 'Actions', value: 'actions', sortable: false }]
                    : [])
            ];
        },

        customFields() {
            return [];
        }
    },

    async created() {
        await this.doGetItems();
    },

    methods: {
        // eslint-disable-next-line no-unused-vars
        areActionButtonsDisabled(item) {
            return false;
        },

        async getItems() {
            return Promise.resolve({ rows: [], count: 0 });
        },

        async doGetItems() {
            try {
                const { rows } = await this.getItems();

                this.items = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot fetch data');
            }
        },

        async deleteItem() {
            return Promise.resolve();
        },

        async doDeleteItem() {
            if (!this.itemToDeleteId) {
                return;
            }

            try {
                await this.deleteItem(this.itemToDeleteId);

                await this.doGetItems();

                this.$toast.success('Item has been deleted');

                this.closeDeleteDialog();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while deleting the item!');
            }
        },

        openAddEditDialog(editedItem = null) {
            this.isAddEditDialogOpened = true;
            this.editedItem = editedItem ? { ...editedItem } : null;
        },

        closeAddEditDialog() {
            this.isAddEditDialogOpened = false;
        },

        openDeleteDialog(id) {
            this.itemToDeleteId = id;
        },

        closeDeleteDialog() {
            this.itemToDeleteId = null;
        }
    }
};
</script>
