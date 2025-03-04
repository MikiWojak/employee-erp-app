<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useVacationStore } from '@/stores/vacation';
import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'VacationsTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/vacations/AddEditDialog')
        )
    },

    extends: BaseTable,

    data() {
        return {
            title: 'Vacations',
            deleteConfirmationModalTitle:
                'Do you really want to delete this vacation?'
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin']),

        baseHeaders() {
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
        },

        customFields() {
            return [
                {
                    component: 'v-chip',
                    name: 'approved',
                    value: this.getStatus,
                    color: this.getColor
                }
            ];
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
