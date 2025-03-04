<template>
    <div>
        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="items"
            :items-length="total"
            :loading="loading"
            item-value="id"
            :items-per-page-options="perPageOptions"
            @update:options="doGetItems"
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
                <component
                    :is="field.component || 'span'"
                    v-bind="getColumnAttributes(field, item)"
                >
                    {{ field.value(item) }}
                </component>
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
        </v-data-table-server>
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
            editedItem: null,
            itemToDeleteId: null,
            isAddEditDialogOpened: false,
            perPageOptions: [
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' }
            ],
            page: 1,
            perPage: 10,
            items: [],
            total: 0,
            loading: false
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
                this.loading = true;

                const { rows, count } = await this.getItems({
                    page: this.page,
                    perPage: this.perPage
                });

                this.items = rows;
                this.total = count;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot fetch data');
            } finally {
                this.loading = false;
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
        },

        getColumnAttributes(field, item) {
            const { attributes = {} } = field;

            const preparedAttributes = { ...attributes };

            if (typeof field.color === 'function') {
                preparedAttributes.color = field.color(item);
            }

            return preparedAttributes;
        }
    }
};
</script>
