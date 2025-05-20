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
            tableOptions: {
                title: 'Vacations',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this vacation?'
            },
            selectedTab: BelongingTabs.EMPLOYEES
        };
    },

    computed: {
        ...mapState(useAuthStore, ['isAdmin', 'isManager']),

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
                { title: 'Start date', value: 'startDate' },
                { title: 'End date', value: 'endDate' },
                { title: 'Duration', value: 'duration' },
                { title: 'Status', value: 'approved' }
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
                        label: "Employee's contracts",
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
