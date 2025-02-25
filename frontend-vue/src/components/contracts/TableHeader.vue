<template>
    <div>
        <v-toolbar flat>
            <v-toolbar-title class="text-h6 font-weight-bold">
                Contracts list
            </v-toolbar-title>

            <v-spacer />

            <v-btn v-if="isAdmin" @click="openAddDialog">
                <span>New contract</span>
            </v-btn>
        </v-toolbar>

        <add-edit-dialog
            v-if="isAdmin"
            :is-opened="isAddDialogOpened"
            @close="closeAddDialog"
        />
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { useAuthStore } from '@/stores/auth';
import tableHeaderMixin from '@/mixins/tableHeaderMixin';

export default {
    name: 'TableHeader',

    components: {
        AddEditDialog: defineAsyncComponent(
            () => import('@/components/contracts/AddEditDialog')
        )
    },

    mixins: [tableHeaderMixin],

    computed: {
        ...mapState(useAuthStore, ['isAdmin'])
    }
};
</script>
