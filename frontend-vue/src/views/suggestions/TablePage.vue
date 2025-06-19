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
        ...mapState(useAuthStore, ['isManager', 'isEmployee', 'loggedUser']),

        customTableOptions() {
            return {
                title: 'Suggestions',
                areActionButtonsIncluded: this.isManager || this.isEmployee,
                isAddButtonIncluded: this.isManager || this.isEmployee,
                actionsMinWidth: '250px'
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
                            : 'plain',
                        text: item.votesUp,
                        'prepend-icon': 'mdi-thumb-up',
                        color: 'green',
                        disabled: this.isSuggestionVoteDisabled(item)
                    }),
                    action: item => this.doVote(item, 1)
                },
                {
                    props: item => ({
                        variant: this.isVoteSelected(item, -1)
                            ? 'outlined'
                            : 'plain',
                        text: item.votesDown,
                        'prepend-icon': 'mdi-thumb-down',
                        color: 'red',
                        disabled: this.isSuggestionVoteDisabled(item)
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
            return item.userId === this.loggedUser.id;
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
            return this.loggedUser.id === item.userId;
        },

        isVoteSelected(item, vote) {
            if (!item.userVotes?.length) {
                return false;
            }

            const userVote = item.userVotes.find(
                _userVote =>
                    _userVote.id === this.loggedUser.id &&
                    _userVote.SuggestionVote2User.vote === vote
            );

            return !!userVote;
        },

        viewSuggestion(item) {
            this.isAddEditDialogReadonly = true;
            this.onAddButtonClick(item);
        }
    }
};
</script>
