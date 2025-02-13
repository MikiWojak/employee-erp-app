<template>
    <v-navigation-drawer permanent app clipped class="light-blue lighten-3">
        <v-list-item>
            <!-- // @TODO Move it to the top-->
            <template #prepend>
                <v-icon x-large> mdi-account-circle </v-icon>
            </template>

            <v-list-item-title class="text-h6">
                {{ fullName }}
            </v-list-item-title>

            <v-list-item-subtitle>
                {{ role }}
            </v-list-item-subtitle>
        </v-list-item>

        <v-divider />

        <router-link :to="{ name: 'dashboard' }" class="text-decoration-none">
            <list-item icon="mdi-home" text="Dashboard" />
        </router-link>

        <router-link :to="{ name: 'contracts' }" class="text-decoration-none">
            <list-item icon="mdi-briefcase-variant" text="Contracts" />
        </router-link>

        <router-link :to="{ name: 'vacations' }" class="text-decoration-none">
            <list-item icon="mdi-bed" text="Vacations" />
        </router-link>

        <v-divider />

        <list-item icon="mdi-logout" text="Logout" @click="handleLogout" />
    </v-navigation-drawer>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Sidebar',

    components: {
        ListItem: defineAsyncComponent(
            () => import('@/components/sidebar/ListItem')
        )
    },

    computed: {
        ...mapGetters({
            loggedUser: 'auth/loggedUser'
        }),

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
        ...mapActions({
            logout: 'auth/logout',
            clearUsers: 'users/clear',
            clearContracts: 'contracts/clear',
            clearVacations: 'vacations/clear'
        }),

        async handleLogout() {
            try {
                await this.logout();

                this.clearUsers();
                this.clearContracts();
                this.clearVacations();

                this.$router.push({ name: 'login' });

                // @TODO Restore notification
            } catch (error) {
                console.error(error);

                // @TODO Restore notification
            }
        }
    }
};
</script>
