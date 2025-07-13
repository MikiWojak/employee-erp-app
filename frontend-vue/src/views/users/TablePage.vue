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
                    value: this.getRoleName,
                    attributes: () => ({})
                },
                {
                    component: 'v-chip',
                    name: 'vacationLeft',
                    value: this.getVacationLeft,
                    attributes: item => ({
                        color: this.getVacationLeftColor(item)
                    })
                },
                {
                    component: 'v-chip',
                    name: 'contractStatus',
                    value: this.getContractStatus,
                    attributes: item => ({
                        color: this.getContractStatusColor(item)
                    })
                },
                {
                    component: 'v-chip',
                    name: 'vacationStatus',
                    value: this.getVacationStatus,
                    attributes: item => ({
                        color: this.getVacationStatusColor(item)
                    })
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
                    title: 'Contract Status',
                    value: 'contractStatus',
                    minWidth: '125px'
                },
                {
                    title: 'Vacation Status',
                    value: 'vacationStatus',
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

        areEditDeleteButtonsVisible(item) {
            if (this.loggedUser?.id === item.id) {
                return false;
            }

            const isUserManager = item.role.name === Roles.MANAGER;

            if (this.isManager && isUserManager) {
                return false;
            }

            return true;
        },

        getContractStatus(item) {
            if (item.role.name === Roles.ADMIN) {
                return 'Admin';
            }

            if (item.contracts.length) {
                return 'On contract';
            }

            return 'No current contract';
        },

        getContractStatusColor(item) {
            if (item.role.name === Roles.ADMIN) {
                return 'purple';
            }

            if (item.contracts.length) {
                return 'green';
            }

            return 'orange';
        },

        getVacationStatus(item) {
            if (item.role.name === Roles.ADMIN) {
                return 'Admin';
            }

            if (item.vacations.length) {
                return 'On vacation';
            }

            if (item.contracts.length) {
                return 'Working';
            }

            return '-';
        },

        getVacationStatusColor(item) {
            if (item.role.name === Roles.ADMIN) {
                return 'purple';
            }

            if (item.vacations.length) {
                return 'orange';
            }

            if (item.contracts.length) {
                return 'green';
            }

            return '';
        }
    }
};
</script>
