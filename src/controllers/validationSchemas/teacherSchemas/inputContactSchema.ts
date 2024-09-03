import * as yup from 'yup';

const inputContactSchema = yup.object().shape({
    mean: yup.string().required("Contact mean is required"),
    data: yup.string().required("Contact data is required"),
    prefered: yup.boolean().required("Preference is required"),
});

export default inputContactSchema;