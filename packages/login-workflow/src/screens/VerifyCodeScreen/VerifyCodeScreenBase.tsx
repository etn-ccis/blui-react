/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useCallback, useEffect } from 'react';
import { VerifyCodeScreenProps } from './types';
import { WorkflowCard } from '../../components/WorkflowCard';
import { WorkflowCardActions } from '../../components/WorkflowCard/WorkflowCardActions';
import { WorkflowCardBody } from '../../components/WorkflowCard/WorkflowCardBody';
import { WorkflowCardHeader } from '../../components/WorkflowCard/WorkflowCardHeader';
import { WorkflowCardInstructions } from '../../components/WorkflowCard/WorkflowCardInstructions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorManager from '../../components/Error/ErrorManager';

/**
 * Component that renders a screen that prompts a user to enter the confirmation code
 * that was sent to the email address that they used to register.
 *
 * @param {VerifyCodeScreenProps} props - props of VerifyCodeScreen base component
 *
 * @category Component
 */

export const VerifyCodeScreenBase: React.FC<React.PropsWithChildren<VerifyCodeScreenProps>> = (props) => {
    const {
        codeValidator,
        onResend,
        resendInstructions,
        resendLabel,
        verifyCodeInputLabel,
        initialValue,
        errorDisplayConfig,
        verifyCodeTextFieldProps,
        WorkflowCardBaseProps: cardBaseProps = {},
        WorkflowCardInstructionProps: instructionsProps = {},
        WorkflowCardActionsProps: actionsProps = {},
        WorkflowCardHeaderProps: headerProps = {},
        ...otherProps
    } = props;

    const [verifyCode, setVerifyCode] = React.useState(initialValue ?? '');
    const [shouldValidateCode, setShouldValidateCode] = React.useState(false);
    const [isCodeValid, setIsCodeValid] = React.useState(codeValidator ? codeValidator(initialValue ?? '') : false);
    const [codeError, setCodeError] = React.useState('');

    const handleVerifyCodeInputChange = useCallback(
        (code: string) => {
            setVerifyCode(code);
            if (codeValidator) {
                const validatorResponse = codeValidator(code);
                setIsCodeValid(typeof validatorResponse === 'boolean' ? validatorResponse : false);
                setCodeError(typeof validatorResponse === 'string' ? validatorResponse : '');
            }
        },
        [codeValidator]
    );

    useEffect(() => {
        if (verifyCode.length > 0) {
            setShouldValidateCode(true);
            handleVerifyCodeInputChange(verifyCode);
        }
    }, []);

    const handleOnNext = (): void => {
        const { onNext } = actionsProps;
        if (onNext) onNext({ code: verifyCode });
    };

    const handleOnPrevious = (): void => {
        const { onPrevious } = actionsProps;
        if (onPrevious) onPrevious({ code: verifyCode });
    };

    return (
        <WorkflowCard {...cardBaseProps} {...otherProps}>
            <WorkflowCardHeader {...headerProps} />
            <WorkflowCardInstructions {...instructionsProps} />
            <WorkflowCardBody>
                <ErrorManager {...errorDisplayConfig}>
                    <TextField
                        label={verifyCodeInputLabel}
                        fullWidth
                        value={verifyCode}
                        variant="filled"
                        error={shouldValidateCode && !isCodeValid}
                        helperText={shouldValidateCode && codeError}
                        {...verifyCodeTextFieldProps}
                        onBlur={(e): void => {
                            // eslint-disable-next-line no-unused-expressions
                            verifyCodeTextFieldProps?.onBlur && verifyCodeTextFieldProps.onBlur(e);
                            setShouldValidateCode(true);
                        }}
                        onChange={(evt): void => {
                            // eslint-disable-next-line no-unused-expressions
                            verifyCodeTextFieldProps?.onChange && verifyCodeTextFieldProps.onChange(evt);
                            handleVerifyCodeInputChange(evt.target.value);
                        }}
                        onKeyUp={(e): void => {
                            if (e.key === 'Enter' && ((verifyCode.length > 0 && isCodeValid) || actionsProps.canGoNext))
                                handleOnNext();
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography>
                            {resendInstructions}
                            <Typography
                                sx={{ fontSize: 'inherit', textTransform: 'initial', '&:hover': { cursor: 'pointer' } }}
                                onClick={(): void => onResend?.()}
                                color="primary"
                                variant={'button'}
                            >
                                {' '}
                                <u>{resendLabel}</u>
                            </Typography>
                        </Typography>
                    </Box>
                </ErrorManager>
            </WorkflowCardBody>
            <WorkflowCardActions
                {...actionsProps}
                canGoNext={(verifyCode.length > 0 && isCodeValid && actionsProps.canGoNext) as any}
                onNext={handleOnNext}
                onPrevious={handleOnPrevious}
            />
        </WorkflowCard>
    );
};
