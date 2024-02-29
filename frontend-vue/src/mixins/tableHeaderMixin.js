export default {
    data() {
        return {
            isAddDialogOpened: false
        };
    },

    methods: {
        openAddDialog() {
            this.isAddDialogOpened = true;
        },

        closeAddDialog() {
            this.isAddDialogOpened = false;
        }
    }
};
