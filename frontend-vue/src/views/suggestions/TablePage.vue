<script>
import { mapActions } from 'pinia';

import { useSuggestionStore } from '@/stores/suggestion';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    extends: BaseTablePage,

    computed: {
        customTableOptions() {
            return {
                title: 'Suggestions',
                isAddButtonIncluded: false,
                areActionButtonsIncluded: false
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
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            getItems: 'index'
        })
    }
};
</script>
