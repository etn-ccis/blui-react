import React from 'react';
import { GlobalStyles } from '@mui/material';

const GlobalSizeVariables = (): React.ReactNode => (
    <GlobalStyles
        styles={{
            '[data-size="s"]': {
                // === Typography ===
                '--blui-h1-font-size': '96px',
                '--blui-h5-font-size': '30px',
                '--blui-h6-font-size': '20px',
                '--blui-subtitle1-font-size': '18px',
                '--blui-subtitle2-font-size': '16px',
                '--blui-body1-font-size': '16px',
                '--blui-body2-font-size': '14px',
                '--blui-caption-font-size': '12px',
                '--blui-overline-font-size': '10px',
                '--blui-button-font-size': '14px',
                '--blui-overline-letter-spacing': '2px',
                '--blui-overline-font-weight': '600',

                // === Base Sizing ===
                '--blui-bar-height': '56px',
                '--blui-small-icon': '18px',
                '--blui-normal-icon': '24px',
                '--blui-dialog-radius': '4px',
                '--blui-stroke': '1px',
                '--blui-divider': '1px',
                '--blui-screen-corner-radius': '4px',
                '--blui-timestamp-width': '64px',
                '--blui-toggle-knob': '20px',
                '--blui-toggle-knob-icon': '18px',
                '--blui-toggle-track': '14px',
                '--blui-toggle-track-width': '34px',
                '--blui-toggle-padding': '2px',
                '--blui-toggle-container-padding': '12px',
                '--blui-toggle-track-radius': '32px',
                '--blui-toggle-track-opacity': '0.38',
                '--blui-toggle-disabled-opacity': '0.8',
                '--blui-slider-thin': '6px',
                '--blui-tooltip-radius': '3px',
                '--blui-tooltip-arrow': '12px',
                '--blui-ring-chart-size': '64px',
                '--blui-impact-icon': '96px',
                '--blui-impact-avatar-icon': '80px',
                '--blui-scrollbar-rail-width': '70px',
                '--blui-appbar-padding': '16px',

                // === Status Bar Sizing ===
                '--blui-status-bar': '32px',
                '--blui-status-text': '12px',
                '--blui-status-icon': '24px',
                '--blui-status-eaton-logo': '16px',

                // === Empty State Sizing ===
                '--blui-empty-state-icon': '96px',
                '--blui-empty-state-spacing': '16px',
                '--blui-empty-state-title': '0px',
                '--blui-empty-state-body': '0px',

                // === Navigation ===
                '--blui-tab-text': '12px',
                '--blui-tab-icon': '24px',
                '--blui-indicator': '8px',
                '--blui-drawer-width': '300px',
                '--blui-drawer-item': '52px',
                '--blui-drawer-eaton-logo': '28px',
                '--blui-narrow-rail': '56px',
                '--blui-wide-rail': '72px',
                '--blui-rail-icon': '24px',
                '--blui-indicator-border-radius': '32px',

                // === Drawer ===
                '--blui-drawer-header-title': '20px',
                '--blui-drawer-header-subtitle': '16px',
                '--blui-drawer-padding': '16px',
                '--blui-drawer-title-weight': '600',
                '--blui-drawer-subtitle-weight': '400',
                '--blui-drawer-footer-gap': '8px',
                '--blui-drawer-rail-header-gap': '16px',
                '--blui-rail-footer-logo-width': '48px',
                '--blui-rail-footer-logo-height': '13px',

                // === Button ===
                '--blui-button-height': '36px',
                '--blui-button-text': '14px',
                '--blui-button-icon': '18px',
                '--blui-round-button-radius': '160px',
                '--blui-button-radius': '4px',
                '--blui-button-padding': '16px',
                '--blui-selected-stroke': '2px',
                '--blui-in-bar-button': '28px',
                '--blui-disabled-button-border-width': '0px',
                '--blui-segmented-button-height': '36px',
                '--blui-segmented-button-padding': '16px',
                '--blui-segmented-round-button-radius': '160px',

                // === Avatar ===
                '--blui-avatar-size': '40px',
                '--blui-avatar-text': '16px',
                '--blui-avatar-icon': '24px',
                '--blui-avatar-grade-text': '16px',
                '--blui-avatar-medium-size': '48px',
                '--blui-avatar-medium-text': '16px',
                '--blui-avatar-medium-icon': '32px',
                '--blui-avatar-large-size': '64px',
                '--blui-avatar-large-text': '26px',
                '--blui-avatar-large-icon': '40px',
                '--blui-avatar-extra-large-size': '72px',
                '--blui-avatar-extra-large-text': '30px',
                '--blui-avatar-extra-large-icon': '40px',
                '--blui-avatar-extra-extra-large-size': '96px',
                '--blui-avatar-extra-extra-large-text': '40px',
                '--blui-avatar-extra-extra-large-icon': '40px',

                // === Input ===
                '--blui-input-padding': '8px',
                '--blui-input-inner-height': '40px',
                '--blui-input-dense-inner-height': '40px',
                '--blui-input-assistive-height': '32px',
                '--blui-input-text': '16px',
                '--blui-input-stroke': '1px',
                '--blui-input-active-stroke': '2px',
                '--blui-input-radius': '4px',

                // === Card ===
                '--blui-card-radius': '4px',
                '--blui-card-header-footer': '48px',
                '--blui-card-header-foot-text': '14px',
                '--blui-card-header-footer-icon': '24px',

                // === Heroes ===
                '--blui-hero-icon': '36px',
                '--blui-hero-value': '20px',

                // === List Item Tag ===
                '--blui-list-item-min-height': '0px',
                '--blui-list-item-tag-text': '10px',
                '--blui-list-item-tag-weight': '800',
                '--blui-list-item-tag-spacing': '2px',
                '--blui-list-item-tag-height': '16px',
                '--blui-list-item-tag-padding': '4px',
                '--blui-list-item-tag-border-radius': '2px',
                '--blui-list-item-tag-uppercase': 'true',

                // === List Item ===
                '--blui-status-stripe': '6px',
                '--blui-resistive-scrollbar': '54px',
                '--blui-system-scrollbar': '6px',
                '--blui-info-list-item-padding': '16px',

                // === Chip ===
                '--blui-chip-height': '32px',
                '--blui-chip-radius': '160px',
                '--blui-chip-rectangular-radius': '8px',
                '--blui-chip-icon': '18px',
                '--blui-chip-avatar': '24px',
                '--blui-chip-avatar-text': '10px',
                '--blui-module-width': '136px',
                '--blui-module-tile-width': '64px',
                '--blui-chip-avatar-radius': '200px',

                // === Progress and Steppers ===
                '--blui-progress-bar': '4px',
                '--blui-stepper-dot': '8px',
                '--blui-stepper-padding': '4px',
                '--blui-snackbar-progress-bar': '56px',
                '--blui-linear-stepper-avatar': '24px',
                '--blui-linear-stepper-icon': '16px',
            },
            '[data-size="m"]': {
                // === Typography ===
                '--blui-h1-font-size': '104px',
                '--blui-h5-font-size': '36px',
                '--blui-h6-font-size': '24px',
                '--blui-subtitle1-font-size': '22px',
                '--blui-subtitle2-font-size': '20px',
                '--blui-body1-font-size': '20px',
                '--blui-body2-font-size': '20px',
                '--blui-caption-font-size': '18px',
                '--blui-overline-font-size': '16px',
                '--blui-button-font-size': '24px',
                '--blui-overline-letter-spacing': '3px',
                '--blui-overline-font-weight': '600',

                // === Base Sizing ===
                '--blui-bar-height': '96px',
                '--blui-small-icon': '20px',
                '--blui-normal-icon': '32px',
                '--blui-dialog-radius': '40px',
                '--blui-stroke': '2px',
                '--blui-divider': '2px',
                '--blui-screen-corner-radius': '12px',
                '--blui-timestamp-width': '72px',
                '--blui-toggle-knob': '28px',
                '--blui-toggle-knob-icon': '24px',
                '--blui-toggle-track': '20px',
                '--blui-toggle-track-width': '48px',
                '--blui-toggle-padding': '2px',
                '--blui-toggle-container-padding': '12px',
                '--blui-toggle-track-radius': '32px',
                '--blui-toggle-track-opacity': '0.38',
                '--blui-toggle-disabled-opacity': '0.8',
                '--blui-slider-thin': '12px',
                '--blui-tooltip-radius': '6px',
                '--blui-tooltip-arrow': '20px',
                '--blui-ring-chart-size': '72px',
                '--blui-impact-icon': '120px',
                '--blui-impact-avatar-icon': '88px',

                // === Status Bar Sizing ===
                '--blui-status-bar': '56px',
                '--blui-status-text': '24px',
                '--blui-status-icon': '32px',
                '--blui-status-eaton-logo': '24px',

                // === Empty State Sizing ===
                '--blui-empty-state-icon': '120px',
                '--blui-empty-state-spacing': '24px',
                '--blui-empty-state-title': '0px',
                '--blui-empty-state-body': '0px',

                // === Navigation ===
                '--blui-tab-text': '20px',
                '--blui-tab-icon': '32px',
                '--blui-indicator': '16px',
                '--blui-drawer-width': '360px',
                '--blui-drawer-item': '68px',
                '--blui-drawer-eaton-logo': '36px',
                '--blui-narrow-rail': '64px',
                '--blui-wide-rail': '88px',
                '--blui-rail-icon': '32px',
                '--blui-indicator-border-radius': '32px',

                // === Drawer ===
                '--blui-drawer-header-title': '24px',
                '--blui-drawer-header-subtitle': '20px',
                '--blui-drawer-padding': '16px',
                '--blui-drawer-title-weight': '600',
                '--blui-drawer-subtitle-weight': '400',
                '--blui-drawer-footer-gap': '8px',
                '--blui-drawer-rail-header-gap': '32px',
                '--blui-rail-footer-logo-width': '48px',
                '--blui-rail-footer-logo-height': '13px',

                // === Button ===
                '--blui-button-height': '56px',
                '--blui-button-text': '24px',
                '--blui-button-icon': '32px',
                '--blui-round-button-radius': '160px',
                '--blui-button-radius': '8px',
                '--blui-button-padding': '32px',
                '--blui-selected-stroke': '4px',
                '--blui-in-bar-button': '48px',
                '--blui-disabled-button-border-width': '0px',
                '--blui-segmented-button-height': '56px',
                '--blui-segmented-button-padding': '24px',
                '--blui-segmented-round-button-radius': '160px',

                // === Avatar ===
                '--blui-avatar-size': '64px',
                '--blui-avatar-text': '24px',
                '--blui-avatar-icon': '32px',
                '--blui-avatar-grade-text': '24px',
                '--blui-avatar-medium-size': '64px',
                '--blui-avatar-medium-text': '24px',
                '--blui-avatar-medium-icon': '32px',
                '--blui-avatar-large-size': '80px',
                '--blui-avatar-large-text': '40px',
                '--blui-avatar-large-icon': '48px',
                '--blui-avatar-extra-large-size': '96px',
                '--blui-avatar-extra-large-text': '40px',
                '--blui-avatar-extra-large-icon': '40px',
                '--blui-avatar-extra-extra-large-size': '112px',
                '--blui-avatar-extra-extra-large-text': '48px',
                '--blui-avatar-extra-extra-large-icon': '40px',

                // === Input ===
                '--blui-input-padding': '8px',
                '--blui-input-inner-height': '56px',
                '--blui-input-dense-inner-height': '64px',
                '--blui-input-assistive-height': '40px',
                '--blui-input-text': '24px',
                '--blui-input-stroke': '2px',
                '--blui-input-active-stroke': '4px',
                '--blui-input-radius': '6px',

                // === Card ===
                '--blui-card-radius': '8px',
                '--blui-card-header-footer': '64px',
                '--blui-card-header-foot-text': '20px',
                '--blui-card-header-footer-icon': '32px',

                // === Heroes ===
                '--blui-hero-icon': '44px',
                '--blui-hero-value': '28px',

                // === List Item Tag ===
                '--blui-list-item-min-height': '0px',
                '--blui-list-item-tag-text': '14px',
                '--blui-list-item-tag-weight': '800',
                '--blui-list-item-tag-spacing': '3px',
                '--blui-list-item-tag-height': '20px',
                '--blui-list-item-tag-padding': '6px',
                '--blui-list-item-tag-border-radius': '2px',
                '--blui-list-item-tag-uppercase': 'true',

                // === List Item ===
                '--blui-status-stripe': '12px',
                '--blui-resistive-scrollbar': '54px',
                '--blui-system-scrollbar': '12px',
                '--blui-scrollbar-rail-width': '70px',
                '--blui-info-list-item-padding': '16px',

                // === Chip ===
                '--blui-chip-height': '40px',
                '--blui-chip-radius': '160px',
                '--blui-chip-rectangular-radius': '16px',
                '--blui-chip-icon': '28px',
                '--blui-chip-avatar': '32px',
                '--blui-chip-avatar-text': '14px',
                '--blui-module-width': '152px',
                '--blui-module-tile-width': '80px',
                '--blui-chip-avatar-radius': '200px',

                // === Progress and Steppers ===
                '--blui-progress-bar': '8px',
                '--blui-stepper-dot': '12px',
                '--blui-stepper-padding': '6px',
                '--blui-snackbar-progress-bar': '96px',
                '--blui-linear-stepper-avatar': '32px',
                '--blui-linear-stepper-icon': '24px',
            },
            '[data-size="l"]': {
                // === Typography ===
                '--blui-h1-font-size': '104px',
                '--blui-h5-font-size': '36px',
                '--blui-h6-font-size': '24px',
                '--blui-subtitle1-font-size': '22px',
                '--blui-subtitle2-font-size': '20px',
                '--blui-body1-font-size': '20px',
                '--blui-body2-font-size': '20px',
                '--blui-caption-font-size': '18px',
                '--blui-overline-font-size': '16px',
                '--blui-button-font-size': '24px',
                '--blui-overline-letter-spacing': '3px',
                '--blui-overline-font-weight': '600',

                // === Base Sizing ===
                '--blui-bar-height': '96px',
                '--blui-small-icon': '20px',
                '--blui-normal-icon': '32px',
                '--blui-dialog-radius': '40px',
                '--blui-stroke': '2px',
                '--blui-divider': '2px',
                '--blui-screen-corner-radius': '12px',
                '--blui-timestamp-width': '72px',
                '--blui-toggle-knob': '28px',
                '--blui-toggle-knob-icon': '24px',
                '--blui-toggle-track': '20px',
                '--blui-toggle-track-width': '48px',
                '--blui-toggle-padding': '2px',
                '--blui-toggle-container-padding': '12px',
                '--blui-toggle-track-radius': '32px',
                '--blui-toggle-track-opacity': '0.38',
                '--blui-toggle-disabled-opacity': '0.8',
                '--blui-slider-thin': '16px',
                '--blui-tooltip-radius': '6px',
                '--blui-tooltip-arrow': '20px',
                '--blui-ring-chart-size': '72px',
                '--blui-impact-icon': '120px',
                '--blui-impact-avatar-icon': '88px',

                // === Status Bar Sizing ===
                '--blui-status-bar': '64px',
                '--blui-status-text': '24px',
                '--blui-status-icon': '32px',
                '--blui-status-eaton-logo': '28px',

                // === Empty State Sizing ===
                '--blui-empty-state-icon': '120px',
                '--blui-empty-state-spacing': '24px',
                '--blui-empty-state-title': '0px',
                '--blui-empty-state-body': '0px',

                // === Navigation ===
                '--blui-tab-text': '20px',
                '--blui-tab-icon': '32px',
                '--blui-indicator': '16px',
                '--blui-drawer-width': '360px',
                '--blui-drawer-item': '68px',
                '--blui-drawer-eaton-logo': '36px',
                '--blui-narrow-rail': '64px',
                '--blui-wide-rail': '88px',
                '--blui-rail-icon': '32px',
                '--blui-indicator-border-radius': '32px',

                // === Drawer ===
                '--blui-drawer-header-title': '24px',
                '--blui-drawer-header-subtitle': '20px',
                '--blui-drawer-padding': '16px',
                '--blui-drawer-title-weight': '600',
                '--blui-drawer-subtitle-weight': '400',
                '--blui-drawer-footer-gap': '8px',
                '--blui-drawer-rail-header-gap': '32px',
                '--blui-rail-footer-logo-width': '48px',
                '--blui-rail-footer-logo-height': '13px',

                // === Button ===
                '--blui-button-height': '80px',
                '--blui-button-text': '24px',
                '--blui-button-icon': '32px',
                '--blui-round-button-radius': '160px',
                '--blui-button-radius': '12px',
                '--blui-button-padding': '24px',
                '--blui-selected-stroke': '4px',
                '--blui-in-bar-button': '48px',
                '--blui-disabled-button-border-width': '0px',
                '--blui-segmented-button-height': '80px',
                '--blui-segmented-button-padding': '32px',
                '--blui-segmented-round-button-radius': '160px',

                // === Avatar ===
                '--blui-avatar-size': '64px',
                '--blui-avatar-text': '24px',
                '--blui-avatar-icon': '32px',
                '--blui-avatar-grade-text': '24px',
                '--blui-avatar-medium-size': '64px',
                '--blui-avatar-medium-text': '24px',
                '--blui-avatar-medium-icon': '32px',
                '--blui-avatar-large-size': '80px',
                '--blui-avatar-large-text': '32px',
                '--blui-avatar-large-icon': '48px',
                '--blui-avatar-extra-large-size': '96px',
                '--blui-avatar-extra-large-text': '40px',
                '--blui-avatar-extra-large-icon': '40px',
                '--blui-avatar-extra-extra-large-size': '112px',
                '--blui-avatar-extra-extra-large-text': '48px',
                '--blui-avatar-extra-extra-large-icon': '40px',

                // === Input ===
                '--blui-input-padding': '8px',
                '--blui-input-inner-height': '64px',
                '--blui-input-dense-inner-height': '72px',
                '--blui-input-assistive-height': '40px',
                '--blui-input-text': '24px',
                '--blui-input-stroke': '2px',
                '--blui-input-active-stroke': '4px',
                '--blui-input-radius': '6px',

                // === Card ===
                '--blui-card-radius': '8px',
                '--blui-card-header-footer': '64px',
                '--blui-card-header-foot-text': '20px',
                '--blui-card-header-footer-icon': '32px',

                // === Heroes ===
                '--blui-hero-icon': '44px',
                '--blui-hero-value': '28px',

                // === List Item Tag ===
                '--blui-list-item-min-height': '0px',
                '--blui-list-item-tag-text': '14px',
                '--blui-list-item-tag-weight': '800',
                '--blui-list-item-tag-spacing': '3px',
                '--blui-list-item-tag-height': '20px',
                '--blui-list-item-tag-padding': '6px',
                '--blui-list-item-tag-border-radius': '2px',
                '--blui-list-item-tag-uppercase': 'true',

                // === List Item ===
                '--blui-status-stripe': '12px',
                '--blui-resistive-scrollbar': '54px',
                '--blui-system-scrollbar': '12px',
                '--blui-scrollbar-rail-width': '70px',
                '--blui-info-list-item-padding': '16px',

                // === Chip ===
                '--blui-chip-height': '40px',
                '--blui-chip-radius': '160px',
                '--blui-chip-rectangular-radius': '16px',
                '--blui-chip-icon': '28px',
                '--blui-chip-avatar': '32px',
                '--blui-chip-avatar-text': '14px',
                '--blui-module-width': '160px',
                '--blui-module-tile-width': '80px',
                '--blui-chip-avatar-radius': '200px',

                // === Progress and Steppers ===
                '--blui-progress-bar': '10px',
                '--blui-stepper-dot': '16px',
                '--blui-stepper-padding': '8px',
                '--blui-snackbar-progress-bar': '96px',
                '--blui-linear-stepper-avatar': '32px',
                '--blui-linear-stepper-icon': '24px',
            },
            // Direct CSS targeting for @brightlayer-ui/react-components EmptyState
            '[data-size="s"] .BluiEmptyState-root': {
                padding: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="s"] .BluiEmptyState-icon': {
                fontSize: 'var(--blui-empty-state-icon)',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="s"] .BluiEmptyState-icon svg': {
                fontSize: 'var(--blui-empty-state-icon) !important',
            },
            '[data-size="s"] .BluiEmptyState-title': {
                fontSize: 'var(--blui-h6-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="s"] .BluiEmptyState-description': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            // Medium size targeting
            '[data-size="m"] .BluiEmptyState-root': {
                padding: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="m"] .BluiEmptyState-icon': {
                fontSize: 'var(--blui-empty-state-icon)',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="m"] .BluiEmptyState-icon svg': {
                fontSize: 'var(--blui-empty-state-icon) !important',
            },
            '[data-size="m"] .BluiEmptyState-title': {
                fontSize: 'var(--blui-h6-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="m"] .BluiEmptyState-description': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            // Large size targeting
            '[data-size="l"] .BluiEmptyState-root': {
                padding: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="l"] .BluiEmptyState-icon': {
                fontSize: 'var(--blui-empty-state-icon)',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="l"] .BluiEmptyState-icon svg': {
                fontSize: 'var(--blui-empty-state-icon) !important',
            },
            '[data-size="l"] .BluiEmptyState-title': {
                fontSize: 'var(--blui-h6-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            '[data-size="l"] .BluiEmptyState-description': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
                marginBottom: 'var(--blui-empty-state-spacing)',
            },
            // Direct CSS targeting for @brightlayer-ui/react-components AppBar
            '[data-size="s"] .BluiAppBar-root': {
                padding: '0 var(--blui-appbar-padding)',
            },
            '[data-size="s"] .BluiAppBar-collapsed': {
                height: 'var(--blui-bar-height) !important',
            },
            '[data-size="s"] .BluiAppBar-root.Mui-expanded': {
                padding: 'var(--blui-appbar-padding) !important',
            },
            '[data-size="m"] .BluiAppBar-root': {
                padding: '0 var(--blui-appbar-padding)',
            },
            '[data-size="m"] .BluiAppBar-collapsed': {
                height: 'var(--blui-bar-height) !important',
            },
            '[data-size="m"] .BluiAppBar-root.Mui-expanded': {
                padding: '16px',
            },
            '[data-size="l"] .BluiAppBar-root': {
                padding: '0 var(--blui-appbar-padding)',
            },
            '[data-size="l"] .BluiAppBar-collapsed': {
                height: 'var(--blui-bar-height) !important',
            },
            '[data-size="l"] .BluiAppBar-root.Mui-expanded': {
                padding: '16px',
            },
            // === Drawer Component Overrides ===
            // Drawer - Size S
            '[data-size="s"] .BluiDrawer-root': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="s"] .BluiDrawer-content': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="s"] .BluiDrawerHeader-root': {
                height: 'var(--blui-bar-height) !important',
                // padding: '0 16px !important',
                // gap: '16px !important',
            },
            '[data-size="s"] .BluiDrawerHeader-navigation svg': {
                width: 'var(--blui-normal-icon) !important',
                height: 'var(--blui-normal-icon) !important',
            },
            '[data-size="s"] .BluiDrawerHeader-title': {
                fontSize: 'var(--blui-drawer-header-title) !important',
                fontWeight: 'var(--blui-drawer-title-weight) !important',
            },
            '[data-size="s"] .BluiDrawerHeader-subtitle': {
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
            },
            '[data-size="s"] .BluiDrawerNavItem-root': {
                display: 'flex !important',
                width: 'var(--blui-drawer-width) !important',
                height: 'var(--blui-drawer-item) !important',
                alignItems: 'center !important',
            },
            '[data-size="s"] .BluiDrawerNavItem-title': {
                flex: '1 0 0 !important',
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="s"] .BluiDrawerNavItem-titleActive': {
                fontWeight: 'var(--blui-drawer-title-weight) !important',
            },
            '[data-size="s"] .BluiDrawerFooter-root': {
                width: 'var(--blui-drawer-width) !important',
                minHeight: 'var(--blui-bar-height) !important',
                padding: 'var(--blui-drawer-padding) !important',
                gap: 'var(--blui-drawer-footer-gap) !important',
            },
            '[data-size="s"] .BluiDrawerFooter-root > div > div > div:last-child': {
                display: 'flex !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'flex-end !important',
                flex: '1 0 0 !important',
            },
            '[data-size="s"] .BluiDrawerFooter-root .MuiTypography-caption': {
                fontSize: 'var(--blui-caption-font-size) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="s"] .BluiDrawerRailItem-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
                padding: 'var(--blui-drawer-padding) 8px !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
            },
            '[data-size="s"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-bar-height) !important',
                padding: '0 var(--blui-drawer-padding) !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
                gap: 'var(--blui-drawer-rail-header-gap) !important',
                flexShrink: '0 !important',
            },
            '[data-size="s"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-content': {
                display: 'none !important',
            },
            '[data-size="s"] .BluiDrawer-root:has(.BluiDrawerRailItem-root)': {
                width: 'var(--blui-wide-rail) !important',
            },
            '[data-size="s"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root': {
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
            },
            '[data-size="s"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root img': {
                width: 'var(--blui-rail-footer-logo-width) !important',
                height: 'var(--blui-rail-footer-logo-height) !important',
            },
            '[data-size="s"] .BluiDrawer-rail .BluiDrawer-content': {
                width: 'var(--blui-wide-rail) !important',
            },

            // Drawer - Size M
            '[data-size="m"] .BluiDrawer-root': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="m"] .BluiDrawer-content': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="m"] .BluiDrawerHeader-root': {
                height: 'var(--blui-bar-height) !important',
                // padding: '0 16px !important',
                // gap: '32px !important',
            },
            '[data-size="m"] .BluiDrawerHeader-navigation svg': {
                width: 'var(--blui-normal-icon) !important',
                height: 'var(--blui-normal-icon) !important',
            },
            '[data-size="m"] .BluiDrawerHeader-title': {
                fontSize: 'var(--blui-drawer-header-title) !important',
                fontWeight: 'var(--blui-drawer-title-weight) !important',
                lineHeight: 'initial !important',
            },
            '[data-size="m"] .BluiDrawerHeader-subtitle': {
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
            },
            '[data-size="m"] .BluiDrawerNavItem-root': {
                display: 'flex !important',
                width: 'var(--blui-drawer-width) !important',
                height: 'var(--blui-drawer-item) !important',
                alignItems: 'center !important',
            },
            '[data-size="m"] .BluiDrawerNavItem-title': {
                flex: '1 0 0 !important',
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="m"] .BluiDrawerNavItem-titleActive': {
                fontWeight: 'var(--blui-drawer-title-weight) !important',
            },
            '[data-size="m"] .BluiDrawerFooter-root': {
                width: 'var(--blui-drawer-width) !important',
                minHeight: 'var(--blui-bar-height) !important',
                padding: 'var(--blui-drawer-padding) !important',
                gap: 'var(--blui-drawer-footer-gap) !important',
            },
            '[data-size="m"] .BluiDrawerFooter-root > div > div > div:last-child': {
                display: 'flex !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'flex-end !important',
                flex: '1 0 0 !important',
            },
            '[data-size="m"] .BluiDrawerFooter-root .MuiTypography-caption': {
                fontSize: 'var(--blui-caption-font-size) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="m"] .BluiDrawerRailItem-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
                padding: 'var(--blui-drawer-padding) 8px !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
            },
            '[data-size="m"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-bar-height) !important',
                padding: '0 var(--blui-drawer-padding) !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
                gap: 'var(--blui-drawer-rail-header-gap) !important',
                flexShrink: '0 !important',
            },
            '[data-size="m"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-content': {
                display: 'none !important',
            },
            '[data-size="m"] .BluiDrawer-root:has(.BluiDrawerRailItem-root)': {
                width: 'var(--blui-wide-rail) !important',
            },
            '[data-size="m"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root': {
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
            },
            '[data-size="m"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root img': {
                width: 'var(--blui-rail-footer-logo-width) !important',
                height: 'var(--blui-rail-footer-logo-height) !important',
            },
            '[data-size="m"] .BluiDrawer-rail .BluiDrawer-content': {
                width: 'var(--blui-wide-rail) !important',
            },

            // Drawer - Size L
            '[data-size="l"] .BluiDrawer-root': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="l"] .BluiDrawer-content': {
                width: 'var(--blui-drawer-width) !important',
            },
            '[data-size="l"] .BluiDrawerHeader-root': {
                height: 'var(--blui-bar-height) !important',
                // padding: '0 16px !important',
                // gap: '32px !important',
            },
            '[data-size="l"] .BluiDrawerHeader-navigation svg': {
                width: 'var(--blui-normal-icon) !important',
                height: 'var(--blui-normal-icon) !important',
            },
            '[data-size="l"] .BluiDrawerHeader-title': {
                fontSize: 'var(--blui-drawer-header-title) !important',
                fontWeight: 'var(--blui-drawer-title-weight) !important',
                lineHeight: 'initial !important',
            },
            '[data-size="l"] .BluiDrawerHeader-subtitle': {
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
            },
            '[data-size="l"] .BluiDrawerNavItem-root': {
                display: 'flex !important',
                width: 'var(--blui-drawer-width) !important',
                height: 'var(--blui-drawer-item) !important',
                alignItems: 'center !important',
            },
            '[data-size="l"] .BluiDrawerNavItem-title': {
                flex: '1 0 0 !important',
                fontSize: 'var(--blui-drawer-header-subtitle) !important',
                fontWeight: 'var(--blui-drawer-subtitle-weight) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="l"] .BluiDrawerNavItem-titleActive': {
                fontWeight: 'var(--blui-drawer-title-weight) !important',
            },
            '[data-size="l"] .BluiDrawerFooter-root': {
                width: 'var(--blui-drawer-width) !important',
                minHeight: 'var(--blui-bar-height) !important',
                padding: 'var(--blui-drawer-padding) !important',
                gap: 'var(--blui-drawer-footer-gap) !important',
            },
            '[data-size="l"] .BluiDrawerFooter-root > div > div > div:last-child': {
                display: 'flex !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'flex-end !important',
                flex: '1 0 0 !important',
            },
            '[data-size="l"] .BluiDrawerFooter-root .MuiTypography-caption': {
                fontSize: 'var(--blui-caption-font-size) !important',
                lineHeight: 'normal !important',
            },
            '[data-size="l"] .BluiDrawerRailItem-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
                padding: 'var(--blui-drawer-padding) 8px !important',
                flexDirection: 'column !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
            },
            '[data-size="l"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-root': {
                display: 'flex !important',
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-bar-height) !important',
                padding: '0 var(--blui-drawer-padding) !important',
                justifyContent: 'center !important',
                alignItems: 'center !important',
                gap: 'var(--blui-drawer-rail-header-gap) !important',
                flexShrink: '0 !important',
            },
            '[data-size="l"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerHeader-content': {
                display: 'none !important',
            },
            '[data-size="l"] .BluiDrawer-root:has(.BluiDrawerRailItem-root)': {
                width: 'var(--blui-wide-rail) !important',
            },
            '[data-size="l"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root': {
                width: 'var(--blui-wide-rail) !important',
                height: 'var(--blui-wide-rail) !important',
            },
            '[data-size="l"] .BluiDrawer-root:has(.BluiDrawerRailItem-root) .BluiDrawerFooter-root img': {
                width: 'var(--blui-rail-footer-logo-width) !important',
                height: 'var(--blui-rail-footer-logo-height) !important',
            },
            '[data-size="l"] .BluiDrawer-rail .BluiDrawer-content': {
                width: 'var(--blui-wide-rail) !important',
            },

            // Direct CSS targeting for @brightlayer-ui/react-components ListItemTag
            '[data-size="s"] .BluiListItemTag-root': {
                fontSize: 'var(--blui-list-item-tag-text) !important',
                fontWeight: 'var(--blui-list-item-tag-weight) !important',
                letterSpacing: 'var(--blui-list-item-tag-spacing) !important',
                height: 'var(--blui-list-item-tag-height) !important',
                padding: '0 var(--blui-list-item-tag-padding) !important',
                borderRadius: 'var(--blui-list-item-tag-border-radius) !important',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'var(--blui-list-item-tag-height)',
                lineHeight: 'var(--blui-list-item-tag-height) !important',
            },
            '[data-size="m"] .BluiListItemTag-root': {
                fontSize: 'var(--blui-list-item-tag-text) !important',
                fontWeight: 'var(--blui-list-item-tag-weight) !important',
                letterSpacing: 'var(--blui-list-item-tag-spacing) !important',
                height: 'var(--blui-list-item-tag-height) !important',
                padding: '0 var(--blui-list-item-tag-padding) !important',
                borderRadius: 'var(--blui-list-item-tag-border-radius) !important',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'var(--blui-list-item-tag-height)',
                lineHeight: 'var(--blui-list-item-tag-height) !important',
            },
            '[data-size="l"] .BluiListItemTag-root': {
                fontSize: 'var(--blui-list-item-tag-text) !important',
                fontWeight: 'var(--blui-list-item-tag-weight) !important',
                letterSpacing: 'var(--blui-list-item-tag-spacing) !important',
                height: 'var(--blui-list-item-tag-height) !important',
                padding: '0 var(--blui-list-item-tag-padding) !important',
                borderRadius: 'var(--blui-list-item-tag-border-radius) !important',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'var(--blui-list-item-tag-height)',
                lineHeight: 'var(--blui-list-item-tag-height) !important',
            },
            // Direct CSS targeting for @brightlayer-ui/react-components Hero
            '[data-size="s"] .BluiHero-icon': {
                fontSize: 'var(--blui-hero-icon)',
            },
            '[data-size="s"] .BluiHero-icon svg': {
                fontSize: 'var(--blui-hero-icon) !important',
            },
            '[data-size="s"] .BluiChannelValue-root': {
                marginTop: '4px',
            },
            '[data-size="s"] .BluiChannelValue-icon': {
                fontSize: 'var(--blui-normal-icon)',
            },
            '[data-size="s"] .BluiChannelValue-icon svg': {
                fontSize: 'var(--blui-normal-icon) !important',
            },
            '[data-size="s"] .BluiChannelValue-value': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="s"] .BluiChannelValue-units': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="s"] .BluiHero-label': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
            },
            // Medium size targeting
            '[data-size="m"] .BluiHero-icon': {
                fontSize: 'var(--blui-hero-icon)',
            },
            '[data-size="m"] .BluiHero-icon svg': {
                fontSize: 'var(--blui-hero-icon) !important',
            },
            '[data-size="m"] .BluiChannelValue-root': {
                marginTop: '4px',
            },
            '[data-size="m"] .BluiChannelValue-icon': {
                fontSize: 'var(--blui-normal-icon)',
            },
            '[data-size="m"] .BluiChannelValue-icon svg': {
                fontSize: 'var(--blui-normal-icon) !important',
            },
            '[data-size="m"] .BluiChannelValue-value': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="m"] .BluiChannelValue-units': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="m"] .BluiHero-label': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
            },
            // Large size targeting
            '[data-size="l"] .BluiHero-icon': {
                fontSize: 'var(--blui-hero-icon)',
            },
            '[data-size="l"] .BluiHero-icon svg': {
                fontSize: 'var(--blui-hero-icon) !important',
            },
            '[data-size="l"] .BluiChannelValue-root': {
                marginTop: '4px',
            },
            '[data-size="l"] .BluiChannelValue-icon': {
                fontSize: 'var(--blui-normal-icon)',
            },
            '[data-size="l"] .BluiChannelValue-icon svg': {
                fontSize: 'var(--blui-normal-icon) !important',
            },
            '[data-size="l"] .BluiChannelValue-value': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="l"] .BluiChannelValue-units': {
                fontSize: 'var(--blui-hero-value) !important',
            },
            '[data-size="l"] .BluiHero-label': {
                fontSize: 'var(--blui-subtitle2-font-size) !important',
            },
        }}
    />
);

export default GlobalSizeVariables;
