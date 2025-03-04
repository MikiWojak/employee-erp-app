<script>
import { mapActions } from 'pinia';

import { useUserStore } from '@/stores/user';
import { defineAsyncComponent } from 'vue';

import BaseTable from '@/components/common/BaseTable';

export default {
    name: 'UsersTable',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        )
    },

    extends: BaseTable,

    data() {
        return {
            title: 'Employees',
            deleteConfirmationModalTitle:
                'Do you really want to delete this user?'
        };
    },

    computed: {
        baseHeaders() {
            return [
                { title: 'First name', value: 'firstName' },
                { title: 'Last name', value: 'lastName' },
                { title: 'Date of birth', value: 'dateOfBirth' },
                { title: 'Email', value: 'email' },
                { title: 'Days off left', value: 'vacationLeft' }
            ];
        },

        customFields() {
            return [
                {
                    component: 'v-chip',
                    name: 'vacationLeft',
                    value: this.getVacationLeft,
                    color: this.getVacationLeftColor
                }
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
