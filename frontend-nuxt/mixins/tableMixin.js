export default {
    data() {
        return {
            editedItem: null,
            deletedItemId: null
        };
    },

    computed: {
        pagination() {
            const sizes = {
                xs: 5,
                sm: 5,
                md: 5,
                lg: 10,
                xl: 15
            };

            return sizes[this.$vuetify.breakpoint.name] || 10;
        }
    },

    methods: {
        openEditDialog(editedItem) {
            this.editedItem = { ...editedItem };
        },

        closeEditDialog() {
            this.editedItem = null;
        },

        openDeleteDialog(id) {
            this.deletedItemId = id;
        },

        closeDeleteDialog() {
            this.deletedItemId = null;
        }
    }
};
