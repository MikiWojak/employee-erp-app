<template>
    <div>
        <v-toolbar flat>
            <v-toolbar-title class="text-h6 font-weight-bold">
                Vacations list
            </v-toolbar-title>

            <v-spacer />

            <v-btn @click="openAddDialog">
                <span>New vacation</span>
            </v-btn>
        </v-toolbar>

        <add-edit-dialog
            :is-opened="isAddDialogOpened"
            @close="closeAddDialog"
        />
    </div>
</template>

<script>
import tableHeaderMixin from '@/mixins/tableHeaderMixin';

export default {
    components: {
        AddEditDialog: () => import('@/components/vacations/AddEditDialog')
    },

    mixins: [tableHeaderMixin]
};
</script>
