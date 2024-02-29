import * as Yup from 'yup';

const AddEditContractValidation = Yup.object({
    userId: Yup.string().required('This field is required.'),
    position: Yup.string()
        .required('This field is required.')
        .min(2, 'This field must have at least 2 letters.')
        .max(64, 'This field must have max 64 letters.'),
    startDate: Yup.string().required('This field is required.'),
    endDate: Yup.string().required('This field is required.'),
    vacationDaysPerYear: Yup.number().required('This field is required.')
});

export default AddEditContractValidation;
