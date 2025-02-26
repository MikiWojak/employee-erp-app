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
        await this.fetchItems();
    },

    methods: {
        async getItems() {
            return { rows: [], count: 0 };
        },

        async fetchItems() {
            try {
                const { rows } = await this.getItems();

                this.items = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot fetch data');
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
