<template>
    <v-navigation-drawer v-model="isOpen" color="light-blue-lighten-3">
        <v-list-item
            v-bind="userInfoAvatarProps"
            lines="two"
            :title="fullName"
            :subtitle="departmentName"
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
            v-if="isAdmin || isManager"
            prepend-icon="mdi-account-multiple"
            title="Users"
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

        <v-list-item
            prepend-icon="mdi-bed"
            title="Suggestions"
            :to="{ name: 'suggestions' }"
        />

        <v-list-subheader class="ml-4" inset> Feedback </v-list-subheader>

        <v-list-item
            v-if="isEmployee || isManager"
            prepend-icon="mdi-comment"
            title="Form"
            :to="{ name: 'feedback' }"
        />

        <v-list-item
            v-if="isAdmin || isManager"
            prepend-icon="mdi-ticket-account"
            title="Tokens Collections"
            :to="{ name: 'feedback-tokens-collections' }"
        />

        <v-list-item
            v-if="isAdmin || isManager"
            prepend-icon="mdi-comment-multiple"
            title="Statistics"
            :to="{ name: 'feedback-statistics' }"
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
        ...mapState(useAuthStore, [
            'isAdmin',
            'isManager',
            'isEmployee',
            'loggedUser'
        ]),

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

        departmentName() {
            return this.loggedUser?.department?.name || '';
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
