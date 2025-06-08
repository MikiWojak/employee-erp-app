<template>
    <v-select
        v-model="tokensCollection"
        :items="tokensCollections"
        :loading="loading"
        hide-no-data
        item-title="dateTime"
        item-value="id"
        label="Tokens Collection"
        prepend-icon="mdi-ticket-account"
        :error-messages="errorMessages"
        return-object
        :clearable="clearable"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
    />
</template>

<script>
import { mapActions } from 'pinia';

import { useFeedbackTokensCollectionStore } from '@/stores/feedbackTokensCollection';

export default {
    name: 'FeedbackTokensCollectionSelect',

    props: {
        modelValue: {
            type: Object,
            default: null
        },

        clearable: {
            type: Boolean,
            default: false
        },

        errorMessages: {
            type: String,
            default: ''
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            tokensCollections: [],
            tokensCollection: null,
            loading: false
        };
    },

    watch: {
        modelValue: {
            handler(newVal) {
                this.tokensCollection = newVal;
            },
            immediate: true
        }
    },

    async created() {
        await this.doGetTokensCollections();
    },

    methods: {
        ...mapActions(useFeedbackTokensCollectionStore, {
            getTokensCollections: 'index'
        }),

        handleInput(value) {
            this.$emit('update:model-value', value);
        },

        async doGetTokensCollections(search = '') {
            try {
                const { rows } = await this.getTokensCollections({
                    search,
                    perPage: 10
                });

                this.tokensCollections = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of token collections!');
            }
        }
    }
};
</script>
