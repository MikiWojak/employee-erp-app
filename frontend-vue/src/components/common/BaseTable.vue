<template>
    <div>
        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="computedHeaders"
            :items="items"
            :items-length="total"
            :loading="loading"
            item-value="id"
            :items-per-page-options="perPageOptions"
            @update:options="doGetItems"
        >
            <template #top>
                <div>
                    <h1>{{ tableOptions.title }}</h1>
                </div>

                <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center w-50">
                        <v-text-field
                            v-model="search"
                            prepend-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            @update:model-value="doSearch"
                        />
                    </div>

                    <v-btn
                        v-if="computedTableOptions.isAddButtonIncluded"
                        text="Add"
                        color="green"
                        prepend-icon="mdi-plus-circle-outline"
                        @click="openAddEditDialog(null)"
                    />
                </div>
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
                    color="red"
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
        :title="tableOptions.deleteConfirmationModalTitle"
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
            page: 1,
            perPage: 10,
            search: '',
            items: [],
            total: 0,
            loading: false,
            searchTimer: null,
            editedItem: null,
            itemToDeleteId: null,
            isAddEditDialogOpened: false,
            tableOptions: {
                title: 'Table',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this item?'
            },
            perPageOptions: [
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' }
            ]
        };
    },

    computed: {
        computedTableOptions() {
            return {
                isAddButtonIncluded: true,
                areActionButtonsIncluded: true
            };
        },

        customFields() {
            return [];
        },

        headers() {
            return [];
        },

        computedHeaders() {
            return [
                ...this.headers,
                ...(this.computedTableOptions.areActionButtonsIncluded
                    ? [{ title: 'Actions', value: 'actions', sortable: false }]
                    : [])
            ];
        }
    },

    methods: {
        // eslint-disable-next-line no-unused-vars
        areActionButtonsDisabled(item) {
            return false;
        },

        getColumnAttributes(field, item) {
            const { attributes = {} } = field;

            const preparedAttributes = { ...attributes };

            if (typeof field.color === 'function') {
                preparedAttributes.color = field.color(item);
            }

            return preparedAttributes;
        },

        async getItems() {
            return Promise.resolve({ rows: [], count: 0 });
        },

        async doGetItems() {
            try {
                this.loading = true;

                const { rows, count } = await this.getItems({
                    page: this.page,
                    perPage: this.perPage,
                    search: this.search
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

        async doSearch() {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
                this.searchTimer = null;
            }

            this.loading = true;

            this.searchTimer = setTimeout(async () => {
                await this.doGetItems();

                this.loading = false;
            }, 1000);
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
