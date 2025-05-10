<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useUserStore } from '@/stores/user';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        )
    },

    extends: BaseTablePage,

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
                { title: 'Avatar', value: 'icon' },
                { title: 'First name', value: 'firstName' },
                { title: 'Last name', value: 'lastName' },
                { title: 'Roles', value: 'roles' }, // @TODO Change way of show!
                { title: 'Department', value: 'department.name' },
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
        },

        getIcon(item) {
            return item.avatar;
        }
    }
};
</script>
