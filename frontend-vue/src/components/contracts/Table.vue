<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useContractStore } from '@/stores/contract';
import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'ContractsTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/contracts/AddEditDialog')
        )
    },

    extends: BaseTable,

    data() {
        return {
            title: 'Contracts',
            deleteConfirmationModalTitle:
                'Do you really want to delete this contract?'
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        isAddButtonIncluded() {
            return this.isAdmin;
        },

        areActionButtonsIncluded() {
            return this.isAdmin;
        },

        baseHeaders() {
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
