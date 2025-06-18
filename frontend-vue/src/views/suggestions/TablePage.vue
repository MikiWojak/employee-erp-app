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
                        variant: 'plain',
                        text: item.votesUp,
                        'prepend-icon': 'mdi-thumb-up',
                        color: 'green',
                        disabled: this.isSuggestionVoteDisabled(item)
                    }),
                    action: item => this.doVote(item, 1)
                },
                {
                    props: item => ({
                        variant: 'plain',
                        text: item.votesDown,
                        'prepend-icon': 'mdi-thumb-down',
                        color: 'red',
                        disabled: this.isSuggestionVoteDisabled(item)
                    }),
                    action: item => this.doVote(item, -1)
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
        },

        isSuggestionVoteDisabled(item) {
            return this.loggedUser.id === item.userId;
        }
    }
};
</script>
