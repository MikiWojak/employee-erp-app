<script>
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { StatusCodes as HTTP } from 'http-status-codes';

import { useAuthStore } from '@/stores/auth';
import { useSuggestionStore } from '@/stores/suggestion';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/suggestions/AddEditDialog')
        )
    },

    extends: BaseTablePage,

    computed: {
        ...mapState(useAuthStore, [
            'isAdmin',
            'isManager',
            'isEmployee',
            'loggedUser'
        ]),

        customTableOptions() {
            return {
                title: 'Suggestions',
                isAddButtonIncluded: this.isManager || this.isEmployee,
                actionsMinWidth: '250px',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this suggestion?'
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
                }
            ];
        },

        additionalActionButtons() {
            return [
                {
                    props: item => ({
                        variant: this.isVoteSelected(item, 1)
                            ? 'outlined'
                            : 'text',
                        text: item.votesUp,
                        'prepend-icon': 'mdi-thumb-up',
                        color: 'green',
                        class: this.isVoteSelected(item, 1)
                            ? 'selected'
                            : 'vote',
                        disabled:
                            this.isSuggestionVoteDisabled(item) ||
                            this.isVoteSelected(item, 1)
                    }),
                    action: item => this.doVote(item, 1)
                },
                {
                    props: item => ({
                        variant: this.isVoteSelected(item, -1)
                            ? 'outlined'
                            : 'text',
                        text: item.votesDown,
                        'prepend-icon': 'mdi-thumb-down',
                        color: 'red',
                        class: this.isVoteSelected(item, -1)
                            ? 'selected'
                            : 'vote',
                        disabled:
                            this.isSuggestionVoteDisabled(item) ||
                            this.isVoteSelected(item, -1)
                    }),
                    action: item => this.doVote(item, -1)
                },
                {
                    props: item => ({
                        variant: 'plain',
                        icon: 'mdi-eye',
                        ...(this.areEditDeleteButtonsVisible(item) && {
                            class: 'd-none'
                        })
                    }),
                    action: item => this.viewSuggestion(item)
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

        areEditDeleteButtonsVisible(item) {
            return this.loggedUser.id === item.userId;
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
        },

        isSuggestionVoteDisabled(item) {
            return this.isAdmin || this.loggedUser.id === item.userId;
        },

        isVoteSelected(item, vote) {
            const userVoted = item.usersVoted.find(
                _userVoted =>
                    _userVoted.id === this.loggedUser.id &&
                    _userVoted.SuggestionVote2User.vote === vote
            );

            return !!userVoted;
        },

        viewSuggestion(item) {
            this.isAddEditDialogReadonly = true;
            this.onAddButtonClick(item);
        }
    }
};
</script>

<style scoped>
.v-btn--disabled.selected {
    opacity: 1;
}

.v-btn--disabled.vote {
    opacity: 0.75;
}
</style>
