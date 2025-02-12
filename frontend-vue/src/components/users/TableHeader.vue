<template>
    <div>
        <v-toolbar flat>
            <v-toolbar-title class="text-h6 font-weight-bold">
                Employees list
            </v-toolbar-title>

            <v-spacer />

            <v-btn @click="openAddDialog">
                <span>New employee</span>
            </v-btn>
        </v-toolbar>

        <add-edit-dialog
            :is-opened="isAddDialogOpened"
            @close="closeAddDialog"
        />
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import tableHeaderMixin from '@/mixins/tableHeaderMixin';

export default {
    name: 'TableHeader',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/users/AddEditDialog')
        )
    },

    mixins: [tableHeaderMixin]
};
</script>
