export default {
    data() {
        return {
            isHydrated: false,
            value: 600
        };
    },

    computed: {
        breakpoint() {
            if (this.$device.isMobile) {
                return this.value;
            }

            return this.isHydrated ? this.value : 0;
        }
    },

    mounted() {
        this.isHydrated = true;
    }
};
