```mermaid
%%{{
  init: {{
    'theme': 'base',
    'themeVariables': {{
      'primaryColor': '#EBF3FF',
      'primaryTextColor': '#1E3A5F',
      'primaryBorderColor': '#2563EB',
      'lineColor': '#7C3AED',
      'fontSize': '12px'
    }},
    'er': {{
      'layoutDirection': 'LR',
      'minEntityWidth': 100,
      'entityPadding': 12
    }}
  }}
}}%%
erDiagram
    AI_or_Robotics {
        string id
    }
    AccessRegistration {
        string userName
        string password
        string registrant
    }
    AccountHolder {
        string id
    }
    AccountProvider {
        string id
    }
    Activity {
        date statusChangeDate
        string statusCode
        date requestTime
        string name
    }
    ActivityAssignee {
        string id
    }
    ActivityOriginator {
        string id
    }
    ActivityPerformer {
        string id
    }
    ActivitySubjectParty {
        string id
    }
    AdditionalInterest {
        string description
        string rank
        string reason
    }
    AffectedParty {
        string id
    }
    AgreementApprover {
        string id
    }
    AgreementAssignee {
        string id
    }
    AgreementAssignor {
        string id
    }
    AgreementAuditor {
        string internalIndicator
    }
    AgreementGroupMember {
        string id
    }
    AgreementHolder {
        string rejectionReasonCode
    }
    AgreementManager {
        string id
    }
    AgreementPayer {
        string id
    }
    AgreementProducer {
        string interestPercentage
    }
    AgreementRequester {
        string id
    }
    AgreementServicer {
        string representativeTypeCode
    }
    AgreementUnderwriter {
        string id
    }
    Annuitant {
        string id
    }
    Applicant {
        integer noClaimDiscountDuration
        integer declaredClaimAmount
        integer declaredClaimCount
        string agreementTerminatedByInsurerIndicator
    }
    ArtDirector {
        string id
    }
    Beneficiary {
        string designationCode
        string irrevocableIndicator
        string legalWording
        string acceptedIndicator
    }
    BenefitBeneficiary {
        string vipIndicator
        string benefitBeneficiaryTypeCode
        string beneficiaryRelationWithLossAdjustmentSubjectCode
        string telephoneContactAvailability
    }
    Borrower {
        string id
    }
    Buyer {
        string id
    }
    CargoCarrier {
        string id
    }
    CatastropheReportingAgency {
        string id
    }
    Category {
        string subScheme
        string parentScheme
        string name
        string description
    }
    Cedent {
        string id
    }
    ChildOrganization {
        string organizationRelationship
    }
    CivilRelationship {
        date statusDate
        string spouse
        string name
        string typeCode
    }
    ClaimAdjuster {
        string id
    }
    ClaimApprover {
        string id
    }
    ClaimDeclarer {
        string insuredRelationshipCode
        string reportedLossNotification
    }
    ClaimExpert {
        string id
    }
    ClaimFollower {
        string id
    }
    ClaimLeader {
        string id
    }
    ClaimPayer {
        string id
    }
    ClaimRecorder {
        string id
    }
    ClaimRepresentative {
        string id
    }
    Claimant {
        string confirmationIndicator
        date confirmationDateTime
        string responsibilityPercentage
    }
    Claimee {
        string id
    }
    ComputerSystem {
        string id
    }
    Consignee {
        string id
    }
    Consignor {
        string id
    }
    ContributionPayer {
        string id
    }
    CopyEditor {
        string id
    }
    Copywriter {
        string id
    }
    Creator {
        string id
    }
    Creditor {
        string id
    }
    Customer {
        string importanceLevelCode
        integer claimAmount
        integer claimCount
        string statusCode
    }
    CustomerActivity {
        string id
    }
    CustomerRelationship {
        date customershipDateTime
        integer totalAnnualSubscriptionsAmount
        integer estimationOfLifeAgreementAmount
        string claimPeriodDuration
    }
    CustomerRelationshipStatus {
        string code
        string owningCustomerRelationship
    }
    Defendant {
        string id
    }
    DepartmentofMotorVehicles {
        string id
    }
    Driver {
        string insuredDuration
        string currentVehicleInsuranceReductionRate
    }
    Employee {
        integer annualTaxableBenefitAmount
        integer baseSalaryAmount
        integer bonusSalaryAmount
        string jobDescription
    }
    Employer {
        string employment
    }
    EmploymentActivity {
        string employment
        date endReasonCode
    }
    EmploymentRelationship {
        string occupationClassCode
        string jobDescription
        string location
        string businessUnit
    }
    EventParticipant {
        string id
    }
    FamilyMember {
        string relationNatureCode
        string relationship
    }
    FamilyRelationship {
        string familyMember
        integer childrenCount
    }
    FinancialServicesCompanyRegistration {
        string authorizedProductGroup
    }
    FoodandDrugAdministration {
        string id
    }
    Fronted {
        string id
    }
    Fronter {
        string id
    }
    GeneralOwnershipInformation {
        string ownedInsurableObject
        integer amount
        integer count
        string owningParty
    }
    GoalAssignee {
        string id
    }
    GoalAssignor {
        string id
    }
    Grantee {
        string id
    }
    Grantor {
        string id
    }
    GraphicsDesigner {
        string id
    }
    GroupManager {
        string group
    }
    GroupMember {
        string group
    }
    GroupMembership {
        string manager
        string member
    }
    Guarantor {
        integer guaranteeLimitAmount
    }
    HeadOfHousehold {
        string maintenancePercentage
        string headedHousehold
    }
    HealthCareProviderRegistration {
        string taxonomyCode
        string registrant
    }
    HouseholdRelationship {
        string homeOwnership
        date dependentAdultCount
        date dependentChildrenCount
        date youngestDependentChildBirthDateTime
    }
    InformationModelObject {
        string basicDataCompleteCode
        string typeName
        date creationDateTime
        string identifyingRiskExposure
    }
    InstalledSoftware {
        string id
    }
    InsurancePoolRelationship {
        string participant
        string administeringInsurancePool
        string participationPercentage
        string role
    }
    Insured {
        string legalWording
        string insurableInterestCode
    }
    InsuredBorrower {
        string borrowerQuality
        string loanSharePercentage
    }
    Insurer {
        string rejectionReasonCode
        string writtenLinePercentage
        string signedLinePercentage
        string leaderIndicator
    }
    InternalMedicalApprover {
        string identifier
    }
    InvolvedDriver {
        string youngDriverIndicator
    }
    Lead_ {
        string name
        string leadSource
        string conversionIndicator
        string utilizingProductSpecification
    }
    LegalRepresentation {
        string representative
        string representedParty
        string legalIndicator
        boolean activeIndicator
    }
    Lender {
        string id
    }
    Lessee {
        string id
    }
    Lessor {
        string id
    }
    LossAdjuster {
        string servicedLossAdjusterRelationship
    }
    LossNotificationAuthority {
        string id
    }
    MarketingManager {
        string id
    }
    MarketingSpecialist {
        string id
    }
    MedicalExaminer {
        string id
    }
    MembershipRegistration {
        string statusCode
        string registrant
    }
    Obligee {
        string id
    }
    OpponentThirdParty {
        string insurerName
        integer agreementNumber
        string liabilityPercentage
    }
    Organization {
        date foundationDateTime
        date dissolutionDateTime
        integer memberCount
        string statusCode
    }
    OrganizationDetail {
        string referencePeriod
        string detailOwner
    }
    OrganizationName {
        string usageCode
        string owner
    }
    OrganizationOwner {
        string ownershipRelationship
        string interestPercentage
    }
    OrganizationRegistration {
        string registrant
        string registrationAuthorityTypeCode
    }
    OrganizationRelationship {
        string child
        string parent
    }
    OtherHouseholdMember {
        string includingHousehold
        date dependentTypeCode
    }
    OwnedOrganization {
        string ownershipRelationship
    }
    Owner {
        string id
    }
    OwnershipRelationship {
        string organizationOwner
        string ownedOrganization
    }
    ParentOrganization {
        string organizationRelationship
    }
    Party {
        string ownedGeneralOwnership
        string involvingCriminalEvent
        string preferredContactMethod
        string establishedFiscalDomicile
    }
    PartyActivity {
        string Subject
    }
    PartyDetail {
        string effectivePeriod
        string applicabilityCode
    }
    PartyMarketingInformation {
        string firstContactOrigin
        date firstContactDateTime
        string marketingOptionIndicator
    }
    PartyMatchingEngineCategory {
        string id
    }
    PartyName {
        string effectivePeriod
        string description
        string languageCode
        string fullName
    }
    PartyRegistration {
        string id
    }
    PartyRole {
        string playingParty
        string ownedCapability
        string name
        string preferredContactMethod
    }
    PartyRoleInActivity {
        string includingActivity
    }
    PartyRoleInAgreement {
        string basingPartyRoleInAgreementSpecification
        string includingAgreementBase
        string utilizedAgreementActivity
    }
    PartyRoleInAgreementSpecification {
        string controlledPartyRoleInRelationshipSpecification
        string basedPartyRoleInAgreement
        string utilizingPartyRoleInRelationship
    }
    PartyRoleInBusinessEntityRelationship {
        string basingPartyRoleInRelationshipSpecification
        string inludingParty
    }
    PartyRoleInBusinessEntityRelationshipSpecification {
        string utilizedPartyRoleInAgreementSpecification
        string controllingPartyRoleInAgreementSpecification
        string basedPartyRoleInRelationship
    }
    PartyRoleInClaim {
        string involvingClaimBase
        string utilizedClaimActivty
    }
    PartyRoleInEvent {
        string includingEvent
    }
    PartyRoleInFinancialTransaction {
        string includingFinancialTransaction
    }
    PartyRoleInGoal {
        string includingGoal
    }
    PartyRoleInMarketing {
        string includingMarketingCampaign
    }
    PartyRoleInProduct {
        string includingProductSpecification
    }
    PartyRoleInRegistration {
        string includingRegistration
    }
    PartyRoleOnInsurableObject {
        string involvedInsurableObject
        string interestPercentage
    }
    PartyRolePlace {
        string placeQualifier
        string place
        string qualifyingPartyRole
    }
    PartyRoleRegistration {
        string id
    }
    PartyRoleRelationship {
        string effectivePeriod
        string description
        string relationshipStatus
        date statusDate
    }
    PartyRoleRelationshipStatus {
        string owningPartyRoleRelationship
    }
    Patient {
        string homeboundIndicator
        string lastDischargeFacilityType
    }
    Person {
        string detail
        date deathDateTime
        date birthDateTime
        string deathIndicator
    }
    PersonActivity {
        string id
    }
    PersonDetail {
        string owningPerson
    }
    PersonName {
        string givenName
        string middleName
        string prefixTitleCode
        string surname
    }
    PersonRegistration {
        string registrant
    }
    PhysicalObjectUser {
        string id
    }
    Pilot {
        date flightTimeDuration
        string flightMeasurementDuration
        integer totalFlightDuration
        string insuredDuration
    }
    PlacingExchange {
        string id
    }
    Plaintiff {
        string id
    }
    Principal {
        string id
    }
    ProducerRegistration {
        string registrationAuthorityTypeCode
        string registrant
    }
    ProducerRelationship {
        string distributionMethodType
        string identifier
        string insuranceProvider
        string insuranceProducer
    }
    ProductAdministrator {
        string id
    }
    ProductDistributor {
        string id
    }
    ProductManager {
        string id
    }
    ProfessionalServiceRelationship {
        string requester
        string provider
    }
    ProjectManager {
        string id
    }
    Registration {
        date statusDate
        string statusReasonCode
        string registrationAuthorityTypeCode
        date requestDateTime
    }
    RegistryAuthority {
        string jurisdictionPlace
        string administeredRegistry
        string authorizingOrganization
    }
    RemoteHealthMonitoringSystem {
        string id
    }
    RemoteMonitoringSystem {
        string id
    }
    Representative {
        string function
        boolean activeIndicator
        string legalIndicator
        string representation
    }
    RepresentedParty {
        string representation
    }
    ResponsibleParty {
        string id
    }
    RiskManager {
        string id
    }
    Role {
        string effectivePeriod
        string description
        string playerRole
        string role
    }
    RoleSpecification {
        string id
    }
    Seller {
        string id
    }
    ServiceProvider {
        string customerRelationship
        string requestedProfessionalServiceRelationship
        string providedProfessionalServiceRelationship
    }
    ShareHolder {
        string id
    }
    Signatory {
        date signatureDateTime
        string designationCode
    }
    Spouse {
        string relationshipCode
        string includingCivilRelationship
    }
    Status {
        string name
        string reason
        date effectiveDateTime
    }
    Surety {
        string id
    }
    TaxRegistration {
        string calculationTypeCode
        string registrant
        string membershipType
    }
    Telemetry {
        string id
    }
    VehicleTelematics {
        string id
    }
    Victim {
        string id
    }
    VirtualParty {
        string name
        string detail
    }
    VirtualPartyDetail {
        string owningVirtualParty
    }
    VirtualPartyName {
        string usageCode
        string owner
    }
    Witness {
        string providedTestimony
    }
    PartyMatchingEngineCategory }o--|| Category : "extends"
    Category }o--|| InformationModelObject : "extends"
    ClaimDeclarer }o--|| PartyRoleInClaim : "extends"
    InvolvedDriver }o--|| PartyRoleInClaim : "extends"
    ClaimExpert }o--|| PartyRoleInClaim : "extends"
    ClaimAdjuster }o--|| PartyRoleInClaim : "extends"
    ClaimRepresentative }o--|| PartyRoleInClaim : "extends"
    Witness }o--|| PartyRoleInClaim : "extends"
    Claimee }o--|| PartyRoleInClaim : "extends"
    Victim }o--|| PartyRoleInClaim : "extends"
    InternalMedicalApprover }o--|| PartyRoleInClaim : "extends"
    Claimant }o--|| PartyRoleInClaim : "extends"
    Defendant }o--|| PartyRoleInClaim : "extends"
    Plaintiff }o--|| PartyRoleInClaim : "extends"
    OpponentThirdParty }o--|| PartyRoleInClaim : "extends"
    Patient }o--|| PartyRoleInClaim : "extends"
    BenefitBeneficiary }o--|| PartyRoleInClaim : "extends"
    ClaimPayer }o--|| PartyRoleInClaim : "extends"
    LossAdjuster }o--|| PartyRoleInClaim : "extends"
    LossNotificationAuthority }o--|| PartyRoleInClaim : "extends"
    ClaimRecorder }o--|| PartyRoleInClaim : "extends"
    ClaimLeader }o--|| PartyRoleInClaim : "extends"
    ClaimFollower }o--|| PartyRoleInClaim : "extends"
    ClaimApprover }o--|| PartyRoleInClaim : "extends"
    Driver }o--|| PartyRoleInAgreement : "extends"
    Applicant }o--|| PartyRoleInAgreement : "extends"
    Signatory }o--|| PartyRoleInAgreement : "extends"
    AgreementApprover }o--|| PartyRoleInAgreement : "extends"
    AgreementUnderwriter }o--|| PartyRoleInAgreement : "extends"
    RiskManager }o--|| PartyRoleInAgreement : "extends"
    AccountHolder }o--|| PartyRoleInAgreement : "extends"
    AccountProvider }o--|| PartyRoleInAgreement : "extends"
    AgreementAssignee }o--|| PartyRoleInAgreement : "extends"
    Beneficiary }o--|| PartyRoleInAgreement : "extends"
    ContributionPayer }o--|| PartyRoleInAgreement : "extends"
    Creditor }o--|| PartyRoleInAgreement : "extends"
    Guarantor }o--|| PartyRoleInAgreement : "extends"
    Insurer }o--|| PartyRoleInAgreement : "extends"
    MedicalExaminer }o--|| PartyRoleInAgreement : "extends"
    AgreementHolder }o--|| PartyRoleInAgreement : "extends"
    AgreementPayer }o--|| PartyRoleInAgreement : "extends"
    AgreementServicer }o--|| PartyRoleInAgreement : "extends"
    AgreementManager }o--|| PartyRoleInAgreement : "extends"
    AgreementRequester }o--|| PartyRoleInAgreement : "extends"
    Cedent }o--|| PartyRoleInAgreement : "extends"
    Fronted }o--|| PartyRoleInAgreement : "extends"
    Fronter }o--|| PartyRoleInAgreement : "extends"
    AgreementProducer }o--|| PartyRoleInAgreement : "extends"
    InsuredBorrower }o--|| PartyRoleInAgreement : "extends"
    Pilot }o--|| PartyRoleInAgreement : "extends"
    Insured }o--|| PartyRoleInAgreement : "extends"
    AgreementAuditor }o--|| PartyRoleInAgreement : "extends"
    AdditionalInterest }o--|| PartyRoleInAgreement : "extends"
    Surety }o--|| PartyRoleInAgreement : "extends"
    Obligee }o--|| PartyRoleInAgreement : "extends"
    Principal }o--|| PartyRoleInAgreement : "extends"
    Borrower }o--|| PartyRoleInAgreement : "extends"
    Lender }o--|| PartyRoleInAgreement : "extends"
    Annuitant }o--|| PartyRoleInAgreement : "extends"
    PlacingExchange }o--|| PartyRoleInAgreement : "extends"
    AgreementAssignor }o--|| PartyRoleInAgreement : "extends"
    Lessor }o--|| PartyRoleInAgreement : "extends"
    Lessee }o--|| PartyRoleInAgreement : "extends"
    AgreementGroupMember }o--|| PartyRoleInAgreement : "extends"
    Grantee }o--|| PartyRoleInAgreement : "extends"
    Grantor }o--|| PartyRoleInAgreement : "extends"
    CargoCarrier }o--|| PartyRoleInAgreement : "extends"
    Consignee }o--|| PartyRoleInAgreement : "extends"
    Consignor }o--|| PartyRoleInAgreement : "extends"
    Seller }o--|| PartyRoleInAgreement : "extends"
    Buyer }o--|| PartyRoleInAgreement : "extends"
    Telemetry }o--|| PartyRoleInAgreement : "extends"
    AffectedParty }o--|| PartyRoleInEvent : "extends"
    EventParticipant }o--|| PartyRoleInEvent : "extends"
    ResponsibleParty }o--|| PartyRoleInEvent : "extends"
    ActivitySubjectParty }o--|| PartyRoleInActivity : "extends"
    ActivityAssignee }o--|| PartyRoleInActivity : "extends"
    ActivityOriginator }o--|| PartyRoleInActivity : "extends"
    ActivityPerformer }o--|| PartyRoleInActivity : "extends"
    EmploymentActivity }o--|| PartyActivity : "extends"
    PersonActivity }o--|| PartyActivity : "extends"
    GoalAssignor }o--|| PartyRoleInGoal : "extends"
    GoalAssignee }o--|| PartyRoleInGoal : "extends"
    CustomerActivity }o--|| PartyActivity : "extends"
    Activity }o--|| InformationModelObject : "extends"
    PartyActivity }o--|| Activity : "extends"
    PartyRolePlace }o--|| InformationModelObject : "extends"
    Creator }o--|| PartyRoleOnInsurableObject : "extends"
    Owner }o--|| PartyRoleOnInsurableObject : "extends"
    PhysicalObjectUser }o--|| PartyRoleOnInsurableObject : "extends"
    CopyEditor }o--|| PartyRoleInMarketing : "extends"
    MarketingManager }o--|| PartyRoleInMarketing : "extends"
    ArtDirector }o--|| PartyRoleInMarketing : "extends"
    MarketingSpecialist }o--|| PartyRoleInMarketing : "extends"
    GraphicsDesigner }o--|| PartyRoleInMarketing : "extends"
    Copywriter }o--|| PartyRoleInMarketing : "extends"
    ProjectManager }o--|| PartyRoleInMarketing : "extends"
    Lead_ }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    PartyMarketingInformation }o--|| PartyDetail : "extends"
    PersonName }o--|| PartyName : "extends"
    OrganizationName }o--|| PartyName : "extends"
    VirtualPartyName }o--|| PartyName : "extends"
    Party }o--|| InformationModelObject : "extends"
    Organization }o--|| Party : "extends"
    Person }o--|| Party : "extends"
    GeneralOwnershipInformation }o--|| PartyDetail : "extends"
    PersonDetail }o--|| PartyDetail : "extends"
    OrganizationDetail }o--|| PartyDetail : "extends"
    VirtualPartyDetail }o--|| PartyDetail : "extends"
    PartyDetail }o--|| InformationModelObject : "extends"
    VirtualParty }o--|| Party : "extends"
    Employee }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    Employer }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    Customer }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    HeadOfHousehold }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    OtherHouseholdMember }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    RepresentedParty }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    Representative }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    FamilyMember }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    Spouse }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    ServiceProvider }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    ParentOrganization }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    ChildOrganization }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    OwnedOrganization }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    OrganizationOwner }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    GroupMember }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    GroupManager }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    ShareHolder }o--|| PartyRoleInBusinessEntityRelationship : "extends"
    PartyName }o--|| InformationModelObject : "extends"
    RemoteMonitoringSystem }o--|| VirtualPartyDetail : "extends"
    ComputerSystem }o--|| VirtualPartyDetail : "extends"
    RemoteHealthMonitoringSystem }o--|| VirtualPartyDetail : "extends"
    InstalledSoftware }o--|| VirtualPartyDetail : "extends"
    VehicleTelematics }o--|| VirtualPartyDetail : "extends"
    AI_or_Robotics }o--|| VirtualPartyDetail : "extends"
    MembershipRegistration }o--|| PartyRegistration : "extends"
    OrganizationRegistration }o--|| PartyRegistration : "extends"
    PersonRegistration }o--|| PartyRegistration : "extends"
    FinancialServicesCompanyRegistration }o--|| PartyRoleRegistration : "extends"
    TaxRegistration }o--|| PartyRegistration : "extends"
    ProducerRegistration }o--|| PartyRoleRegistration : "extends"
    HealthCareProviderRegistration }o--|| PartyRoleRegistration : "extends"
    PartyRoleRegistration }o--|| PartyRegistration : "extends"
    AccessRegistration }o--|| PartyRegistration : "extends"
    Registration }o--|| InformationModelObject : "extends"
    PartyRegistration }o--|| Registration : "extends"
    RegistryAuthority }o--|| PartyRoleInRegistration : "extends"
    CatastropheReportingAgency }o--|| PartyRoleInRegistration : "extends"
    DepartmentofMotorVehicles }o--|| PartyRoleInRegistration : "extends"
    FoodandDrugAdministration }o--|| PartyRoleInRegistration : "extends"
    Role }o--|| InformationModelObject : "extends"
    PartyRoleRelationship }o--|| InformationModelObject : "extends"
    CivilRelationship }o--|| PartyRoleRelationship : "extends"
    FamilyRelationship }o--|| PartyRoleRelationship : "extends"
    ProducerRelationship }o--|| PartyRoleRelationship : "extends"
    LegalRepresentation }o--|| PartyRoleRelationship : "extends"
    CustomerRelationship }o--|| PartyRoleRelationship : "extends"
    ProfessionalServiceRelationship }o--|| PartyRoleRelationship : "extends"
    HouseholdRelationship }o--|| PartyRoleRelationship : "extends"
    EmploymentRelationship }o--|| PartyRoleRelationship : "extends"
    OrganizationRelationship }o--|| PartyRoleRelationship : "extends"
    OwnershipRelationship }o--|| PartyRoleRelationship : "extends"
    InsurancePoolRelationship }o--|| PartyRoleRelationship : "extends"
    CustomerRelationshipStatus }o--|| PartyRoleRelationshipStatus : "extends"
    GroupMembership }o--|| PartyRoleRelationship : "extends"
    PartyRoleInAgreement }o--|| PartyRole : "extends"
    PartyRoleInClaim }o--|| PartyRole : "extends"
    PartyRoleInBusinessEntityRelationship }o--|| PartyRole : "extends"
    PartyRoleInProduct }o--|| PartyRole : "extends"
    PartyRoleOnInsurableObject }o--|| PartyRole : "extends"
    PartyRoleInMarketing }o--|| PartyRole : "extends"
    PartyRoleInRegistration }o--|| PartyRole : "extends"
    PartyRoleInEvent }o--|| PartyRole : "extends"
    PartyRoleInActivity }o--|| PartyRole : "extends"
    PartyRoleInFinancialTransaction }o--|| PartyRole : "extends"
    PartyRoleInGoal }o--|| PartyRole : "extends"
    PartyRole }o--|| Role : "extends"
    PartyRoleRelationshipStatus }o--|| Status : "extends"
    ProductManager }o--|| PartyRoleInProduct : "extends"
    ProductDistributor }o--|| PartyRoleInProduct : "extends"
    ProductAdministrator }o--|| PartyRoleInProduct : "extends"
    PartyRoleInAgreementSpecification }o--|| RoleSpecification : "extends"
    PartyRoleInBusinessEntityRelationshipSpecification }o--|| RoleSpecification : "extends"

    ```
