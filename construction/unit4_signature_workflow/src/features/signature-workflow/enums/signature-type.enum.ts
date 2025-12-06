/**
 * Signature Type Enumeration
 * 
 * Defines the three types of signatures required in the sequential workflow:
 * 1. PREPARED_BY - First signature, acknowledges report preparation
 * 2. BRANCH_ACKNOWLEDGEMENT - Second signature, branch acknowledgement
 * 3. NISD_ACKNOWLEDGEMENT - Third signature, final NISD approval
 */
export enum SignatureType {
  PREPARED_BY = 'PREPARED_BY',
  BRANCH_ACKNOWLEDGEMENT = 'BRANCH_ACKNOWLEDGEMENT',
  NISD_ACKNOWLEDGEMENT = 'NISD_ACKNOWLEDGEMENT'
}
