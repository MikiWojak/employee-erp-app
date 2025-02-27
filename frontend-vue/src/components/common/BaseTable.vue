<script>
export default {
    name: 'BaseTable',

    data() {
        return {
            items: [],
            editedItem: null,
            itemToDeleteId: null
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

        async doDeleteItem() {
            if (!this.itemToDeleteId) {
                return;
            }

            try {
                await this.deleteItem(this.itemToDeleteId);

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
            this.itemToDeleteId = id;
        },

        closeDeleteDialog() {
            this.itemToDeleteId = null;
        }
    }
};
</script>
