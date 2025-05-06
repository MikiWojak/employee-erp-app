<template>
    <v-navigation-drawer v-model="isOpen" color="light-blue-lighten-3">
        <v-list-item
            v-bind="userInfoAvatarProps"
            lines="two"
            :title="fullName"
            :subtitle="roles"
            :to="{ name: 'profile' }"
        />

        <v-divider />

        <v-list-item
            prepend-icon="mdi-home"
            title="Dashboard"
            :to="{ name: 'dashboard' }"
        />

        <v-list-item
            v-if="isAdmin"
            prepend-icon="mdi-office-building"
            title="Departments"
            :to="{ name: 'departments' }"
        />

        <v-list-item
            v-if="isAdmin"
            prepend-icon="mdi-account-multiple"
            title="Employees"
            :to="{ name: 'users' }"
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
import getFullImagePath from '@/helpers/getFullImagePath';

export default {
    name: 'AppSidebar',

    props: {
        isSidebarOpen: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            isOpen: false
        };
    },

    computed: {
        ...mapState(useAuthStore, ['loggedUser', 'isAdmin']),

        fullName() {
            return this.loggedUser?.fullName || '';
        },

        userInfoAvatarProps() {
            if (!this.loggedUser?.avatar) {
                return {
                    'prepend-icon': 'mdi-account-circle'
                };
            }

            const fullAvatarUrl = getFullImagePath(this.loggedUser.avatar);

            return {
                'prepend-avatar': fullAvatarUrl
            };
        },

        roles() {
            if (!this.loggedUser) {
                return '';
            }

            const { roles } = this.loggedUser;

            return roles.map(role => role.name).join(', ');
        }
    },

    watch: {
        isSidebarOpen: {
            handler(val) {
                this.isOpen = val;
            }
        }
    },

    created() {
        this.isOpen = this.isSidebarOpen;
    },

    methods: {
        ...mapActions(useAuthStore, ['logout']),

        async handleLogout() {
            try {
                await this.logout();

                this.$router.push({ name: 'login' });

                this.$toast.info('Logged out');
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while logging out!');
            }
        }
    }
};
</script>
