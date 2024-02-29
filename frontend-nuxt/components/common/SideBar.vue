<template>
    <v-navigation-drawer permanent app clipped class="light-blue lighten-3">
        <v-list-item>
            <v-list-item-content class="text-center">
                <span>
                    <v-icon x-large>mdi-account-circle</v-icon>
                </span>

                <v-list-item-title class="text-h6">
                    <span>{{ fullName }}</span>
                </v-list-item-title>

                <v-list-item-subtitle>
                    <span>{{ role }}</span>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider />

        <nuxt-link :to="{ name: 'index' }" class="text-decoration-none">
            <list-item icon="mdi-home" text="Dashboard" />
        </nuxt-link>

        <nuxt-link :to="{ name: 'contracts' }" class="text-decoration-none">
            <list-item icon="mdi-briefcase-variant" text="Contracts" />
        </nuxt-link>

        <nuxt-link :to="{ name: 'vacations' }" class="text-decoration-none">
            <list-item icon="mdi-bed" text="Vacations" />
        </nuxt-link>

        <v-divider />

        <list-item icon="mdi-logout" text="Logout" @click="handleLogout" />
    </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    components: {
        ListItem: () => import('@/components/sidebar/ListItem')
    },

    computed: {
        fullName() {
            const { firstName, lastName } = this.$auth.user;

            return `${firstName} ${lastName}`;
        },

        role() {
            const {
                role: { name }
            } = this.$auth.user;

            return name;
        }
    },

    methods: {
        ...mapActions({
            clearUsers: 'users/clear',
            clearContracts: 'contracts/clear',
            clearVacations: 'vacations/clear'
        }),

        async handleLogout() {
            try {
                await this.$auth.logout();
                this.clearUsers();
                this.clearContracts();
                this.clearVacations();

                this.$router.push({ name: 'login' });

                this.$notify({
                    text: 'Logged out'
                });
            } catch (error) {
                console.error(error);

                this.$notify({
                    type: 'error',
                    text: 'Error while logging out!'
                });
            }
        }
    }
};
</script>
