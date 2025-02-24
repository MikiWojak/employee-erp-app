<template>
    <v-navigation-drawer permanent color="light-blue-lighten-3">
        <v-list-item
            lines="two"
            prepend-icon="mdi-account-circle"
            :title="fullName"
            :subtitle="role"
        />

        <v-divider />

        <v-list-item
            prepend-icon="mdi-home"
            title="Dashboard"
            :to="{ name: 'dashboard' }"
        />

        <v-list-item
            prepend-icon="mdi-briefcase-variant"
            title="Contracts"
            :to="{ name: 'contracts' }"
        />

        <v-list-item
            prepend-icon="mdi-bed"
            title="Vacations"
            :to="{ name: 'vacations' }"
        />

        <v-divider />

        <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
        />
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import { useVacationStore } from '@/stores/vacation';

export default {
    name: 'Sidebar',

    computed: {
        ...mapState(useAuthStore, ['loggedUser']),

        fullName() {
            if (!this.loggedUser) {
                return '';
            }

            const { firstName, lastName } = this.loggedUser;

            return `${firstName} ${lastName}`;
        },

        role() {
            if (!this.loggedUser) {
                return '';
            }

            const {
                role: { name }
            } = this.loggedUser;

            return name;
        }
    },

    methods: {
        ...mapActions(useAuthStore, ['logout']),

        ...mapActions(useUserStore, { clearUsers: 'clear' }),

        ...mapActions(useContractStore, { clearContracts: 'clear' }),

        ...mapActions(useVacationStore, { clearVacations: 'clear' }),

        async handleLogout() {
            try {
                await this.logout();

                this.clearUsers();
                this.clearContracts();
                this.clearVacations();

                this.$router.push({ name: 'login' });

                // @TODO Why do I get double notification?
                this.$toast.info('Logged out');
            } catch (error) {
                console.error(error);

                // @TODO Why do I get double notification?
                this.$toast.error('Error while logging out!');
            }
        }
    }
};
</script>
