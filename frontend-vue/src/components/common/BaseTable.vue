<script>
export default {
    name: 'BaseTable',

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

    async created() {
        await this.doGetItems();
    },

    methods: {
        async getItems() {
            return Promise.resolve({ rows: [], count: 0 });
        },

        async doGetItems() {
            try {
                const { rows } = await this.getItems();

                this.items = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot fetch data');
            }
        },

        async deleteItem() {
            return Promise.resolve();
        },

        // @TODO What if ID is null?
        async doDeleteItem(id) {
            try {
                await this.deleteItem(id);

                await this.doGetItems();

                this.$toast.success('Item has been deleted');

                this.closeDeleteDialog();
            } catch (error) {
                console.error(error);

                this.$toast.error('Error while deleting the item!');
            }
        },

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
</script>
