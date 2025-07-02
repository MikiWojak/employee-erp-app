<script>
import { mapActions } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useDepartmentStore } from '@/stores/department';
import BaseTablePage from '@/components/view/BaseTablePage';

export default {
    name: 'TablePage',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/departments/AddEditDialog')
        )
    },

    extends: BaseTablePage,

    computed: {
        customTableOptions() {
            return {
                title: 'Departments',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this department?'
            };
        },

        customFields() {
            return [
                {
                    name: 'allWorkersCount',
                    value: this.getAllWorkersCount,
                    attributes: () => ({})
                }
            ];
        },

        headers() {
            return [
                { title: 'Name', value: 'name' },
                { title: 'Employees', value: 'employeesCount' },
                { title: 'Managers', value: 'managersCount' },
                { title: 'All workers', value: 'allWorkersCount' }
            ];
        }
    },

    methods: {
        ...mapActions(useDepartmentStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        }),

        getAllWorkersCount(item) {
            return item.employeesCount + item.managersCount;
        }
    }
};
</script>
