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
                variant="plain"
                icon="mdi-thumb-up"
                color="green"
                @click="doVote(item, 1)"
            />

            <v-btn
                variant="plain"
                icon="mdi-thumb-down"
                color="red"
                @click="doVote(item, -1)"
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
import { mapActions, mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useSuggestionStore } from '@/stores/suggestion';
import BaseTablePage from '@/components/view/BaseTablePage';
import { StatusCodes as HTTP } from 'http-status-codes/build/cjs/status-codes';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/suggestions/AddEditDialog')
        )
    },

    extends: BaseTablePage,

    computed: {
        ...mapState(useAuthStore, ['isManager', 'isEmployee', 'loggedUser']),

        customTableOptions() {
            return {
                title: 'Suggestions',
                areActionButtonsIncluded: this.isManager || this.isEmployee,
                isAddButtonIncluded: this.isManager || this.isEmployee
            };
        },

        headers() {
            return [
                { title: 'Title', value: 'title', minWidth: '150px' },
                {
                    title: 'Author - First name',
                    value: 'user.firstName',
                    minWidth: '200px'
                },
                {
                    title: 'Author - Last name',
                    value: 'user.lastName',
                    minWidth: '200px'
                },
                {
                    title: 'Votes up',
                    value: 'votesUp',
                    minWidth: '200px'
                },
                {
                    title: 'Votes down',
                    value: 'votesDown',
                    minWidth: '200px'
                }
            ];
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            vote: 'vote',
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        areActionButtonsDisabled(item) {
            return item.userId !== this.loggedUser.id;
        },

        async doVote(item, vote) {
            try {
                await this.vote({
                    id: item.id,
                    vote
                });

                await this.doGetItems();

                this.$toast.success('Vote has been saved');
            } catch (error) {
                if (error?.response?.status === HTTP.UNPROCESSABLE_ENTITY) {
                    this.$toast.error(error.response.data);

                    return;
                }

                console.error(error);

                this.$toast.error('Error on vote!');
            }
        }
    }
};
</script>
