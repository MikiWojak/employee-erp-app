<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useVacationStore } from '@/stores/vacation';
import { BelongingTabs } from '@/enums/BelongingTabs';
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
            selectedTab: BelongingTabs.EMPLOYEES
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'isManager']),

        customTableOptions() {
            return {
                title: 'Vacations',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this vacation?'
            };
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
        },

        headers() {
            const employeeHeaders = [
                { title: 'Start date', value: 'startDate', minWidth: '125px' },
                { title: 'End date', value: 'endDate', minWidth: '125px' },
                { title: 'Duration', value: 'duration', minWidth: '100px' },
                { title: 'Status', value: 'approved', minWidth: '125px' }
            ];

            if (
                this.isAdmin ||
                (this.isManager && this.selectedTab !== BelongingTabs.MINE)
            ) {
                return [
                    {
                        title: 'First name',
                        value: 'user.firstName',
                        minWidth: '150px'
                    },
                    {
                        title: 'Last name',
                        value: 'user.lastName',
                        minWidth: '150px'
                    },
                    ...employeeHeaders,
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
            }

            return employeeHeaders;
        },

        tabs() {
            if (this.isManager) {
                return [
                    {
                        label: 'Employees vacations',
                        value: BelongingTabs.EMPLOYEES
                    },
                    { label: 'My vacations', value: BelongingTabs.MINE }
                ];
            }

            return [];
        },

        additionalIndexParams() {
            return {
                ...(this.selectedTab === BelongingTabs.MINE && {
                    mineOnly: true
                })
            };
        }
    },

    watch: {
        async selectedTab() {
            this.page = 1;

            await this.doGetItems();
        }
    },

    methods: {
        ...mapActions(useVacationStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        areActionButtonsDisabled(item) {
            if (
                this.isAdmin ||
                (this.isManager && this.selectedTab === BelongingTabs.EMPLOYEES)
            ) {
                return false;
            }

            return item.approved;
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
