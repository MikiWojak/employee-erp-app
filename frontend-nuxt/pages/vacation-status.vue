<template>
    <v-container fluid>
        <h2>
            Days off left:
            <v-chip x-large :color="getColor(vacationDaysLeft)" dark>
                {{ vacationDaysLeft }}
            </v-chip>
        </h2>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    middleware: 'auth',

    computed: {
        ...mapGetters({
            vacationDaysLeft: 'me/vacationDaysLeft'
        })
    },

    methods: {
        getColor(value) {
            if (value > 0) {
                return 'green';
            }

            if (value === 0) {
                return 'orange';
            }

            return 'red';
        }
    }
};
</script>
