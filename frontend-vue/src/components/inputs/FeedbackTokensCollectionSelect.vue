<template>
    <v-autocomplete
        v-model="tokensCollection"
        :items="tokensCollections"
        :loading="loading"
        hide-no-data
        item-title="number"
        item-value="id"
        label="Tokens Collection"
        prepend-icon="mdi-ticket-account"
        placeholder="Start searching by number"
        :error-messages="errorMessages"
        return-object
        :clearable="clearable"
        :hide-details="hideDetails"
        @blur="$emit('blur')"
        @update:model-value="handleInput"
        @update:search="doSearch"
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
        },

        hideDetails: {
            type: Boolean,
            default: false
        }
    },

    emits: ['blur', 'update:model-value'],

    data() {
        return {
            tokensCollections: [],
            tokensCollection: null,
            timer: null,
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
                    perPage: 50
                });

                this.tokensCollections = rows;
            } catch (error) {
                console.error(error);

                this.$toast.error('Cannot get a list of token collections!');
            }
        },

        async doSearch(search) {
            if (!search) {
                return;
            }

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.loading = true;

            this.timer = setTimeout(async () => {
                await this.doGetTokensCollections(search);

                this.loading = false;
            }, 1000);
        }
    }
};
</script>
