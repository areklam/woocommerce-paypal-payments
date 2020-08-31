<?php
declare(strict_types=1);

namespace Inpsyde\PayPalCommerce\ApiClient\Entity;

use Inpsyde\PayPalCommerce\ApiClient\TestCase;
use Mockery;

class PayerTest extends TestCase
{

    public function testPayer()
    {
        $birthday = new \DateTime();
        $address = Mockery::mock(Address::class);
        $address
            ->expects('toArray')
            ->andReturn(['address']);
        $phone = Mockery::mock(PhoneWithType::class);
        $phone
            ->expects('toArray')
            ->andReturn(['phone']);
        $taxInfo = Mockery::mock(PayerTaxInfo::class);
        $taxInfo
            ->expects('toArray')
            ->andReturn(['taxInfo']);
        $payerName = Mockery::mock(PayerName::class);
        $payerName
            ->expects('toArray')
            ->andReturn(['payerName']);
        $email = 'email@example.com';
        $payerId = 'payerId';
        $payer = new Payer(
            $payerName,
            $email,
            $payerId,
            $address,
            $birthday,
            $phone,
            $taxInfo
        );

        $this->assertEquals($payerName, $payer->name());
        $this->assertEquals($email, $payer->emailAddress());
        $this->assertEquals($payerId, $payer->payerId());
        $this->assertEquals($address, $payer->address());
        $this->assertEquals($birthday, $payer->birthDate());
        $this->assertEquals($phone, $payer->phone());
        $this->assertEquals($taxInfo, $payer->taxInfo());

        $array = $payer->toArray();
        $this->assertEquals($birthday->format('Y-m-d'), $array['birth_date']);
        $this->assertEquals(['payerName'], $array['name']);
        $this->assertEquals($email, $array['email_address']);
        $this->assertEquals(['address'], $array['address']);
        $this->assertEquals($payerId, $array['payer_id']);
        $this->assertEquals(['phone'], $array['phone']);
        $this->assertEquals(['taxInfo'], $array['tax_info']);
    }

    public function testPayerNoId()
    {
        $birthday = new \DateTime();
        $address = Mockery::mock(Address::class);
        $address
            ->expects('toArray')
            ->andReturn(['address']);
        $phone = Mockery::mock(PhoneWithType::class);
        $phone
            ->expects('toArray')
            ->andReturn(['phone']);
        $taxInfo = Mockery::mock(PayerTaxInfo::class);
        $taxInfo
            ->expects('toArray')
            ->andReturn(['taxInfo']);
        $payerName = Mockery::mock(PayerName::class);
        $payerName
            ->expects('toArray')
            ->andReturn(['payerName']);
        $email = 'email@example.com';
        $payerId = '';
        $payer = new Payer(
            $payerName,
            $email,
            $payerId,
            $address,
            $birthday,
            $phone,
            $taxInfo
        );

        $this->assertEquals($payerId, $payer->payerId());

        $array = $payer->toArray();
        $this->assertArrayNotHasKey('payer_id', $array);
    }

    public function testPayerNoPhone()
    {
        $birthday = new \DateTime();
        $address = Mockery::mock(Address::class);
        $address
            ->expects('toArray')
            ->andReturn(['address']);
        $phone = null;
        $taxInfo = Mockery::mock(PayerTaxInfo::class);
        $taxInfo
            ->expects('toArray')
            ->andReturn(['taxInfo']);
        $payerName = Mockery::mock(PayerName::class);
        $payerName
            ->expects('toArray')
            ->andReturn(['payerName']);
        $email = 'email@example.com';
        $payerId = 'payerId';
        $payer = new Payer(
            $payerName,
            $email,
            $payerId,
            $address,
            $birthday,
            $phone,
            $taxInfo
        );

        $this->assertEquals($phone, $payer->phone());

        $array = $payer->toArray();
        $this->assertArrayNotHasKey('phone', $array);
    }

    public function testPayerNoTaxInfo()
    {
        $birthday = new \DateTime();
        $address = Mockery::mock(Address::class);
        $address
            ->expects('toArray')
            ->andReturn(['address']);
        $phone = Mockery::mock(PhoneWithType::class);
        $phone
            ->expects('toArray')
            ->andReturn(['phone']);
        $taxInfo = null;
        $payerName = Mockery::mock(PayerName::class);
        $payerName
            ->expects('toArray')
            ->andReturn(['payerName']);
        $email = 'email@example.com';
        $payerId = 'payerId';
        $payer = new Payer(
            $payerName,
            $email,
            $payerId,
            $address,
            $birthday,
            $phone,
            $taxInfo
        );

        $this->assertEquals($taxInfo, $payer->taxInfo());

        $array = $payer->toArray();
        $this->assertArrayNotHasKey('tax_info', $array);
    }

    public function testPayerNoBirthDate()
    {
        $birthday = null;
        $address = Mockery::mock(Address::class);
        $address
            ->expects('toArray')
            ->andReturn(['address']);
        $phone = Mockery::mock(PhoneWithType::class);
        $phone
            ->expects('toArray')
            ->andReturn(['phone']);
        $taxInfo = Mockery::mock(PayerTaxInfo::class);
        $taxInfo
            ->expects('toArray')
            ->andReturn(['taxInfo']);
        $payerName = Mockery::mock(PayerName::class);
        $payerName
            ->expects('toArray')
            ->andReturn(['payerName']);
        $email = 'email@example.com';
        $payerId = 'payerId';
        $payer = new Payer(
            $payerName,
            $email,
            $payerId,
            $address,
            $birthday,
            $phone,
            $taxInfo
        );

        $this->assertEquals($birthday, $payer->birthDate());

        $array = $payer->toArray();
        $this->assertArrayNotHasKey('birth_date', $array);
    }
}
