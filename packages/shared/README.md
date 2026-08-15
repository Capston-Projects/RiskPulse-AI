# Shared domain model

This package contains the shared synthetic data model for RiskPulse AI.

## Core model

The `SyntheticPolicyRecord` type models a fictional insurance portfolio entry for development and testing.

### Customer profile fields

- `customerId`: unique synthetic customer identifier.
- `policyholderName`: fictional customer name for readable fixtures.
- `age`: age in years.
- `gender`: demographic category used for reporting and segmentation only.
- `postcode`: residential postcode used for regional risk analysis.
- `tenureYears`: number of years the customer has been with the insurer.
- `employmentStatus`: current household or employment context.
- `maritalStatus`: household status used in underwriting context.
- `yearsAsPolicyholder`: number of years the customer has held this policy.

### Policy details

- `policyId`: unique synthetic policy identifier.
- `policyStatus`: current lifecycle state of the policy.
- `effectiveDate`: policy start date.
- `expiryDate`: policy end date.
- `coverageType`: insurance cover selected.
- `vehicleUse`: use-case for the insured vehicle.
- `annualMileage`: expected annual distance travelled.
- `priorInsuranceYears`: previous insurance history length.
- `renewalCount`: number of renewals processed.

### Vehicle profile

- `vehicleId`: unique vehicle identifier.
- `make`, `model`, `year`: core vehicle metadata.
- `fuelType`: engine fuel source.
- `transmission`: manual or automatic gear type.
- `engineSizeCc`: engine capacity in cubic centimetres.
- `vehicleValue`: insured or market value estimate.
- `garagingPostcode`: storage location for the vehicle.
- `isModified`: whether the vehicle has non-standard modifications.

### Claims history

- `claimsInLast3Years`: total claim count over the last three-year window.
- `atFaultClaims`: number of claims where the insured is considered at fault.
- `totalClaimAmount`: cumulative claim amount in currency units.
- `lastClaimMonthsAgo`: months since the most recent claim; null when no claim exists.
- `claimSeverity`: derived risk severity indicator for claim history.
- `nearMissCount`: count of near-miss incidents or flagged risk events.

### Telematics profile

- `telematicsEnabled`: whether driving data collection is active.
- `averageSpeedKph`: mean driving speed.
- `harshBrakingEventsPer1000Km`: braking intensity indicator.
- `nightDrivingRatio`: proportion of driving during higher-risk night periods.
- `phoneDistractionScore`: proxy for distraction risk when available.
- `monthlyDistanceKm`: average monthly distance travelled.

### Premium and economic indicators

- `currentPremiumAnnual`: current annual policy premium.
- `basePremiumAnnual`: underlying premium before policy adjustments.
- `discountsApplied`: applied discounts or credits.
- `excessAmount`: policy deductible or excess.
- `paymentFrequency`: billing cadence.
- `renewalNoticeDays`: notice period before renewal.
- `inflationIndex`, `fuelPriceIndex`, `repairCostIndex`, `regionalRiskIndex`, `claimsTrendIndex`: macroeconomic and market risk indicators relevant to pricing and claim trends.

## Synthetic data

The `syntheticPolicyRecords` collection contains 10 fictional records for development, testing, and local demonstrations. All values are synthetic and designed for portfolio-level experimentation without representing any real customer or policy.
