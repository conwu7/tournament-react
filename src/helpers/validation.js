import * as Yup from 'yup';

// Signup - username, email, password
// Login - username, password
// Search - toWatch Notes

export const SignUpSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Too Short - Min 6 characters')
        .max(20, 'Too Long - Max 20 characters')
        .required('Required')
        .matches(/^[a-z0-9]+$/i, 'Must be Alphanumeric')
        .lowercase(),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Too Short - Min 6 characters')
        .max(128, 'Too Long - Max 128 characters')
        .required('Required')
});
export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Required')
});

export const SearchSchema = Yup.object().shape({
    searchString: Yup.string()
        .min(2, 'Search with at least 2 characters')
        .required('Required')
});
