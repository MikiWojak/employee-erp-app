<template>
    <div>
        <h2>
            Days off left:
            <v-chip x-large :color="getColor(vacationDaysLeft)" dark>
                {{ vacationDaysLeft }}
            </v-chip>
        </h2>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Employee',

    computed: {
        ...mapGetters({
            vacationDaysLeft: 'auth/vacationDaysLeft'
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
