<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useContractStore } from '@/stores/contract';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/contracts/AddEditDialog')
        )
    },

    extends: BaseTablePage,

    data() {
        return {
            tableOptions: {
                title: 'Contracts',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this contract?'
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        computedTableOptions() {
            return {
                isAddButtonIncluded: this.isAdmin,
                areActionButtonsIncluded: this.isAdmin
            };
        },

        headers() {
            const employeeHeaders = [
                { title: 'Position', value: 'position' },
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                {
                    title: 'Days off/year',
                    value: 'vacationDaysPerYear'
                },
                { title: 'Days off', value: 'vacationDays' }
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
        ...mapActions(useContractStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        })
    }
};
</script>
