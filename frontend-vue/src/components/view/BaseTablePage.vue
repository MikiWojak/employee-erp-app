<template>
    <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="computedHeaders"
        :items="items"
        :items-length="total"
        :loading="loading"
        item-value="id"
        :items-per-page-options="perPageOptions"
        mobile-breakpoint="md"
        @update:options="doGetItems"
    >
        <template #top>
            <div>
                <div>
                    <h1>{{ tableOptions.title }}</h1>
                </div>

                <div
                    class="d-flex flex-column-reverse flex-md-row justify-space-between align-start align-md-center ga-4"
                >
                    <div
                        v-if="tableOptions.searchBar"
                        class="d-flex align-center w-100 w-md-50"
                    >
                        <v-text-field
                            v-model="search"
                            prepend-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            @update:model-value="doSearch"
                        />
                    </div>

                    <v-btn
                        v-if="tableOptions.isAddButtonIncluded"
                        :text="tableOptions.addButtonText"
                        color="green"
                        prepend-icon="mdi-plus-circle-outline"
                        @click="onAddButtonClick(null)"
                    />
                </div>
            </div>

            <v-tabs v-if="tabs.length" v-model="selectedTab" class="mt-2">
                <v-tab
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :value="tab.value"
                >
                    {{ tab.label }}
                </v-tab>
            </v-tabs>
        </template>

        <template #[`item.icon`]="{ item }">
            <v-avatar size="36px">
                <v-img
                    v-if="getIcon(item)"
                    alt="Icon"
                    :src="getFullImagePath(getIcon(item))"
                />
                <v-icon v-else icon="mdi-account-circle" size="36px" />
            </v-avatar>
        </template>

        <template
            v-for="(field, index) in customFields"
            :key="`tab-${index}`"
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
                v-for="(button, index) in additionalActionButtons"
                :key="`action-button-${item.id}-${index}`"
                v-bind="button.props(item)"
                @click="button.action(item)"
            />

            <v-btn
                variant="plain"
                icon="mdi-pencil"
                :disabled="areActionButtonsDisabled(item)"
                @click="onAddButtonClick(item)"
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

    <add-edit-dialog
        :is-opened="isAddEditDialogOpened"
        :edited-item="editedItem"
        @success="doGetItems"
        @close="closeAddEditDialog"
    />

    <confirmation-modal
        :is-opened="!!itemToDeleteId"
        :title="tableOptions.deleteConfirmationModalTitle"
        :loading="confirmationModalLoading"
        @confirm="doDeleteItem"
        @discard="closeDeleteDialog"
    />
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { StatusCodes as HTTP } from 'http-status-codes';

import getFullImagePath from '@/helpers/getFullImagePath';

export default {
    name: 'BaseTablePage',

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
            confirmationModalLoading: false,
            isAddEditDialogOpened: false,
            perPageOptions: [
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' }
            ],
            selectedTab: null
        };
    },

    computed: {
        tableOptions() {
            const defaultTableOptions = {
                title: 'Table',
                searchBar: true,
                deleteConfirmationModalTitle:
                    'Do you really want to delete this item?',
                addButtonText: 'Add',
                isAddButtonIncluded: true,
                areActionButtonsIncluded: true,
                actionsMinWidth: '150px'
            };

            return {
                ...defaultTableOptions,
                ...this.customTableOptions
            };
        },

        customTableOptions() {
            return {};
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
                ...(this.tableOptions.areActionButtonsIncluded
                    ? [
                          {
                              title: 'Actions',
                              value: 'actions',
                              sortable: false,
                              minWidth: this.tableOptions.actionsMinWidth
                          }
                      ]
                    : [])
            ];
        },

        tabs() {
            return [];
        },

        additionalIndexParams() {
            return {};
        },

        additionalActionButtons() {
            return [];
        }
    },

    methods: {
        getFullImagePath,

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
                    ...this.additionalIndexParams,
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
                this.confirmationModalLoading = true;

                await this.deleteItem(this.itemToDeleteId);

                await this.doGetItems();

                this.$toast.success('Item has been deleted');

                this.confirmationModalLoading = false;

                this.closeDeleteDialog();
            } catch (error) {
                if (error?.response?.status === HTTP.UNPROCESSABLE_ENTITY) {
                    this.$toast.error(error.response.data);

                    return;
                }

                console.error(error);

                this.$toast.error('Error while deleting the item!');
            } finally {
                this.confirmationModalLoading = false;
            }
        },

        onAddButtonClick(editedItem = null) {
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

        // eslint-disable-next-line no-unused-vars
        getIcon(item) {
            return null;
        }
    }
};
</script>

<style>
.v-data-table-headers--mobile {
    display: none;
}
</style>
