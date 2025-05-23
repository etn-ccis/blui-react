import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { SuccessScreenBase, SuccessScreenProps } from '..';
import { useRegistrationWorkflowContext, useRegistrationContext } from '../../contexts';

/**
 * Component that renders a success screen for when registration completes.
 *
 * @param {SuccessScreenProps} props - props of SuccessScreen
 *
 * @category Component
 */

export const RegistrationSuccessScreen: React.FC<SuccessScreenProps> = (props) => {
    const { navigate, routeConfig } = useRegistrationContext();
    const { t } = useTranslation();

    const {
        screenData: {
            AccountDetails: { firstName, lastName },
            CreateAccount: { emailAddress: email },
            Other: {
                // @ts-ignore
                RegistrationSuccessScreen: { organizationName: organization },
            },
        },
    } = useRegistrationWorkflowContext();

    const {
        onDismiss = (): void => navigate(routeConfig.LOGIN!),
        canDismiss = true,
        WorkflowCardHeaderProps,
        WorkflowCardActionsProps,
        EmptyStateProps,
        ...otherRegistrationSuccessScreenProps
    } = props;

    const workflowCardHeaderProps = {
        title: t('bluiRegistration:REGISTRATION.STEPS.COMPLETE'),
        ...WorkflowCardHeaderProps,
    };

    const workflowCardActionsProps = {
        nextLabel: t('bluiCommon:ACTIONS.FINISH'),
        showNext: true,
        canGoNext: canDismiss,
        fullWidthButton: true,
        ...WorkflowCardActionsProps,
        onNext: (): void => {
            onDismiss();
            WorkflowCardActionsProps?.onNext?.();
        },
    };

    const emptyStateProps = {
        icon: <CheckCircle color={'primary'} sx={{ fontSize: 100, mb: 2 }} />,
        title: `${t('bluiCommon:MESSAGES.WELCOME')}, ${firstName} ${lastName}!`,
        description: (
            <Typography variant="subtitle2">
                <Trans
                    i18nKey={
                        email
                            ? 'bluiRegistration:REGISTRATION.SUCCESS_MESSAGE_ALT'
                            : 'bluiRegistration:REGISTRATION.SUCCESS_MESSAGE_ALT_WITHOUT_EMAIL_PROVIDED'
                    }
                    values={{ email, organization }}
                >
                    Your account has successfully been created with the email <b>{email}</b> belonging to the
                    <b>{` ${String(organization)}`}</b> org.
                </Trans>
            </Typography>
        ),
        ...EmptyStateProps,
    };

    return (
        <SuccessScreenBase
            WorkflowCardHeaderProps={workflowCardHeaderProps}
            WorkflowCardActionsProps={workflowCardActionsProps}
            EmptyStateProps={emptyStateProps}
            {...otherRegistrationSuccessScreenProps}
        />
    );
};
