<script>
import { mapActions } from 'pinia';

import BaseTablePage from '@/components/view/BaseTablePage';
import { useFeedbackTokensCollectionStore } from '@/stores/feedbackTokensCollection';

export default {
    name: 'TokensPage',

    extends: BaseTablePage,

    computed: {
        headers() {
            return [
                { title: 'ID', value: 'id', minWidth: '150px' },
                { title: 'Date Time', value: 'dateTime', minWidth: '150px' },
                { title: 'Expires At', value: 'expiresAt', minWidth: '150px' },
                {
                    title: 'Users Permitted',
                    value: 'usersPermitted',
                    minWidth: '150px'
                },
                {
                    title: 'Users Filled',
                    value: 'usersFilled',
                    minWidth: '150px'
                }
            ];
        },

        customTableOptions() {
            return {
                title: 'Feedback Tokens Collections',
                searchBar: false,
                addButtonText: 'Add Tokens Collection',
                isAddButtonIncluded: true,
                areActionButtonsIncluded: false
            };
        }
    },

    methods: {
        ...mapActions(useFeedbackTokensCollectionStore, {
            getItems: 'index',
            createTokens: 'store'
        }),

        async onAddButtonClick() {
            try {
                await this.createTokens();

                this.$toast.success('Token collection has been created');

                await this.doGetItems();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while creating token collection!');
            }
        }
    }
};
</script>
