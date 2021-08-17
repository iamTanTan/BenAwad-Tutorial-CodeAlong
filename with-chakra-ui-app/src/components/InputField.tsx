import React from "react";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Textarea,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement
> & {
    name: string;
    label: string;
    textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size: _,
    ...props
}) => {
    let InputOrTextarea;
    if (textarea) InputOrTextarea = Textarea;
    else InputOrTextarea = Input;

    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea
                {...field}
                {...props}
                id={field.name}
                placeholder={props.placeholder}
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
