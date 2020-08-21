<?php

declare(strict_types=1);

namespace Inpsyde\PayPalCommerce\WcGateway\Settings;

use Inpsyde\PayPalCommerce\ApiClient\Authentication\PayPalBearer;
use Inpsyde\PayPalCommerce\Onboarding\State;
use Inpsyde\PayPalCommerce\WcGateway\Gateway\CreditCardGateway;
use Inpsyde\PayPalCommerce\WcGateway\Gateway\PayPalGateway;
use Inpsyde\PayPalCommerce\Webhooks\WebhookRegistrar;
use Psr\SimpleCache\CacheInterface;

class SettingsListener
{

    public const NONCE = 'ppcp-settings';
    private $settings;
    private $settingFields;
    private $webhookRegistrar;
    private $cache;
    private $state;
    public function __construct(
        Settings $settings,
        array $settingFields,
        WebhookRegistrar $webhookRegistrar,
        CacheInterface $cache,
        State $state
    ) {

        $this->settings = $settings;
        $this->settingFields = $settingFields;
        $this->webhookRegistrar = $webhookRegistrar;
        $this->cache = $cache;
        $this->state = $state;
    }

    public function listen()
    {

        if (! $this->isValidUpdateRequest()) {
            return;
        }

        /**
         * Nonce verification is done in self::isValidUpdateRequest
         */
        //phpcs:disable WordPress.Security.NonceVerification.Missing
        //phpcs:disable WordPress.Security.NonceVerification.Recommended
        if (isset($_POST['save']) && sanitize_text_field(wp_unslash($_POST['save'])) === 'reset') {
            $this->settings->reset();
            $this->settings->persist();
            $this->webhookRegistrar->unregister();
            if ($this->cache->has(PayPalBearer::CACHE_KEY)) {
                $this->cache->delete(PayPalBearer::CACHE_KEY);
            }
            return;
        }

        //phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        //phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
        /**
         * Sanitization is done at a later stage.
         */
        $rawData = (isset($_POST['ppcp'])) ? (array) wp_unslash($_POST['ppcp']) : [];
        $settings = $this->retrieveSettingsFromRawData($rawData);
        if ($_GET['section'] === PayPalGateway::ID) {
            $settings['enabled'] = isset($_POST['woocommerce_ppcp-gateway_enabled'])
                && absint($_POST['woocommerce_ppcp-gateway_enabled']) === 1;
        }
        if ($_GET['section'] === CreditCardGateway::ID) {
            $dccEnabledPostKey = 'woocommerce_ppcp-credit-card-gateway_enabled';
            $settings['dcc_gateway_enabled'] = isset($_POST[$dccEnabledPostKey])
                && absint($_POST[$dccEnabledPostKey]) === 1;
        }
        $this->maybeRegisterWebhooks($settings);

        foreach ($settings as $id => $value) {
            $this->settings->set($id, $value);
        }
        $this->settings->persist();
        if ($this->cache->has(PayPalBearer::CACHE_KEY)) {
            $this->cache->delete(PayPalBearer::CACHE_KEY);
        }
        //phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
        //phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        //phpcs:enable WordPress.Security.NonceVerification.Missing
    }

    private function maybeRegisterWebhooks(array $settings)
    {

        if (! $this->settings->has('client_id') && $settings['client_id']) {
            $this->webhookRegistrar->register();
        }
        if ($this->settings->has('client_id')) {
            $currentSecret = $this->settings->has('client_secret') ?
                $this->settings->get('client_secret') : '';
            if (
                $settings['client_id'] !== $this->settings->get('client_id')
                || $settings['client_secret'] !== $currentSecret
            ) {
                $this->webhookRegistrar->unregister();
                $this->webhookRegistrar->register();
            }
        }
    }

    //phpcs:disable Inpsyde.CodeQuality.NestingLevel.MaxExceeded
    //phpcs:disable Generic.Metrics.CyclomaticComplexity.TooHigh
    //phpcs:disable Inpsyde.CodeQuality.FunctionLength.TooLong
    private function retrieveSettingsFromRawData(array $rawData): array
    {
        if (! isset($_GET['section'])) {
            return [];
        }
        $settings = [];
        foreach ($this->settingFields as $key => $config) {
            if (! in_array($this->state->currentState(), $config['screens'], true)) {
                continue;
            }
            if (
                $config['gateway'] === 'dcc'
                && sanitize_text_field(wp_unslash($_GET['section'])) !== 'ppcp-credit-card-gateway'
            ) {
                continue;
            }
            if (
                $config['gateway'] === 'paypal'
                && sanitize_text_field(wp_unslash($_GET['section'])) !== 'ppcp-gateway'
            ) {
                continue;
            }
            switch ($config['type']) {
                case 'checkbox':
                    $settings[$key] = isset($rawData[$key]);
                    break;
                case 'text':
                case 'ppcp-text-input':
                case 'ppcp-password':
                    $settings[$key] = isset($rawData[$key]) ? sanitize_text_field($rawData[$key]) : '';
                    break;
                case 'password':
                    if (empty($rawData[$key])) {
                        break;
                    }
                    $settings[$key] = sanitize_text_field($rawData[$key]);
                    break;
                case 'ppcp-multiselect':
                    $values = isset($rawData[$key]) ? (array) $rawData[$key] : [];
                    $valuesToSave = [];
                    foreach ($values as $index => $rawValue) {
                        $value = sanitize_text_field($rawValue);
                        if (! in_array($value, array_keys($config['options']), true)) {
                            continue;
                        }
                        $valuesToSave[] = $value;
                    }
                    $settings[$key] = $valuesToSave;
                    break;
                case 'select':
                    $options = array_keys($config['options']);
                    $settings[$key] = isset($rawData[$key]) && in_array(
                        sanitize_text_field($rawData[$key]),
                        $options,
                        true
                    ) ? sanitize_text_field($rawData[$key]) : null;
                    break;
            }
        }
        return $settings;
    }
    //phpcs:enable Inpsyde.CodeQuality.NestingLevel.MaxExceeded
    //phpcs:enable Generic.Metrics.CyclomaticComplexity.TooHigh

    private function isValidUpdateRequest(): bool
    {

        if (
            ! isset($_REQUEST['section'])
            || ! in_array(
                sanitize_text_field(wp_unslash($_REQUEST['section'])),
                ['ppcp-gateway', 'ppcp-credit-card-gateway'],
                true
            )
        ) {
            return false;
        }

        if (! current_user_can('manage_options')) {
            return false;
        }

        if (
            ! isset($_POST['ppcp-nonce'])
            || !wp_verify_nonce(
                sanitize_text_field(wp_unslash($_POST['ppcp-nonce'])),
                self::NONCE
            )
        ) {
            return false;
        }
        return true;
    }
}
