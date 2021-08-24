import { TextField, Card, CardContent, CardHeader } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import Form from '@rjsf/material-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { makeStringChangeHandler } from './handlers';
import { InputProps } from './types';
import { getLaunchInputId } from './utils';
import { protobufValueToPrimitive, PrimitiveType } from './inputHelpers/struct';

const muiTheme = createMuiTheme({
    props: {
        MuiTextField: {
            variant: 'outlined'
        }
    }
});

/** Handles rendering of the input component for a Struct */
export const StructInput: React.FC<InputProps> = props => {
    const {
        error,
        label,
        name,
        onChange,
        typeDefinition: { literalType },
        value = ''
    } = props;
    const hasError = !!error;
    const helperText = hasError ? error : props.helperText;

    const [paramData, setParamData] = useState({});
    const onFormChange = ({ formData }, e) => {
        onChange(JSON.stringify(formData));
        setParamData(formData);
    };

    let jsonFormRenderable = false;
    let parsedJson: PrimitiveType = {};

    if (literalType?.metadata?.fields?.definitions?.structValue?.fields) {
        const keys = Object.keys(
            literalType?.metadata?.fields?.definitions?.structValue?.fields
        );

        if (keys[0]) {
            parsedJson = protobufValueToPrimitive(
                literalType.metadata.fields.definitions.structValue.fields[
                    `${keys[0]}`
                ]
            );

            if (parsedJson) jsonFormRenderable = true;
        }
    }

    return jsonFormRenderable ? (
        <MuiThemeProvider theme={muiTheme}>
            <Card>
                <CardHeader
                    title={label}
                    style={{ borderBottom: 'solid 1px gray' }}
                />
                <CardContent>
                    <Form
                        schema={JSON.parse(JSON.stringify(parsedJson))}
                        formData={paramData}
                        onChange={onFormChange}
                    >
                        <div></div>
                    </Form>
                </CardContent>
            </Card>
        </MuiThemeProvider>
    ) : (
        <TextField
            id={getLaunchInputId(name)}
            error={hasError}
            helperText={helperText}
            fullWidth={true}
            label={label}
            multiline={true}
            onChange={makeStringChangeHandler(onChange)}
            rowsMax={8}
            value={value}
            variant="outlined"
        />
    );
};
