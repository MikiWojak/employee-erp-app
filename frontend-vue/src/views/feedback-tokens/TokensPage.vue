<script>
import { mapActions } from 'pinia';

import BaseTablePage from '@/components/view/BaseTablePage';
import { useFeedbackTokensCollectionStore } from '@/stores/feedbackTokensCollection';

export default {
    name: 'TokensPage',

    extends: BaseTablePage,

    // @TODO Hide search bar
    data() {
        return {
            tableOptions: {
                title: 'Feedback Tokens'
            }
        };
    },

    computed: {
        headers() {
            return [
                { title: 'ID', value: 'id', minWidth: '150px' },
                { title: 'Date Time', value: 'dateTime', minWidth: '150px' },
                { title: 'Expires At', value: 'expiresAt', minWidth: '150px' }
            ];
        },

        computedTableOptions() {
            return {
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

        // @TODO Rename in other component
        async openAddEditDialog() {
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
