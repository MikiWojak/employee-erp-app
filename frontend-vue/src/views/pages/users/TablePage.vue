<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useUserStore } from '@/stores/user';
import BaseTable from '@/components/pages/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        )
    },

    extends: BaseTable,

    data() {
        return {
            tableOptions: {
                title: 'Employees',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this user?'
            }
        };
    },

    computed: {
        customFields() {
            return [
                {
                    component: 'v-chip',
                    name: 'vacationLeft',
                    value: this.getVacationLeft,
                    color: this.getVacationLeftColor
                }
            ];
        },

        headers() {
            return [
                { title: 'First name', value: 'firstName' },
                { title: 'Last name', value: 'lastName' },
                { title: 'Date of birth', value: 'dateOfBirth' },
                { title: 'Email', value: 'email' },
                { title: 'Days off left', value: 'vacationLeft' }
            ];
        }
    },

    methods: {
        ...mapActions(useUserStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        getVacationLeft(item) {
            return item.vacationDaysSum - item.vacationDaysUsed;
        },

        getVacationLeftColor(item) {
            const value = this.getVacationLeft(item);

            if (value > 0) {
                return 'green';
            }

            if (value === 0) {
                return 'orange';
            }

            return 'red';
        }
    }
};
</script>
