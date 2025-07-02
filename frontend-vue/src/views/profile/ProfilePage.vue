<template>
    <v-row>
        <v-col md="8" lg="6" class="mx-auto">
            <h1>Profile page</h1>

            <v-form @submit.prevent="handleUpdateProfile">
                <v-text-field
                    v-if="!isAdmin"
                    v-model="departmentName"
                    label="Department"
                    prepend-icon="mdi-office-building"
                    readonly
                />

                <v-text-field
                    v-model="roleName"
                    label="Role"
                    prepend-icon="mdi-folder-lock"
                    readonly
                />

                <v-text-field
                    v-model="formData.firstName"
                    label="First name"
                    prepend-icon="mdi-account-circle"
                    :error-messages="handleError('firstName')"
                    @blur="onBlur('firstName')"
                    @input="clearServerError('firstName')"
                />

                <v-text-field
                    v-model="formData.lastName"
                    label="Last name"
                    prepend-icon="mdi-account-circle"
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
                    prepend-icon="mdi-email"
                    :error-messages="handleError('email')"
                    @blur="onBlur('email')"
                    @input="clearServerError('email')"
                />

                <v-file-input
                    v-model="formData.avatar"
                    label="Avatar (optional)"
                    prepend-icon="mdi-camera"
                    :accept="acceptedAvatarFileTypes.join(',')"
                    :error-messages="handleError('avatar')"
                    @blur="onBlur('avatar')"
                    @update:model-value="clearServerError('avatar')"
                />

                <img
                    v-if="previewAvatar"
                    :src="previewAvatar"
                    alt="Avatar preview image"
                    class="preview-avatar image"
                />

                <div v-else class="preview-avatar empty">
                    <v-icon icon="mdi-image-area" size="x-large" />
                    <div class="text-center">
                        Select avatar above<br />
                        to see preview
                    </div>
                </div>

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
import {
    required,
    email,
    helpers,
    minLength,
    maxLength
} from '@vuelidate/validators';

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
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(255)
                },
                lastName: {
                    required,
                    minLengthValue: minLength(2),
                    maxLengthValue: maxLength(255)
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
                        'File type not supported.',
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
        ...mapState(useAuthStore, ['loggedUser', 'isAdmin']),

        previewAvatar() {
            if (this.formData?.avatar?.id) {
                return getFullImagePath(this.formData.avatar);
            }

            if (this.formData?.avatar instanceof File) {
                return URL.createObjectURL(this.formData.avatar);
            }

            return null;
        },

        departmentName() {
            return this.loggedUser?.department?.name || '';
        },

        roleName() {
            return this.loggedUser?.role?.name || '';
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
                    this.serverErrors = response.data.errors;

                    return;
                }

                console.error(error);
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
    width: 175px;
    height: 175px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.preview-avatar.image {
    display: block;
    object-fit: cover;
}

.preview-avatar.empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
