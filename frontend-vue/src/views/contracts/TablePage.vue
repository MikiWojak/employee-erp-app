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
                { title: 'Position', value: 'position' },
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                {
                    title: 'Days off/year',
                    value: 'vacationDaysPerYear'
                },
                { title: 'Days off', value: 'vacationDays' }
            ];

            if (
                this.isAdmin ||
                (this.isManager && this.selectedTab !== BelongingTabs.MINE)
            ) {
                return [
                    { title: 'First name', value: 'user.firstName' },
                    { title: 'Last name', value: 'user.lastName' },
                    ...employeeHeaders
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
