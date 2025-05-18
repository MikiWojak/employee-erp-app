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

    data() {
        return {
            tableOptions: {
                title: 'Departments',
                deleteConfirmationModalTitle:
                    'Do you really want to delete this department?'
            }
        };
    },

    computed: {
        headers() {
            return [
                { title: 'Name', value: 'name' },
                { title: 'Employees', value: 'employeesCount' },
                { title: 'Managers', value: 'managersCount' }
            ];
        }
    },

    methods: {
        ...mapActions(useDepartmentStore, {
            getItems: 'index',
            deleteItem: 'destroy'
        })
    }
};
</script>
