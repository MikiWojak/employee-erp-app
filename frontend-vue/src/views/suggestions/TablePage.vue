<script>
import { mapActions, mapState } from 'pinia';
import { defineAsyncComponent } from 'vue';

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
                }
            ];
        }
    },

    methods: {
        ...mapActions(useSuggestionStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        areActionButtonsDisabled(item) {
            return item.userId !== this.loggedUser.id;
        }
    }
};
</script>
