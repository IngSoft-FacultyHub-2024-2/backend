import * as yup from 'yup';

const inputTemporaryDismisssSchema = yup.object().shape({
    //check if date is grater than today
    retentionDate: yup.date().required().min(new Date(), 'retention date must be greater than today')
});

export default inputTemporaryDismisssSchema;