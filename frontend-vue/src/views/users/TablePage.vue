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

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'isManager', 'loggedUser']),

        customTableOptions() {
            return {
                title: 'Users',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this user?'
            };
        },

        customFields() {
            return [
                {
                    name: 'role',
                    value: this.getRoleName
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
                { title: 'First name', value: 'firstName', minWidth: '150px' },
                { title: 'Last name', value: 'lastName', minWidth: '150px' },
                { title: 'Role', value: 'role', minWidth: '100px' },
                ...(this.isAdmin
                    ? [
                          {
                              title: 'Department',
                              value: 'department.name',
                              minWidth: '150px'
                          }
                      ]
                    : []),
                {
                    title: 'Date of birth',
                    value: 'dateOfBirth',
                    minWidth: '125px'
                },
                { title: 'Email', value: 'email', minWidth: '200px' },
                {
                    title: 'Days off left',
                    value: 'vacationLeft',
                    minWidth: '125px'
                },
                {
                    title: 'Created by - First name',
                    value: 'createdBy.firstName',
                    minWidth: '200px'
                },
                {
                    title: 'Created by - Last name',
                    value: 'createdBy.lastName',
                    minWidth: '200px'
                },
                {
                    title: 'Updated by - First name',
                    value: 'updatedBy.firstName',
                    minWidth: '200px'
                },
                {
                    title: 'Updated by - Last name',
                    value: 'updatedBy.lastName',
                    minWidth: '200px'
                }
            ];
        },

        additionalIndexParams() {
            return { allRoles: true };
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

        getRoleName(item) {
            return item?.role?.name || '';
        },

        areActionButtonsDisabled(item) {
            if (this.loggedUser?.id === item.id) {
                return true;
            }

            const isUserManager = item.role.name === Roles.MANAGER;

            if (this.isManager && isUserManager) {
                return true;
            }

            return false;
        }
    }
};
</script>
