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
            @refetch-items="onRefetchItems"
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
            () => import('@/components/vacations/AddEditDialog')
        )
    },

    mixins: [tableHeaderMixin]
};
</script>
