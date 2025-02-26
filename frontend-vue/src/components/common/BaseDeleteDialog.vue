<script>
export default {
    name: 'BaseDeleteDialog',

    props: {
        isOpened: {
            type: Boolean,
            default: false
        },

        deletedItemId: {
            type: String,
            default: null
        }
    },

    emits: ['close', 'refetch-items'],

    data() {
        return {
            isDialogOpened: false
        };
    },

    watch: {
        isOpened() {
            this.isDialogOpened = this.isOpened;
        }
    },

    methods: {
        close() {
            this.$emit('close');
        },

        onSuccess() {
            this.$emit('refetch-items');

            this.close();
        }
    }
};
</script>
