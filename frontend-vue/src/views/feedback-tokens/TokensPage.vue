<script>
import dayjs from 'dayjs';
import { mapActions, mapState } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import BaseTablePage from '@/components/view/BaseTablePage';
import { useFeedbackTokensCollectionStore } from '@/stores/feedbackTokensCollection';

export default {
    name: 'TokensPage',

    extends: BaseTablePage,

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        headers() {
            const baseHeaders = [
                { title: 'ID', value: 'id', minWidth: '150px' },
                {
                    title: 'Number',
                    value: 'number',
                    minWidth: '150px'
                },
                {
                    title: 'Date Time',
                    value: 'formattedDateTime',
                    minWidth: '150px'
                },
                {
                    title: 'Expires At',
                    value: 'formattedExpiresAt',
                    minWidth: '150px'
                }
            ];

            if (this.isAdmin) {
                return [
                    ...baseHeaders,
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
            }

            return baseHeaders;
        },

        customFields() {
            return [
                {
                    name: 'formattedDateTime',
                    value: this.getFormattedDateTime,
                    attributes: () => ({})
                },
                {
                    name: 'formattedExpiresAt',
                    value: this.getFormattedExpiresAt,
                    attributes: () => ({})
                }
            ];
        },

        customTableOptions() {
            return {
                title: 'Feedback Tokens Collections',
                addButtonText: 'Add Tokens Collection',
                areActionButtonsIncluded: false,
                isAddButtonIncluded: this.isAdmin
            };
        }
    },

    methods: {
        ...mapActions(useFeedbackTokensCollectionStore, {
            getItems: 'index',
            createTokens: 'store'
        }),

        async onAddEditButtonClick() {
            try {
                await this.createTokens();

                this.$toast.success('Token collection has been created');

                await this.doGetItems();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while creating token collection!');
            }
        },

        getFormattedDateTime(item) {
            return this.formatDateTime(item.dateTime);
        },

        getFormattedExpiresAt(item) {
            return item.expiresAt ? this.formatDateTime(item.expiresAt) : null;
        },

        formatDateTime(value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};
</script>
