import {FormBody} from "./login";
import {SignUpSchema} from "../../helpers/validation";


export default function SignUp() {
    return (
        <FormBody
            page="Sign Up"
            isCreating={true}
            showUsername={true}
            apiUrl="signup"
            validationSchema={SignUpSchema}
        />
    );
}