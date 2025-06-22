<script>
import { capitalize } from 'lodash';
import { mapActions, mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useSuggestionStore } from '@/stores/suggestion';
import BaseTablePage from '@/components/view/BaseTablePage';
import { SuggestionStatuses } from '@/enums/SuggestionStatuses';
import getStatusColor from '@/helpers/suggestions/getStatusColor';
import isVoteSelected from '@/helpers/suggestions/isVoteSelected';

export default {
    name: 'TablePage',

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
                actionsMinWidth: '275px',
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
                },
                { title: 'Status', value: 'status', minWidth: '150px' }
            ];
        },

        // @TODO Consider dedicated cols for votes up and down
        additionalActionButtons() {
            return [
                {
                    props: item => ({
                        variant: isVoteSelected(item, 1, this.loggedUser)
                            ? 'outlined'
                            : 'text',
                        text: item.votesUp,
                        'prepend-icon': 'mdi-thumb-up',
                        color: 'green',
                        class: 'vote-icon',
                        disabled: true
                    }),
                    action: () => {}
                },
                {
                    props: item => ({
                        variant: isVoteSelected(item, -1, this.loggedUser)
                            ? 'outlined'
                            : 'text',
                        text: item.votesDown,
                        'prepend-icon': 'mdi-thumb-down',
                        color: 'red',
                        class: 'vote-icon',
                        disabled: true
                    }),
                    action: () => {}
                },
                {
                    props: item => ({
                        variant: 'plain',
                        icon: 'mdi-eye',
                        ...(this.areEditDeleteButtonsVisible(item) && {
                            class: 'd-none'
                        })
                    }),
                    action: item => this.onAddEditButtonClick(item)
                }
            ];
        },

        customFields() {
            return [
                {
                    component: 'v-chip',
                    name: 'status',
                    value: item => capitalize(item.status),
                    color: this.getStatusColor
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

        getStatusColor,

        areEditDeleteButtonsVisible(item) {
            return (
                this.loggedUser?.id === item.userId &&
                item.status === SuggestionStatuses.PENDING
            );
        },

        onAddEditButtonClick(editedItem = null) {
            if (editedItem) {
                this.$router.push({
                    name: 'edit-suggestion',
                    params: { id: editedItem.id }
                });

                return;
            }

            this.$router.push({
                name: 'add-suggestion'
            });
        }
    }
};
</script>

<style scoped>
.v-btn--disabled.vote-icon {
    opacity: 0.75;
}
</style>
