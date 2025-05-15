<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { Roles } from '@/enums/Roles';
import { useAuthStore } from '@/stores/auth';
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
                title: 'Users',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this user?'
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'isManager', 'loggedUser']),

        customFields() {
            return [
                {
                    name: 'roles',
                    value: this.getRoleNames
                },
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
                { title: 'Roles', value: 'roles' },
                ...(this.isAdmin
                    ? [{ title: 'Department', value: 'department.name' }]
                    : []),
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
        },

        getRoleNames(item) {
            if (!item?.roles?.length) {
                return '';
            }

            return item?.roles?.map(role => role.name).join(', ');
        },

        areActionButtonsDisabled(item) {
            if (this.loggedUser?.id === item.id) {
                return true;
            }

            const isUserManager = item.roles.find(
                role => role.name === Roles.MANAGER
            );

            if (this.isManager && isUserManager) {
                return true;
            }

            return false;
        }
    }
};
</script>
