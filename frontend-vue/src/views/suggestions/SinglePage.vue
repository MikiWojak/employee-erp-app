<template>
    <v-row>
        <v-col cols="12">
            <h1> {{ pageTitle }} </h1>
        </v-col>

        <v-col cols="12" md="9">
            <v-text-field
                v-model="formData.title"
                label="Title"
                prepend-icon="mdi-lightbulb-on"
                :readonly="readonlyMode"
                :error-messages="handleError('title')"
                @blur="onBlur('title')"
                @input="clearServerError('title')"
            />

            <v-textarea
                v-model="formData.description"
                label="Description"
                prepend-icon="mdi-text-box"
                :readonly="readonlyMode"
                :error-messages="handleError('description')"
                @blur="onBlur('description')"
                @input="clearServerError('description')"
            />

            <div v-if="editMode" class="mb-4">
                <v-icon icon="mdi-clipboard-check" class="prepend-icon mr-4" />
                <v-chip :color="getStatusColor(formData)">
                    {{ capitalize(formData.status) }}
                </v-chip>
                <v-btn
                    v-if="isAdmin"
                    variant="plain"
                    icon="mdi-pencil"
                    @click="toggleStatusDialog(true)"
                />
            </div>
        </v-col>

        <v-col cols="12" md="3" class="d-flex flex-column align-center">
            <div v-if="editMode" class="mb-4">
                <v-btn
                    :variant="getVoteButtonVariant(1)"
                    :text="formData.votesUp"
                    prepend-icon="mdi-thumb-up"
                    color="green"
                    :disabled="isSuggestionVoteDisabled || doIsVoteSelected(1)"
                    class="vote-icon"
                    @click="doVote(1)"
                />

                <v-btn
                    :variant="getVoteButtonVariant(-1)"
                    :text="formData.votesDown"
                    prepend-icon="mdi-thumb-down"
                    color="red"
                    :disabled="isSuggestionVoteDisabled || doIsVoteSelected(-1)"
                    class="vote-icon"
                    @click="doVote(-1)"
                />
            </div>

            <div class="d-flex ga-2">
                <v-btn
                    v-if="!readonlyMode"
                    text="Save"
                    prepend-icon="mdi-floppy"
                    color="green"
                    :disabled="loading"
                    @click="save"
                />

                <v-btn
                    v-if="editMode && !readonlyMode"
                    text="Delete"
                    prepend-icon="mdi-delete"
                    color="red"
                    :disabled="loading"
                    @click="changeConfirmDeleteDialogStatus(true)"
                />
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <comments-section
                :comments="comments"
                :load-more-enabled="isLoadMoreEnabled"
                @load-more="doLoadMore"
                @add-edit="onAddEditComment"
                @delete="openDeleteCommentConfirmationDialog"
            />
        </v-col>
    </v-row>

    <confirmation-modal
        :is-opened="isConfirmDeleteDialogOpened"
        title="Do you really want to delete this suggestion?"
        :loading="confirmationModalLoading"
        @confirm="doDeleteItem"
        @discard="changeConfirmDeleteDialogStatus(false)"
    />

    <status-dialog
        :is-opened="isStatusDialogOpened"
        :edited-item="formData"
        @success="doGetItem"
        @close="toggleStatusDialog(false)"
    />

    <add-edit-dialog
        :is-opened="isAddEditDialogOpened"
        :suggestion="formData"
        :edited-item="editedItem"
        @success="reloadComments"
        @close="closeAddEditDialog"
    />

    <confirmation-modal
        :is-opened="!!commentToDeleteId"
        title="Do you really want to delete this comment?"
        :loading="confirmationModalLoading"
        @confirm="doDeleteComment"
        @discard="closeDeleteCommentDialog"
    />
</template>

<script>
import { capitalize } from 'lodash';
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, minLength, maxLength } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';
import { useSuggestionStore } from '@/stores/suggestion';
import { SuggestionStatuses } from '@/enums/SuggestionStatuses';
import getStatusColor from '@/helpers/suggestions/getStatusColor';
import isVoteSelected from '@/helpers/suggestions/isVoteSelected';
import { useSuggestionCommentStore } from '@/stores/suggestionComment';

export default {
    name: 'SinglePage',

    components: {
        StatusDialog: defineAsyncComponent(
            () => import('@/components/suggestions/StatusDialog')
        ),
        ConfirmationModal: defineAsyncComponent(
            () => import('@/components/modals/ConfirmationModal')
        ),
        CommentsSection: defineAsyncComponent(
            () => import('@/components/suggestions/comments/Section')
        ),
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/suggestions/comments/AddEditDialog')
        )
    },

    extends: BaseForm,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            title: '',
            description: ''
        };

        return {
            defaultForm,
            formData: { ...defaultForm },
            comments: [],
            page: 1,
            perPage: 10,
            commentsTotal: 0,
            loading: false,
            editMode: false,
            readonlyMode: false,
            isStatusDialogOpened: false,
            isConfirmDeleteDialogOpened: false,
            confirmationModalLoading: false,
            editedItem: null,
            isAddEditDialogOpened: false,
            commentToDeleteId: null
        };
    },

    validations() {
        return {
            formData: {
                title: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(255)
                },
                description: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(5000)
                }
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'loggedUser']),

        pageTitle() {
            if (this.readonlyMode) {
                return 'Suggestion details';
            }

            return this.editMode ? 'Edit suggestion' : 'Add suggestions';
        },

        statusOptions() {
            return Object.values(SuggestionStatuses);
        },

        isSuggestionVoteDisabled() {
            return (
                this.isAdmin ||
                this.loggedUser?.id === this.formData.userId ||
                this.formData.status !== SuggestionStatuses.VOTING
            );
        },

        isLoadMoreEnabled() {
            return this.page * this.perPage < this.commentsTotal;
        }
    },

    async created() {
        if (this.$route.params?.id) {
            await this.doGetItem();
            await this.doGetComments();
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            vote: 'vote',
            getItem: 'show',
            createItem: 'store',
            updateItem: 'update',
            deleteItem: 'destroy',
            getComments: 'getComments'
        }),
        ...mapActions(useSuggestionCommentStore, {
            deleteComment: 'destroy'
        }),

        capitalize,
        getStatusColor,

        async doGetItem() {
            try {
                const item = await this.getItem(this.$route.params.id);

                this.formData = item;
                this.editMode = true;

                if (
                    !(
                        this.loggedUser?.id === item.userId &&
                        item.status === SuggestionStatuses.PENDING
                    )
                ) {
                    this.readonlyMode = true;
                }
            } catch (error) {
                console.error(error);
            }
        },

        async doGetComments(loadMore = false) {
            try {
                const { rows, count } = await this.getComments({
                    suggestionId: this.$route.params.id,
                    page: this.page,
                    perPage: this.perPage
                });

                if (loadMore) {
                    this.comments = [...this.comments, ...rows];
                } else {
                    this.comments = rows;
                }

                this.commentsTotal = count;
            } catch (error) {
                console.error(error);
            }
        },

        async save() {
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            try {
                this.loading = true;

                if (!this.editMode) {
                    const suggestion = await this.createItem(this.formData);

                    this.$router.push({
                        name: 'suggestion-show',
                        params: { id: suggestion.id }
                    });
                } else {
                    await this.updateItem(this.formData);
                }

                const successMessage = this.editMode
                    ? 'Item has been modified'
                    : 'Item has been added';

                this.$toast.success(successMessage);
            } catch (error) {
                if (error?.response?.status === HTTP.UNPROCESSABLE_ENTITY) {
                    this.$toast.error(error.response.data);

                    return;
                }

                console.error(error);

                if (error?.response?.data?.errors) {
                    this.serverErrors = error.response.data.errors;
                }

                const errorMessage = this.editMode
                    ? 'Error while modifying the item!'
                    : 'Error while adding the item!';

                this.$toast.error(errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async doVote(vote) {
            try {
                await this.vote({ id: this.formData.id, vote });

                await this.doGetItem();

                this.$toast.success('Vote has been saved');
            } catch (error) {
                if (error?.response?.status === HTTP.UNPROCESSABLE_ENTITY) {
                    this.$toast.error(error.response.data);

                    return;
                }

                console.error(error);

                this.$toast.error('Error on vote!');
            }
        },

        toggleStatusDialog(flag) {
            this.isStatusDialogOpened = flag;
        },

        doIsVoteSelected(vote) {
            return isVoteSelected(this.formData, vote, this.loggedUser);
        },

        getVoteButtonVariant(vote) {
            return this.doIsVoteSelected(vote) ? 'outlined' : 'text';
        },

        async doDeleteItem() {
            if (!this.isConfirmDeleteDialogOpened) {
                return;
            }

            try {
                this.confirmationModalLoading = true;

                await this.deleteItem(this.formData.id);

                this.$toast.success('Item has been deleted');

                this.changeConfirmDeleteDialogStatus(false);

                this.$router.push({ name: 'suggestions' });
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

        changeConfirmDeleteDialogStatus(flag) {
            this.isConfirmDeleteDialogOpened = flag;
        },

        async doLoadMore() {
            this.page++;

            await this.doGetComments(true);
        },

        onAddEditComment(editedItem = null) {
            this.isAddEditDialogOpened = true;
            this.editedItem = editedItem ? { ...editedItem } : null;
        },

        closeAddEditDialog() {
            this.isAddEditDialogOpened = false;
        },

        async reloadComments() {
            this.page = 1;

            await this.doGetComments();
        },

        async doDeleteComment() {
            try {
                this.confirmationModalLoading = true;

                await this.deleteComment(this.commentToDeleteId);

                this.$toast.success('Comment has been deleted');

                this.changeConfirmDeleteDialogStatus(false);

                this.closeDeleteCommentDialog();

                await this.reloadComments();
            } catch (error) {
                if (error?.response?.status === HTTP.UNPROCESSABLE_ENTITY) {
                    this.$toast.error(error.response.data);

                    return;
                }

                console.error(error);

                this.$toast.error('Error while deleting the comment!');
            } finally {
                this.confirmationModalLoading = false;
            }
        },

        openDeleteCommentConfirmationDialog(id) {
            this.commentToDeleteId = id;
        },

        closeDeleteCommentDialog() {
            this.commentToDeleteId = null;
        }
    }
};
</script>

<style scoped>
.prepend-icon {
    opacity: var(--v-medium-emphasis-opacity);
}

.v-btn--disabled.vote-icon {
    opacity: 0.75;
}
</style>
