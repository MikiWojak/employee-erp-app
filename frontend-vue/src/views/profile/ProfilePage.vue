<template>
    <v-row>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Profile page</h1>

            <v-form @submit.prevent="handleUpdateProfile">
                <v-text-field
                    v-model="formData.firstName"
                    label="First name"
                    :error-messages="handleError('firstName')"
                    @blur="onBlur('firstName')"
                    @input="clearServerError('firstName')"
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    :error-messages="handleError('lastName')"
                    @blur="onBlur('lastName')"
                    @input="clearServerError('lastName')"
                />

                <date-picker
                    v-model="formData.dateOfBirth"
                    label="Date of birth"
                    :max="maxDate"
                    :error-messages="handleError('dateOfBirth')"
                    @blur="onBlur('dateOfBirth')"
                    @update:model-value="clearServerError('dateOfBirth')"
                />

                <v-text-field
                    v-model="formData.email"
                    type="email"
                    label="Email"
                    :error-messages="handleError('email')"
                    @blur="onBlur('email')"
                    @input="clearServerError('email')"
                />

                <v-file-input
                    v-model="formData.avatar"
                    label="Avatar"
                    prepend-icon="mdi-camera"
                    :accept="acceptedAvatarFileTypes.join(',')"
                    :error-messages="handleError('avatar')"
                    @blur="onBlur('avatar')"
                    @update:model-value="clearServerError('avatar')"
                />

                <!-- // @TODO Preview image if no image -->
                <p>Avatar preview:</p>
                <img
                    v-if="previewAvatar"
                    :src="previewAvatar"
                    alt="Avatar preview image"
                    class="preview-avatar"
                />
                <img
                    v-else
                    src="/image-icon.png"
                    alt="Avatar preview image placeholder"
                    class="preview-avatar"
                />

                <!--                // @TODO Consider MDI instead of picture-->
                <!--                <v-icon-->
                <!--                    v-else-->
                <!--                    icon="mdi-image-area"-->
                <!--                    size="x-large"-->
                <!--                    class="preview-avatar"-->
                <!--                />-->

                <v-btn
                    type="submit"
                    width="100%"
                    :disabled="loading"
                    class="mt-6"
                >
                    <span>Save</span>
                </v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import dayjs from 'dayjs';
import { defineAsyncComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, email, helpers } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import BaseForm from '@/components/common/BaseForm';
import getFullImagePath from '@/helpers/getFullImagePath';
import fileSizeFileObj from '@/helpers/validators/fileSizeFileObj';
import fileTypeFileObj from '@/helpers/validators/fileTypeFileObj';

export default {
    name: 'ProfilePage',

    components: {
        DatePicker: defineAsyncComponent(
            () => import('@/components/inputs/DatePicker')
        )
    },

    extends: BaseForm,

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        const defaultForm = {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: ''
        };

        return {
            formData: { ...defaultForm },
            maxDate: dayjs().format('YYYY-MM-DD'),
            loading: false,
            acceptedAvatarFileTypes: ['image/jpeg', 'image/png']
        };
    },

    validations() {
        return {
            formData: {
                firstName: {
                    required
                },
                lastName: {
                    required
                },
                dateOfBirth: {
                    required
                },
                email: {
                    required,
                    email
                },
                avatar: {
                    fileType: helpers.withMessage(
                        'File type not supported. Please upload JPG, JPEG or PNG.',
                        fileTypeFileObj(this.acceptedAvatarFileTypes)
                    ),
                    fileSize: helpers.withMessage(
                        'File should have up to 5 MB.',
                        fileSizeFileObj(5)
                    )
                }
            }
        };
    },

    computed: {
        ...mapState(useAuthStore, ['loggedUser']),

        previewAvatar() {
            if (this.formData?.avatar?.id) {
                return getFullImagePath(this.formData.avatar);
            }

            if (this.formData?.avatar instanceof File) {
                return URL.createObjectURL(this.formData.avatar);
            }

            return null;
        }
    },

    watch: {
        'formData.avatar'(val) {
            if (!val) {
                this.formData.avatarId = null;
            }
        }
    },

    created() {
        this.updateForm();
    },

    methods: {
        ...mapActions(useAuthStore, ['updateProfile']),

        async handleUpdateProfile() {
            this.serverErrors = [];

            this.v$.formData.$touch();

            if (this.v$.formData.$invalid) {
                return;
            }

            this.v$.formData.$reset();

            try {
                this.loading = true;

                const { firstName, lastName, dateOfBirth, email, avatar } =
                    this.formData;

                const multipartFormData = new FormData();
                multipartFormData.append('firstName', firstName);
                multipartFormData.append('lastName', lastName);
                multipartFormData.append('dateOfBirth', dateOfBirth);
                multipartFormData.append('email', email);

                if (avatar instanceof File) {
                    multipartFormData.append('avatar', avatar);
                } else if (avatar?.id) {
                    multipartFormData.append('avatar', JSON.stringify(avatar));
                }

                await this.updateProfile(multipartFormData);

                this.updateForm();

                this.$toast.success('Profile updated');
            } catch (error) {
                const { response } = error;

                if (
                    response?.status === HTTP.BAD_REQUEST &&
                    response?.data?.errors
                ) {
                    this.formErrorMessage = 'Invalid credentials.';
                    this.serverErrors = response.data.errors;

                    return;
                }

                console.error(error);

                this.formErrorMessage = 'Something went wrong...';
            } finally {
                this.loading = false;
            }
        },

        updateForm() {
            this.formData = { ...this.loggedUser };
        }
    }
};
</script>
<style scoped>
.preview-avatar {
    display: block;
    width: 200px;
    height: 200px;
    object-fit: cover;
}
</style>
