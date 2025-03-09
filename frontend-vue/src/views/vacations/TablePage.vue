<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useVacationStore } from '@/stores/vacation';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/vacations/AddEditDialog')
        )
    },

    extends: BaseTablePage,

    data() {
        return {
            tableOptions: {
                title: 'Vacations',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this vacation?'
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        customFields() {
            return [
                {
                    component: 'v-chip',
                    name: 'approved',
                    value: this.getStatus,
                    color: this.getColor
                }
            ];
        },

        headers() {
            const employeeHeaders = [
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                { title: 'Duration', value: 'duration' },
                { title: 'Status', value: 'approved' }
            ];

            if (this.isAdmin) {
                return [
                    { title: 'First name', value: 'user.firstName' },
                    { title: 'Last name', value: 'user.lastName' },
                    ...employeeHeaders
                ];
            }

            return employeeHeaders;
        }
    },

    methods: {
        ...mapActions(useVacationStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        areActionButtonsDisabled(item) {
            return !this.isAdmin && item.approved;
        },

        getStatus(item) {
            return item.approved ? 'Approved' : 'Pending';
        },

        getColor(item) {
            return item.approved ? 'green' : 'orange';
        }
    }
};
</script>
