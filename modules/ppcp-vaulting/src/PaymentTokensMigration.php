<?php
/**
 * The payment tokens migration handler.
 *
 * @package WooCommerce\PayPalCommerce\Vaulting
 */

declare(strict_types=1);

namespace WooCommerce\PayPalCommerce\Vaulting;

use Exception;
use Psr\Log\LoggerInterface;
use WC_Payment_Tokens;
use WooCommerce\PayPalCommerce\ApiClient\Entity\PaymentToken;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\CreditCardGateway;
use WooCommerce\PayPalCommerce\WcGateway\Gateway\PayPalGateway;

/**
 * Class PaymentTokensMigration
 */
class PaymentTokensMigration {
	/**
	 * The payment token factory.
	 *
	 * @var PaymentTokenFactory
	 */
	private $payment_token_factory;

	/**
	 * The payment token repository.
	 *
	 * @var PaymentTokenRepository
	 */
	private $payment_token_repository;

	/**
	 * The logger.
	 *
	 * @var LoggerInterface
	 */
	private $logger;

	/**
	 * PaymentTokensMigration constructor.
	 *
	 * @param PaymentTokenFactory    $payment_token_factory The payment token factory.
	 * @param PaymentTokenRepository $payment_token_repository The payment token repository.
	 * @param LoggerInterface        $logger The logger.
	 */
	public function __construct(
		PaymentTokenFactory $payment_token_factory,
		PaymentTokenRepository $payment_token_repository,
		LoggerInterface $logger
	) {
		$this->payment_token_factory    = $payment_token_factory;
		$this->payment_token_repository = $payment_token_repository;
		$this->logger                   = $logger;
	}

	/**
	 * Migrates user existing vaulted tokens into WC payment tokens API.
	 *
	 * @param int $id WooCommerce customer id.
	 */
	public function migrate_payment_tokens_for_user( int $id ):void {
		$tokens    = $this->payment_token_repository->all_for_user_id( $id );
		$wc_tokens = WC_Payment_Tokens::get_customer_tokens( $id );

		foreach ( $tokens as $token ) {
			if ( $this->token_exist( $wc_tokens, $token ) ) {
				continue;
			}

			if ( isset( $token->source()->card ) ) {
				$payment_token_acdc = $this->payment_token_factory->create( 'acdc' );
				assert( $payment_token_acdc instanceof PaymentTokenACDC );

				$payment_token_acdc->set_token( $token->id() );
				$payment_token_acdc->set_user_id( $id );
				$payment_token_acdc->set_gateway_id( CreditCardGateway::ID );
				$payment_token_acdc->set_last4( $token->source()->card->last_digits );
				$payment_token_acdc->set_card_type( $token->source()->card->brand );

				try {
					$payment_token_acdc->save();
				} catch ( Exception $exception ) {
					$this->logger->error(
						"Could not save WC payment token credit card {$token->id()} for user {$id}. "
						. $exception->getMessage()
					);
					continue;
				}
			} elseif ( $token->source()->paypal ) {
				$payment_token_paypal = $this->payment_token_factory->create( 'paypal' );
				assert( $payment_token_paypal instanceof PaymentTokenPayPal );

				$payment_token_paypal->set_token( $token->id() );
				$payment_token_paypal->set_user_id( $id );
				$payment_token_paypal->set_gateway_id( PayPalGateway::ID );

				$email = $token->source()->paypal->payer->email_address ?? '';
				if ( $email && is_email( $email ) ) {
					$payment_token_paypal->set_email( $email );
				}

				try {
					$payment_token_paypal->save();
				} catch ( Exception $exception ) {
					$this->logger->error(
						"Could not save WC payment token PayPal {$token->id()} for user {$id}. "
						. $exception->getMessage()
					);
					continue;
				}
			}
		}
	}

	/**
	 * Checks if given PayPal token exist as WC Payment Token.
	 *
	 * @param array        $wc_tokens WC Payment Tokens.
	 * @param PaymentToken $token PayPal Token ID.
	 * @return bool
	 */
	private function token_exist( array $wc_tokens, PaymentToken $token ): bool {
		foreach ( $wc_tokens as $wc_token ) {
			if ( $wc_token->get_token() === $token->id() ) {
				return true;
			}
		}

		return false;
	}
}