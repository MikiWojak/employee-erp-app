export default {
    data() {
        return {
            items: [],
            editedItem: null,
            deletedItemId: null
        };
    },

    computed: {
        pagination() {
            return 10;
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
