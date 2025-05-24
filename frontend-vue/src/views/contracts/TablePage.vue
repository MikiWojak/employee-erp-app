<script>
import { defineAsyncComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useContractStore } from '@/stores/contract';
import { BelongingTabs } from '@/enums/BelongingTabs';
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
            },
            selectedTab: BelongingTabs.EMPLOYEES
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'isManager']),

        computedTableOptions() {
            return {
                isAddButtonIncluded: this.isAdmin || this.isManager,
                areActionButtonsIncluded:
                    this.isAdmin ||
                    (this.isManager &&
                        this.selectedTab === BelongingTabs.EMPLOYEES)
            };
        },

        headers() {
            const employeeHeaders = [
                { title: 'Position', value: 'position', minWidth: '150px' },
                { title: 'Start date', value: 'startDate', minWidth: '125px' },
                { title: 'End date', value: 'endDate', minWidth: '125px' },
                {
                    title: 'Days off/year',
                    value: 'vacationDaysPerYear',
                    minWidth: '125px'
                },
                { title: 'Days off', value: 'vacationDays', minWidth: '100px' }
            ];

            if (
                this.isAdmin ||
                (this.isManager && this.selectedTab !== BelongingTabs.MINE)
            ) {
                return [
                    {
                        title: "User's first name",
                        value: 'user.firstName',
                        minWidth: '150px'
                    },
                    {
                        title: "User's last name",
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
                        label: 'Employees contracts',
                        value: BelongingTabs.EMPLOYEES
                    },
                    { label: 'My contracts', value: BelongingTabs.MINE }
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
        ...mapActions(useContractStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        })
    }
};
</script>
