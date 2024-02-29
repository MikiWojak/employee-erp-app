import { FC } from 'react';
import { ErrorMessage } from 'formik';

interface Props {
    name: string;
    error: string | undefined;
}

const DisplayErrors: FC<Props> = ({ name, error }) => {
    return (
        <div className="text-red-500">
            {error ? error : <ErrorMessage name={name} component="span" />}
        </div>
    );
};

export default DisplayErrors;
